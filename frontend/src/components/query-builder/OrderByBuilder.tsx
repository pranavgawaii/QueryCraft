import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import type { QueryOrderBy } from "@/types";

interface OrderByBuilderProps {
  orderBy: QueryOrderBy[];
  availableColumns: string[];
  onAddSort: () => void;
  onUpdateSort: (id: string, patch: Partial<QueryOrderBy>) => void;
  onRemoveSort: (id: string) => void;
  onMoveSort: (id: string, direction: "up" | "down") => void;
}

export const OrderByBuilder = ({
  orderBy,
  availableColumns,
  onAddSort,
  onUpdateSort,
  onRemoveSort,
  onMoveSort,
}: OrderByBuilderProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Order By</CardTitle>
        <Button size="sm" variant="outline" onClick={onAddSort}>
          <Plus className="mr-1 h-4 w-4" />
          Add Sort
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {!orderBy.length ? <p className="text-sm text-slate-500">No sort rules yet.</p> : null}

        {orderBy.map((sort, index) => (
          <div key={sort.id} className="grid gap-2 rounded-lg border border-slate-200 p-2 md:grid-cols-6">
            <div className="md:col-span-4">
              <Select
                value={sort.column}
                onChange={(event) => onUpdateSort(sort.id, { column: event.target.value })}
                options={[
                  { label: "Select column", value: "" },
                  ...availableColumns.map((column) => ({ label: column, value: column })),
                ]}
              />
            </div>

            <div>
              <Select
                value={sort.direction}
                onChange={(event) =>
                  onUpdateSort(sort.id, {
                    direction: event.target.value as QueryOrderBy["direction"],
                  })
                }
                options={[
                  { label: "ASC", value: "ASC" },
                  { label: "DESC", value: "DESC" },
                ]}
              />
            </div>

            <div className="flex items-center justify-end gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onMoveSort(sort.id, "up")}
                disabled={index === 0}
                aria-label="Move up"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onMoveSort(sort.id, "down")}
                disabled={index === orderBy.length - 1}
                aria-label="Move down"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onRemoveSort(sort.id)} aria-label="Remove">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
