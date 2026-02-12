import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ConnectionForm } from "@/components/connections/ConnectionForm";
import { useConnectionStore } from "@/stores/connectionStore";
import { useToastStore } from "@/stores/toastStore";
import type { ConnectionFormInput } from "@/types";

export const ConnectionNew = () => {
  const navigate = useNavigate();
  const { addConnection, testConnection } = useConnectionStore();
  const { pushToast } = useToastStore();

  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (input: ConnectionFormInput) => {
    setIsSaving(true);
    const { error } = await addConnection(input);
    setIsSaving(false);

    if (error) {
      pushToast({
        type: "error",
        title: "Could not save connection",
        description: error,
      });
      return;
    }

    pushToast({
      type: "success",
      title: "Connection saved",
    });

    navigate("/connections");
  };

  const onTestConnection = async (input: ConnectionFormInput) => {
    const result = await testConnection(input);

    if (!result.ok) {
      pushToast({
        type: "error",
        title: "Could not connect",
        description: result.error ?? "Check your credentials.",
      });
      return;
    }

    pushToast({
      type: "success",
      title: "Connection successful",
    });
  };

  return (
    <ConnectionForm mode="create" onSubmit={onSubmit} onTestConnection={onTestConnection} isSaving={isSaving} />
  );
};
