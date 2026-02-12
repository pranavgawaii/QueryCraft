import { Database, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import type { DatabaseConnection } from "@/types";

interface ConnectionCardProps {
  connection: DatabaseConnection;
  isDefault: boolean;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ConnectionCard = ({
  connection,
  isDefault,
  onSetDefault,
  onDelete,
}: ConnectionCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-4 w-4 text-indigo-500" />
              {connection.connection_name}
            </CardTitle>
            <CardDescription>{connection.database_type.toUpperCase()}</CardDescription>
          </div>
          {isDefault ? (
            <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">
              Default
            </span>
          ) : null}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-1 text-sm text-slate-600">
          <p>
            <span className="font-medium text-slate-700">Host:</span> {connection.host}:{connection.port}
          </p>
          <p>
            <span className="font-medium text-slate-700">Database:</span> {connection.database_name}
          </p>
          <p>
            <span className="font-medium text-slate-700">User:</span> {connection.username}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link to={`/connections/${connection.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </Button>
          </Link>

          <Button variant="ghost" size="sm" onClick={() => onSetDefault(connection.id)}>
            Set Default
          </Button>

          <Button variant="destructive" size="sm" onClick={() => onDelete(connection.id)}>
            <Trash2 className="mr-1 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
