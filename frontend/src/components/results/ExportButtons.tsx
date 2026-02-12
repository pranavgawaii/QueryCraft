import { Download } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { downloadCSV, downloadJSON } from "@/utils/csvExport";

interface ExportButtonsProps {
  rows: Record<string, unknown>[];
}

const makeTimestampedFileName = (extension: "csv" | "json") => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-");
  return `query_results_${timestamp}.${extension}`;
};

export const ExportButtons = ({ rows }: ExportButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={() => downloadCSV(rows, makeTimestampedFileName("csv"))}>
        <Download className="mr-1 h-4 w-4" />
        Export CSV
      </Button>
      <Button variant="outline" size="sm" onClick={() => downloadJSON(rows, makeTimestampedFileName("json"))}>
        <Download className="mr-1 h-4 w-4" />
        Export JSON
      </Button>
    </div>
  );
};
