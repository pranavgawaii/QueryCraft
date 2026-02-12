import { create } from "zustand";

import type { ConnectionFormInput, DatabaseConnection } from "@/types";
import { encryptPassword } from "@/utils/encryption";
import { supabase } from "@/utils/supabaseClient";

interface ConnectionState {
  connections: DatabaseConnection[];
  selectedConnectionId: string | null;
  isLoading: boolean;
  fetchConnections: () => Promise<void>;
  addConnection: (input: ConnectionFormInput) => Promise<{ error?: string }>;
  updateConnection: (id: string, input: ConnectionFormInput) => Promise<{ error?: string }>;
  deleteConnection: (id: string) => Promise<{ error?: string }>;
  testConnection: (input: ConnectionFormInput) => Promise<{ ok: boolean; error?: string }>;
  setSelectedConnection: (id: string | null) => void;
}

export const useConnectionStore = create<ConnectionState>((set, get) => ({
  connections: [],
  selectedConnectionId: null,
  isLoading: false,

  fetchConnections: async () => {
    set({ isLoading: true });

    const { data, error } = await supabase
      .from("database_connections")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      set({ isLoading: false });
      return;
    }

    set((state) => ({
      connections: (data as DatabaseConnection[]) ?? [],
      isLoading: false,
      selectedConnectionId:
        state.selectedConnectionId ?? (data && data.length ? (data[0] as DatabaseConnection).id : null),
    }));
  },

  addConnection: async (input) => {
    const encrypted_password = await encryptPassword(input.password);

    const { error } = await supabase.from("database_connections").insert({
      connection_name: input.connection_name,
      host: input.host,
      port: input.port,
      database_name: input.database_name,
      username: input.username,
      encrypted_password,
      database_type: input.database_type,
      is_active: input.is_active,
    });

    if (error) {
      return { error: error.message };
    }

    await get().fetchConnections();
    return {};
  },

  updateConnection: async (id, input) => {
    const updates: Partial<DatabaseConnection> & { encrypted_password?: string } = {
      connection_name: input.connection_name,
      host: input.host,
      port: input.port,
      database_name: input.database_name,
      username: input.username,
      database_type: input.database_type,
      is_active: input.is_active,
      updated_at: new Date().toISOString(),
    };

    if (input.password.trim()) {
      updates.encrypted_password = await encryptPassword(input.password);
    }

    const { error } = await supabase.from("database_connections").update(updates).eq("id", id);

    if (error) {
      return { error: error.message };
    }

    await get().fetchConnections();
    return {};
  },

  deleteConnection: async (id) => {
    const { error } = await supabase.from("database_connections").delete().eq("id", id);

    if (error) {
      return { error: error.message };
    }

    const selectedConnectionId = get().selectedConnectionId;
    if (selectedConnectionId === id) {
      set({ selectedConnectionId: null });
    }

    await get().fetchConnections();

    return {};
  },

  testConnection: async (input) => {
    const { data, error } = await supabase.functions.invoke("test-connection", {
      body: {
        host: input.host,
        port: input.port,
        databaseName: input.database_name,
        username: input.username,
        password: input.password,
        databaseType: input.database_type,
      },
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    if (!data?.success) {
      return { ok: false, error: data?.error ?? "Connection failed" };
    }

    return { ok: true };
  },

  setSelectedConnection: (id) => {
    set({ selectedConnectionId: id });
  },
}));
