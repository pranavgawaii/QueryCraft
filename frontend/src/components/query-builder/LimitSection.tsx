import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

interface LimitSectionProps {
  limit: number | null;
  offset: number | null;
  onChangeLimit: (limit: number | null) => void;
  onChangeOffset: (offset: number | null) => void;
}

export const LimitSection = ({
  limit,
  offset,
  onChangeLimit,
  onChangeOffset,
}: LimitSectionProps) => {
  const quickLimits = [10, 50, 100, 1000];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Limit / Offset</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Limit</label>
            <Input
              type="number"
              min={0}
              value={limit ?? ""}
              onChange={(event) => onChangeLimit(event.target.value ? Number(event.target.value) : null)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Offset</label>
            <Input
              type="number"
              min={0}
              value={offset ?? ""}
              onChange={(event) => onChangeOffset(event.target.value ? Number(event.target.value) : null)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickLimits.map((quickLimit) => (
            <Button key={quickLimit} size="sm" variant="outline" onClick={() => onChangeLimit(quickLimit)}>
              {quickLimit}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
