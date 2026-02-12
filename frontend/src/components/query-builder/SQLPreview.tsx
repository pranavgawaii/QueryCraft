import { ClipboardCopy, WandSparkles } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface SQLPreviewProps {
  generatedSQL: string;
  manualSQL: string;
  onManualSQLChange: (sql: string) => void;
  onFormatSQL: () => void;
}

export const SQLPreview = ({
  generatedSQL,
  manualSQL,
  onManualSQLChange,
  onFormatSQL,
}: SQLPreviewProps) => {
  const activeSql = manualSQL || generatedSQL;

  const onCopy = async () => {
    await navigator.clipboard.writeText(activeSql || "");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Generated SQL</CardTitle>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={onFormatSQL}>
            <WandSparkles className="mr-1 h-4 w-4" />
            Format SQL
          </Button>
          <Button size="sm" variant="outline" onClick={onCopy}>
            <ClipboardCopy className="mr-1 h-4 w-4" />
            Copy
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="overflow-auto rounded-lg border border-slate-200">
          <SyntaxHighlighter
            language="sql"
            style={oneLight}
            customStyle={{ margin: 0, minHeight: "120px", background: "#f8fafc" }}
          >
            {activeSql || "SELECT *"}
          </SyntaxHighlighter>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Manual SQL Override</label>
          <textarea
            className="min-h-28 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={manualSQL}
            onChange={(event) => onManualSQLChange(event.target.value)}
            placeholder="Edit SQL manually for advanced use cases"
          />
        </div>
      </CardContent>
    </Card>
  );
};
