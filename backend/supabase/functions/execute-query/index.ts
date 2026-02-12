import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Client } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

import { clamp, corsHeaders, decryptPassword, mapExecutionError, validateSelectSql } from "../_shared/security.ts";

interface ExecuteQueryPayload {
  connectionId: string;
  queryId?: string | null;
  sql: string;
  timeoutMs?: number;
  maxRows?: number;
}

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const encryptionKey = Deno.env.get("SUPABASE_ENCRYPTION_KEY") ?? Deno.env.get("ENCRYPTION_KEY");

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey || !encryptionKey) {
    return new Response(
      JSON.stringify({ success: false, error: "Missing required environment variables." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized." }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser();

  if (authError || !user) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized." }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  let dbClient: Client | null = null;

  try {
    const payload = (await request.json()) as ExecuteQueryPayload;

    if (!payload.connectionId || !payload.sql) {
      throw new Error("connectionId and sql are required.");
    }

    const timeoutMs = clamp(Number(payload.timeoutMs ?? 30_000), 1_000, 30_000);
    const maxRows = clamp(Number(payload.maxRows ?? 1000), 1, 1000);
    const sanitizedSql = validateSelectSql(payload.sql, maxRows);

    const { data: connection, error: connectionError } = await adminClient
      .from("database_connections")
      .select("*")
      .eq("id", payload.connectionId)
      .eq("user_id", user.id)
      .single();

    if (connectionError || !connection) {
      return new Response(JSON.stringify({ success: false, error: "Connection not found." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (connection.database_type !== "postgresql") {
      return new Response(
        JSON.stringify({ success: false, error: "Only PostgreSQL execution is supported in this MVP." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const decryptedPassword = await decryptPassword(connection.encrypted_password, encryptionKey);

    dbClient = new Client({
      hostname: connection.host,
      port: connection.port,
      user: connection.username,
      password: decryptedPassword,
      database: connection.database_name,
      tls: {
        enabled: true,
        enforce: false,
      },
    });

    const startedAt = performance.now();

    await dbClient.connect();
    await dbClient.queryArray(`SET statement_timeout = ${timeoutMs}`);

    const result = await dbClient.queryObject<Record<string, unknown>>(sanitizedSql);
    const executionTime = Math.round(performance.now() - startedAt);

    const rowCount = Number(result.rowCount ?? result.rows.length ?? 0);
    const columns = result.rows.length ? Object.keys(result.rows[0]) : [];

    await adminClient.from("query_executions").insert({
      user_id: user.id,
      query_id: payload.queryId ?? null,
      executed_sql: sanitizedSql,
      rows_returned: rowCount,
      execution_time_ms: executionTime,
    });

    if (payload.queryId) {
      await adminClient
        .from("saved_queries")
        .update({ last_executed: new Date().toISOString() })
        .eq("id", payload.queryId)
        .eq("user_id", user.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        rows: result.rows,
        rowCount,
        executionTime,
        columns,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    const safeError = mapExecutionError(error);

    return new Response(JSON.stringify({ success: false, error: safeError }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } finally {
    if (dbClient) {
      try {
        await dbClient.end();
      } catch {
        // Ignore disconnect errors.
      }
    }
  }
});
