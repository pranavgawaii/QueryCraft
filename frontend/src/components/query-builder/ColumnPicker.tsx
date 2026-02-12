import { CheckCheck, Square } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { ColumnSelection, TableSchema } from "@/types";

interface ColumnPickerProps {
  schema: TableSchema[];
  selectedTables: string[];
  selectedColumns: ColumnSelection[];
  onToggleColumn: (column: ColumnSelection) => void;
}

const keyForColumn = (table: string, column: string) => `${table}.${column}`;

export const ColumnPicker = ({
  schema,
  selectedTables,
  selectedColumns,
  onToggleColumn,
}: ColumnPickerProps) => {
  const selectedLookup = new Set(selectedColumns.map((column) => keyForColumn(column.table, column.column)));

  const selectedSchema = schema.filter((table) => selectedTables.includes(table.name));

  const toggleAll = (tableName: string, columns: string[], checked: boolean) => {
    columns.forEach((column) => {
      const exists = selectedLookup.has(keyForColumn(tableName, column));
      if ((checked && !exists) || (!checked && exists)) {
        onToggleColumn({ table: tableName, column });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Columns</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedSchema.length ? (
          <p className="text-sm text-slate-500">Select at least one table to pick columns.</p>
        ) : null}

        {selectedSchema.map((table) => (
          <div key={table.name} className="rounded-lg border border-slate-200 p-3">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-800">{table.name}</h4>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleAll(table.name, table.columns.map((column) => column.name), true)}
                >
                  <CheckCheck className="mr-1 h-4 w-4" />
                  Select all
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleAll(table.name, table.columns.map((column) => column.name), false)}
                >
                  <Square className="mr-1 h-4 w-4" />
                  Deselect all
                </Button>
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {table.columns.map((column) => {
                const key = keyForColumn(table.name, column.name);
                const checked = selectedLookup.has(key);
                return (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleColumn({ table: table.name, column: column.name })}
                      aria-label={`Select column ${table.name}.${column.name}`}
                    />
                    <span className="min-w-0 flex-1 text-sm text-slate-700">{column.name}</span>
                    <span className="truncate text-xs text-slate-500">{column.dataType}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
