import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Client } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

import { corsHeaders, decryptPassword, mapExecutionError } from "../_shared/security.ts";

interface FetchSchemaPayload {
  connectionId: string;
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
    return new Response(JSON.stringify({ success: false, error: "Missing environment variables." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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
    const payload = (await request.json()) as FetchSchemaPayload;

    if (!payload.connectionId) {
      throw new Error("connectionId is required");
    }

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
        JSON.stringify({ success: false, error: "Only PostgreSQL schema fetch is supported in this MVP." }),
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

    await dbClient.connect();

    const schemaQuery = `
      select
        c.table_name,
        c.column_name,
        c.data_type,
        (c.is_nullable = 'YES') as nullable,
        exists (
          select 1
          from information_schema.table_constraints tc
          join information_schema.key_column_usage kcu
            on tc.constraint_name = kcu.constraint_name
           and tc.table_schema = kcu.table_schema
          where tc.constraint_type = 'PRIMARY KEY'
            and tc.table_schema = 'public'
            and tc.table_name = c.table_name
            and kcu.column_name = c.column_name
        ) as is_primary_key,
        ccu.table_name as ref_table,
        ccu.column_name as ref_column
      from information_schema.columns c
      left join information_schema.key_column_usage kcu
        on c.table_schema = kcu.table_schema
       and c.table_name = kcu.table_name
       and c.column_name = kcu.column_name
      left join information_schema.table_constraints tc
        on kcu.constraint_name = tc.constraint_name
       and kcu.table_schema = tc.table_schema
       and tc.constraint_type = 'FOREIGN KEY'
      left join information_schema.constraint_column_usage ccu
        on tc.constraint_name = ccu.constraint_name
       and tc.table_schema = ccu.table_schema
      where c.table_schema = 'public'
      order by c.table_name, c.ordinal_position
    `;

    const { rows } = await dbClient.queryObject<{
      table_name: string;
      column_name: string;
      data_type: string;
      nullable: boolean;
      is_primary_key: boolean;
      ref_table: string | null;
      ref_column: string | null;
    }>(schemaQuery);

    const tableMap = new Map<
      string,
      {
        name: string;
        columns: Array<{
          name: string;
          dataType: string;
          nullable: boolean;
          isPrimaryKey: boolean;
          references: { table: string; column: string } | null;
        }>;
      }
    >();

    for (const row of rows) {
      const table = tableMap.get(row.table_name) ?? { name: row.table_name, columns: [] };

      table.columns.push({
        name: row.column_name,
        dataType: row.data_type,
        nullable: row.nullable,
        isPrimaryKey: row.is_primary_key,
        references:
          row.ref_table && row.ref_column
            ? {
                table: row.ref_table,
                column: row.ref_column,
              }
            : null,
      });

      tableMap.set(row.table_name, table);
    }

    const tables = [...tableMap.values()];

    return new Response(JSON.stringify({ success: true, tables }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: mapExecutionError(error) }), {
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
