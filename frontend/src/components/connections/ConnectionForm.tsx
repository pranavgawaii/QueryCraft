import { useMemo, useState, type FormEvent } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { ConnectionFormInput, DatabaseConnection } from "@/types";

interface ConnectionFormProps {
  mode: "create" | "edit";
  initialConnection?: DatabaseConnection;
  onSubmit: (input: ConnectionFormInput) => Promise<void>;
  onTestConnection: (input: ConnectionFormInput) => Promise<void>;
  isSaving: boolean;
}

const defaultConnectionInput: ConnectionFormInput = {
  connection_name: "",
  host: "",
  port: 5432,
  database_name: "",
  username: "",
  password: "",
  database_type: "postgresql",
  is_active: true,
};

export const ConnectionForm = ({
  mode,
  initialConnection,
  onSubmit,
  onTestConnection,
  isSaving,
}: ConnectionFormProps) => {
  const [form, setForm] = useState<ConnectionFormInput>(() => {
    if (!initialConnection) {
      return defaultConnectionInput;
    }

    return {
      connection_name: initialConnection.connection_name,
      host: initialConnection.host,
      port: initialConnection.port,
      database_name: initialConnection.database_name,
      username: initialConnection.username,
      password: "",
      database_type: initialConnection.database_type,
      is_active: initialConnection.is_active,
    };
  });

  const submitLabel = useMemo(
    () => (mode === "create" ? "Save Connection" : "Update Connection"),
    [mode],
  );

  const updateField = <K extends keyof ConnectionFormInput>(key: K, value: ConnectionFormInput[K]) => {
    setForm((state) => ({
      ...state,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(form);
  };

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>{mode === "create" ? "Add Database Connection" : "Edit Connection"}</CardTitle>
        <CardDescription>
          Configure read-only database credentials. QueryCraft stores your password encrypted with AES-256.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4" />
            <p>Use read-only credentials for safety.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Connection Name</label>
              <Input
                required
                value={form.connection_name}
                onChange={(event) => updateField("connection_name", event.target.value)}
                placeholder="Production DB"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Database Type</label>
              <Select
                value={form.database_type}
                onChange={(event) => updateField("database_type", event.target.value as ConnectionFormInput["database_type"])}
                options={[
                  { label: "PostgreSQL", value: "postgresql" },
                  { label: "MySQL", value: "mysql" },
                ]}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Host/IP</label>
              <Input
                required
                value={form.host}
                onChange={(event) => updateField("host", event.target.value)}
                placeholder="db.example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Port</label>
              <Input
                type="number"
                required
                value={form.port}
                onChange={(event) => updateField("port", Number(event.target.value || 0))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Database Name</label>
              <Input
                required
                value={form.database_name}
                onChange={(event) => updateField("database_name", event.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Username</label>
              <Input
                required
                value={form.username}
                onChange={(event) => updateField("username", event.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">
                Password {mode === "edit" ? "(leave blank to keep existing)" : ""}
              </label>
              <Input
                type="password"
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                required={mode === "create"}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" isLoading={isSaving}>
              {submitLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onTestConnection(form)}
              disabled={!form.host || !form.username || !form.database_name || !form.password}
            >
              Test Connection
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
