import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { TableSchema } from "@/types";

interface TableSelectorProps {
  schema: TableSchema[];
  selectedTables: string[];
  onAddTable: (tableName: string) => void;
  onRemoveTable: (tableName: string) => void;
}

export const TableSelector = ({
  schema,
  selectedTables,
  onAddTable,
  onRemoveTable,
}: TableSelectorProps) => {
  const [query, setQuery] = useState("");

  const filteredTables = useMemo(
    () => schema.filter((table) => table.name.toLowerCase().includes(query.trim().toLowerCase())),
    [schema, query],
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm">Tables</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tables"
            className="pl-9"
          />
        </div>

        <div className="max-h-[420px] space-y-2 overflow-auto pr-1">
          {filteredTables.map((table) => {
            const selected = selectedTables.includes(table.name);
            return (
              <div
                key={table.name}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{table.name}</p>
                  <p className="text-xs text-slate-500">{table.columns.length} columns</p>
                </div>

                {selected ? (
                  <Button variant="ghost" size="sm" onClick={() => onRemoveTable(table.name)}>
                    <X className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => onAddTable(table.name)}>
                    <Plus className="mr-1 h-4 w-4" /> Add
                  </Button>
                )}
              </div>
            );
          })}

          {!filteredTables.length ? (
            <p className="text-center text-sm text-slate-500">No tables found.</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};
