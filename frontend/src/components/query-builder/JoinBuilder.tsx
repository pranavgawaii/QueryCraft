import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import type { QueryJoin, TableSchema } from "@/types";

interface JoinBuilderProps {
  joins: QueryJoin[];
  schema: TableSchema[];
  selectedTables: string[];
  onAddJoin: () => void;
  onUpdateJoin: (id: string, patch: Partial<QueryJoin>) => void;
  onRemoveJoin: (id: string) => void;
}

const joinTypeOptions = [
  { label: "INNER JOIN", value: "INNER JOIN" },
  { label: "LEFT JOIN", value: "LEFT JOIN" },
  { label: "RIGHT JOIN", value: "RIGHT JOIN" },
];

export const JoinBuilder = ({
  joins,
  schema,
  selectedTables,
  onAddJoin,
  onUpdateJoin,
  onRemoveJoin,
}: JoinBuilderProps) => {
  const allTableNames = schema.map((table) => table.name);
  const availableColumns = schema
    .filter((table) => selectedTables.includes(table.name))
    .flatMap((table) => table.columns.map((column) => `${table.name}.${column.name}`));
  const relationshipHints = schema.flatMap((table) =>
    table.columns
      .filter((column) => column.references)
      .map((column) => `${table.name}.${column.name} -> ${column.references?.table}.${column.references?.column}`),
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Join Builder</CardTitle>
        <Button size="sm" variant="outline" onClick={onAddJoin}>
          <Plus className="mr-1 h-4 w-4" />
          Add Join
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {!joins.length ? <p className="text-sm text-slate-500">No joins configured.</p> : null}

        {joins.map((join) => (
          <div key={join.id} className="rounded-lg border border-slate-200 p-3">
            <div className="grid gap-2 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Type</label>
                <Select
                  value={join.joinType}
                  onChange={(event) =>
                    onUpdateJoin(join.id, {
                      joinType: event.target.value as QueryJoin["joinType"],
                    })
                  }
                  options={joinTypeOptions}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Join Table</label>
                <Select
                  value={join.table}
                  onChange={(event) => onUpdateJoin(join.id, { table: event.target.value })}
                  options={[
                    { label: "Select table", value: "" },
                    ...allTableNames.map((table) => ({ label: table, value: table })),
                  ]}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Left Column</label>
                <Select
                  value={join.leftColumn}
                  onChange={(event) => onUpdateJoin(join.id, { leftColumn: event.target.value })}
                  options={[
                    { label: "Select column", value: "" },
                    ...availableColumns.map((column) => ({ label: column, value: column })),
                  ]}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Right Column</label>
                <Select
                  value={join.rightColumn}
                  onChange={(event) => onUpdateJoin(join.id, { rightColumn: event.target.value })}
                  options={[
                    { label: "Select column", value: "" },
                    ...availableColumns.map((column) => ({ label: column, value: column })),
                  ]}
                />
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
                {join.leftColumn || "table.col"} = {join.rightColumn || "table.col"}
              </div>
              <Button variant="ghost" size="sm" onClick={() => onRemoveJoin(join.id)}>
                <Trash2 className="mr-1 h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        ))}

        {relationshipHints.length ? (
          <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3">
            <p className="mb-1 text-xs font-semibold text-indigo-700">Relationship Diagram</p>
            <div className="space-y-1 text-xs text-indigo-800">
              {relationshipHints.map((hint) => (
                <p key={hint}>{hint}</p>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
