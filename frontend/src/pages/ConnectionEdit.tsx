import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { ConnectionForm } from "@/components/connections/ConnectionForm";
import { useConnectionStore } from "@/stores/connectionStore";
import { useToastStore } from "@/stores/toastStore";
import type { ConnectionFormInput } from "@/types";

export const ConnectionEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { connections, fetchConnections, updateConnection, testConnection } = useConnectionStore();
  const { pushToast } = useToastStore();

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!connections.length) {
      void fetchConnections();
    }
  }, [connections.length, fetchConnections]);

  const connection = useMemo(() => connections.find((item) => item.id === id), [connections, id]);

  if (!id) {
    return <Navigate to="/connections" replace />;
  }

  if (!connection) {
    return <p className="text-sm text-slate-500">Loading connection...</p>;
  }

  const onSubmit = async (input: ConnectionFormInput) => {
    setIsSaving(true);
    const { error } = await updateConnection(id, input);
    setIsSaving(false);

    if (error) {
      pushToast({
        type: "error",
        title: "Could not update connection",
        description: error,
      });
      return;
    }

    pushToast({
      type: "success",
      title: "Connection updated",
    });

    navigate("/connections");
  };

  const onTestConnection = async (input: ConnectionFormInput) => {
    const result = await testConnection(input);

    if (!result.ok) {
      pushToast({
        type: "error",
        title: "Connection failed",
        description: result.error,
      });
      return;
    }

    pushToast({
      type: "success",
      title: "Connection successful",
    });
  };

  return (
    <ConnectionForm
      mode="edit"
      initialConnection={connection}
      onSubmit={onSubmit}
      onTestConnection={onTestConnection}
      isSaving={isSaving}
    />
  );
};
