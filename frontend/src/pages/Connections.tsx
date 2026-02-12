import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { ConnectionList } from "@/components/connections/ConnectionList";
import { Button } from "@/components/ui/Button";
import { useConnectionStore } from "@/stores/connectionStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useToastStore } from "@/stores/toastStore";

export const Connections = () => {
  const { connections, fetchConnections, deleteConnection } = useConnectionStore();
  const { settings, updateSettings } = useSettingsStore();
  const { pushToast } = useToastStore();

  useEffect(() => {
    void fetchConnections();
  }, [fetchConnections]);

  const onDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this database connection?");
    if (!confirmed) return;

    const { error } = await deleteConnection(id);

    if (error) {
      pushToast({
        type: "error",
        title: "Could not delete connection",
        description: error,
      });
      return;
    }

    if (settings.defaultConnectionId === id) {
      updateSettings({ defaultConnectionId: null });
    }

    pushToast({
      type: "success",
      title: "Connection deleted",
    });
  };

  const onSetDefault = (id: string) => {
    updateSettings({ defaultConnectionId: id });
    pushToast({
      type: "success",
      title: "Default connection updated",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Database Connections</h1>
          <p className="text-sm text-slate-600">Manage and secure your connection credentials.</p>
        </div>

        <Link to="/connections/new">
          <Button>
            <Plus className="mr-1 h-4 w-4" />
            Add Connection
          </Button>
        </Link>
      </div>

      <ConnectionList
        connections={connections}
        defaultConnectionId={settings.defaultConnectionId}
        onSetDefault={onSetDefault}
        onDelete={onDelete}
      />
    </div>
  );
};
