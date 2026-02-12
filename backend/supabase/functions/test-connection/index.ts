import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Client } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

import { corsHeaders, mapExecutionError } from "../_shared/security.ts";

interface TestConnectionPayload {
  host: string;
  port: number;
  databaseName: string;
  username: string;
  password: string;
  databaseType: "postgresql" | "mysql";
}

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
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
    error,
  } = await authClient.auth.getUser();

  if (error || !user) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized." }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let dbClient: Client | null = null;

  try {
    const payload = (await request.json()) as TestConnectionPayload;

    if (payload.databaseType !== "postgresql") {
      return new Response(
        JSON.stringify({ success: false, error: "Only PostgreSQL test connection is supported in this MVP." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    dbClient = new Client({
      hostname: payload.host,
      port: payload.port,
      user: payload.username,
      password: payload.password,
      database: payload.databaseName,
      tls: {
        enabled: true,
        enforce: false,
      },
    });

    await dbClient.connect();
    await dbClient.queryArray("SELECT 1");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: mapExecutionError(err) }), {
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
