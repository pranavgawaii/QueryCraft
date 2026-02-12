import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { QueryCondition } from "@/types";

interface WhereBuilderProps {
  title: string;
  conditions: QueryCondition[];
  availableColumns: string[];
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<QueryCondition>) => void;
  onRemove: (id: string) => void;
}

const operatorOptions = [
  "=",
  "!=",
  ">",
  "<",
  ">=",
  "<=",
  "LIKE",
  "IN",
  "IS NULL",
  "IS NOT NULL",
] as const;

export const WhereBuilder = ({
  title,
  conditions,
  availableColumns,
  onAdd,
  onUpdate,
  onRemove,
}: WhereBuilderProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">{title}</CardTitle>
        <Button size="sm" variant="outline" onClick={onAdd}>
          <Plus className="mr-1 h-4 w-4" />
          Add Condition
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {!conditions.length ? (
          <p className="text-sm text-slate-500">No conditions yet.</p>
        ) : null}

        {conditions.map((condition, index) => {
          const hideValue = condition.operator === "IS NULL" || condition.operator === "IS NOT NULL";

          return (
            <div key={condition.id} className="rounded-lg border border-slate-200 p-3">
              <div className="grid gap-2 md:grid-cols-6">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-slate-600">Column</label>
                  <Select
                    value={condition.column}
                    onChange={(event) => onUpdate(condition.id, { column: event.target.value })}
                    options={[
                      { label: "Select column", value: "" },
                      ...availableColumns.map((column) => ({ label: column, value: column })),
                    ]}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Operator</label>
                  <Select
                    value={condition.operator}
                    onChange={(event) =>
                      onUpdate(condition.id, {
                        operator: event.target.value as QueryCondition["operator"],
                      })
                    }
                    options={operatorOptions.map((operator) => ({ label: operator, value: operator }))}
                  />
                </div>

                {!hideValue ? (
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-600">Value</label>
                    <Input
                      value={condition.value ?? ""}
                      placeholder={condition.operator === "IN" ? "e.g. 1,2,3" : "Value"}
                      onChange={(event) => onUpdate(condition.id, { value: event.target.value })}
                    />
                  </div>
                ) : (
                  <div className="md:col-span-2" />
                )}

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Group</label>
                  <Input
                    type="number"
                    min={0}
                    value={condition.group}
                    onChange={(event) => onUpdate(condition.id, { group: Number(event.target.value || 0) })}
                  />
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                {index > 0 ? (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span>Connector</span>
                    <Select
                      className="h-8"
                      value={condition.connector}
                      onChange={(event) =>
                        onUpdate(condition.id, {
                          connector: event.target.value as QueryCondition["connector"],
                        })
                      }
                      options={[
                        { label: "AND", value: "AND" },
                        { label: "OR", value: "OR" },
                      ]}
                    />
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">First condition</span>
                )}

                <Button variant="ghost" size="sm" onClick={() => onRemove(condition.id)}>
                  <Trash2 className="mr-1 h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
