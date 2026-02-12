import { Database } from "lucide-react";

import { ConnectionCard } from "@/components/connections/ConnectionCard";
import { Card, CardContent } from "@/components/ui/Card";
import type { DatabaseConnection } from "@/types";

interface ConnectionListProps {
  connections: DatabaseConnection[];
  defaultConnectionId: string | null;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ConnectionList = ({
  connections,
  defaultConnectionId,
  onSetDefault,
  onDelete,
}: ConnectionListProps) => {
  if (!connections.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <Database className="mb-3 h-10 w-10 text-slate-400" />
          <p className="text-sm font-medium text-slate-800">No database connections yet</p>
          <p className="text-xs text-slate-500">Add your first connection to start building queries.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {connections.map((connection) => (
        <ConnectionCard
          key={connection.id}
          connection={connection}
          isDefault={defaultConnectionId === connection.id}
          onSetDefault={onSetDefault}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
