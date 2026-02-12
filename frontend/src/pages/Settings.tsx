import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAuthStore } from "@/stores/authStore";
import { useConnectionStore } from "@/stores/connectionStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useToastStore } from "@/stores/toastStore";

export const Settings = () => {
  const { user, updatePassword } = useAuthStore();
  const { connections, fetchConnections } = useConnectionStore();
  const { settings, updateSettings } = useSettingsStore();
  const { pushToast } = useToastStore();

  const [newPassword, setNewPassword] = useState("");
  const [queryTimeoutSeconds, setQueryTimeoutSeconds] = useState(settings.queryTimeoutSeconds);
  const [maxRowsLimit, setMaxRowsLimit] = useState(settings.maxRowsLimit);
  const [defaultConnectionId, setDefaultConnectionId] = useState(settings.defaultConnectionId ?? "");

  useEffect(() => {
    void fetchConnections();
  }, [fetchConnections]);

  useEffect(() => {
    setQueryTimeoutSeconds(settings.queryTimeoutSeconds);
    setMaxRowsLimit(settings.maxRowsLimit);
    setDefaultConnectionId(settings.defaultConnectionId ?? "");
  }, [settings]);

  const onChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword.length < 8) {
      pushToast({ type: "error", title: "Password must be at least 8 characters" });
      return;
    }

    const { error } = await updatePassword(newPassword);

    if (error) {
      pushToast({ type: "error", title: "Password update failed", description: error });
      return;
    }

    setNewPassword("");
    pushToast({ type: "success", title: "Password updated" });
  };

  const onSavePreferences = () => {
    updateSettings({
      defaultConnectionId: defaultConnectionId || null,
      queryTimeoutSeconds: Math.max(1, queryTimeoutSeconds),
      maxRowsLimit: Math.max(1, maxRowsLimit),
    });

    pushToast({ type: "success", title: "Settings saved" });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Manage account details and password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <Input value={user?.email ?? ""} disabled />
          </div>

          <form onSubmit={onChangePassword} className="space-y-2">
            <div>
              <label className="mb-1 block text-sm font-medium">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="At least 8 characters"
              />
            </div>
            <Button type="submit" variant="outline">
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Query Preferences</CardTitle>
          <CardDescription>Control default connection and execution safety limits.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Default Connection</label>
            <Select
              value={defaultConnectionId}
              onChange={(event) => setDefaultConnectionId(event.target.value)}
              options={[
                { label: "None", value: "" },
                ...connections.map((connection) => ({
                  label: connection.connection_name,
                  value: connection.id,
                })),
              ]}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Query Timeout (seconds)</label>
              <Input
                type="number"
                min={1}
                max={30}
                value={queryTimeoutSeconds}
                onChange={(event) => setQueryTimeoutSeconds(Number(event.target.value || 30))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Max Rows Limit</label>
              <Input
                type="number"
                min={1}
                max={5000}
                value={maxRowsLimit}
                onChange={(event) => setMaxRowsLimit(Number(event.target.value || 1000))}
              />
            </div>
          </div>

          <Button onClick={onSavePreferences}>Save Preferences</Button>
        </CardContent>
      </Card>
    </div>
  );
};
