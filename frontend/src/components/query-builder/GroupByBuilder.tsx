import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface GroupByBuilderProps {
  availableColumns: string[];
  selectedGroupBy: string[];
  onToggleGroupBy: (column: string) => void;
}

export const GroupByBuilder = ({
  availableColumns,
  selectedGroupBy,
  onToggleGroupBy,
}: GroupByBuilderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Group By</CardTitle>
      </CardHeader>
      <CardContent>
        {!availableColumns.length ? <p className="text-sm text-slate-500">No columns available.</p> : null}

        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {availableColumns.map((column) => (
            <label
              key={column}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5"
            >
              <input
                type="checkbox"
                checked={selectedGroupBy.includes(column)}
                onChange={() => onToggleGroupBy(column)}
                aria-label={`Toggle group by ${column}`}
              />
              <span className="text-sm text-slate-700">{column}</span>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
