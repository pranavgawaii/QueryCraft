import { Button } from "@/components/ui/Button";

interface PaginationControlsProps {
  page: number;
  pageSize: number;
  totalRows: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls = ({
  page,
  pageSize,
  totalRows,
  onPageChange,
}: PaginationControlsProps) => {
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

  return (
    <div className="flex items-center justify-between text-sm">
      <p className="text-slate-600">
        Page {page} of {totalPages}
      </p>

      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Previous
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
