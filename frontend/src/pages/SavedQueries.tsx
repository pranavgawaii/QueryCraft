import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Folder, Loader2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useConnectionStore } from "@/stores/connectionStore";
import { useQueryBuilderStore } from "@/stores/queryBuilderStore";
import { useToastStore } from "@/stores/toastStore";
import type { SavedQuery } from "@/types";
import { supabase } from "@/utils/supabaseClient";

const fetchSavedQueries = async () => {
  const { data, error } = await supabase
    .from("saved_queries")
    .select("*, connection:database_connections(id, connection_name)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SavedQuery[];
};

export const SavedQueries = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pushToast } = useToastStore();
  const { setSelectedConnection } = useConnectionStore();
  const { setConnectionId, loadSavedQuery } = useQueryBuilderStore();

  const { data = [], isLoading } = useQuery({
    queryKey: ["saved-queries"],
    queryFn: fetchSavedQueries,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("saved_queries").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["saved-queries"] });
      pushToast({ type: "success", title: "Saved query deleted" });
    },
    onError: (error) => {
      pushToast({ type: "error", title: "Delete failed", description: error.message });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async (query: SavedQuery) => {
      const { error } = await supabase.from("saved_queries").insert({
        connection_id: query.connection_id,
        query_name: `${query.query_name} (copy)`,
        query_config: query.query_config,
        generated_sql: query.generated_sql,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["saved-queries"] });
      pushToast({ type: "success", title: "Saved query duplicated" });
    },
    onError: (error) => {
      pushToast({ type: "error", title: "Duplicate failed", description: error.message });
    },
  });

  const sortedData = useMemo(() => [...data], [data]);

  const onLoad = (query: SavedQuery) => {
    setSelectedConnection(query.connection_id);
    setConnectionId(query.connection_id);
    loadSavedQuery(query.query_config, query.generated_sql);
    navigate("/query-builder");
  };

  const onDelete = (id: string) => {
    if (!window.confirm("Delete this saved query?")) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Saved Queries</h1>
        <p className="text-sm text-slate-600">Load, duplicate, and manage reusable queries.</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
      ) : !sortedData.length ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Folder className="mb-2 h-10 w-10 text-slate-400" />
            <p className="text-sm font-medium">No saved queries yet</p>
            <p className="text-xs text-slate-500">Build a query and click Save Query to store it.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedData.map((query) => (
            <Card key={query.id}>
              <CardHeader>
                <CardTitle className="text-base">{query.query_name}</CardTitle>
                <p className="text-xs text-slate-500">
                  Connection: {query.connection?.connection_name ?? "Unknown"}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="line-clamp-2 text-xs text-slate-600">{query.generated_sql.slice(0, 100)}</p>
                <p className="text-xs text-slate-500">
                  Last executed: {query.last_executed ? new Date(query.last_executed).toLocaleString() : "Never"}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => onLoad(query)}>
                    Load
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => duplicateMutation.mutate(query)}>
                    {duplicateMutation.isPending ? (
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <Copy className="mr-1 h-4 w-4" />
                    )}
                    Duplicate
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(query.id)}>
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
