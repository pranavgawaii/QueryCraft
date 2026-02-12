import { useEffect, useMemo, useState } from "react";
import { ArrowDownAZ, ArrowUpAZ, Database } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PaginationControls } from "@/components/results/PaginationControls";
import type { QueryExecutionResult } from "@/types";

interface ResultsTableProps {
  result: QueryExecutionResult | null;
}

type SortDirection = "asc" | "desc";

export const ResultsTable = ({ result }: ResultsTableProps) => {
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const pageSize = 50;

  useEffect(() => {
    setPage(1);
  }, [result]);

  const sortedRows = useMemo(() => {
    if (!result) return [];
    if (!sortColumn) return result.rows;

    return [...result.rows].sort((a, b) => {
      const left = a[sortColumn];
      const right = b[sortColumn];

      if (left === right) return 0;
      if (left == null) return 1;
      if (right == null) return -1;

      const leftText = String(left);
      const rightText = String(right);
      const base = leftText.localeCompare(rightText, undefined, { numeric: true, sensitivity: "base" });
      return sortDirection === "asc" ? base : -base;
    });
  }, [result, sortColumn, sortDirection]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, page]);

  if (!result) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Database className="mb-3 h-12 w-12 text-slate-400" />
          <p className="text-sm font-medium text-slate-800">Run a query to see results</p>
          <p className="text-xs text-slate-500">No results found yet.</p>
        </CardContent>
      </Card>
    );
  }

  if (!result.rows.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Database className="mb-3 h-12 w-12 text-slate-400" />
          <p className="text-sm font-medium text-slate-800">No results found</p>
          <p className="text-xs text-slate-500">Query returned 0 rows.</p>
        </CardContent>
      </Card>
    );
  }

  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, result.rowCount);

  const toggleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }

    setSortColumn(column);
    setSortDirection("asc");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Results</CardTitle>
        <div className="text-xs text-slate-600">
          Showing {startIndex}-{endIndex} of {result.rowCount} results. Query executed in {result.executionTime}
          ms.
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="overflow-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {result.columns.map((column) => (
                  <th key={column} className="px-3 py-2 text-left font-medium text-slate-700">
                    <button
                      type="button"
                      onClick={() => toggleSort(column)}
                      className="inline-flex items-center gap-1 hover:text-indigo-600"
                    >
                      {column}
                      {sortColumn === column ?
                        sortDirection === "asc" ? (
                          <ArrowUpAZ className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDownAZ className="h-3.5 w-3.5" />
                        )
                      : null}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-slate-50">
                  {result.columns.map((column) => (
                    <td key={`${rowIndex}-${column}`} className="max-w-sm truncate px-3 py-2 text-slate-700">
                      {String(row[column] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PaginationControls page={page} pageSize={pageSize} totalRows={result.rowCount} onPageChange={setPage} />
      </CardContent>
    </Card>
  );
};
