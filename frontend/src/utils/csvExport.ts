import Papa from "papaparse";

export const convertToCSV = (jsonData: Record<string, unknown>[]): string =>
  Papa.unparse(jsonData, {
    header: true,
    skipEmptyLines: true,
  });

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export const downloadCSV = (rows: Record<string, unknown>[], filename: string) => {
  const csv = convertToCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, filename);
};

export const downloadJSON = (rows: Record<string, unknown>[], filename: string) => {
  const blob = new Blob([JSON.stringify(rows, null, 2)], {
    type: "application/json;charset=utf-8;",
  });
  downloadBlob(blob, filename);
};
