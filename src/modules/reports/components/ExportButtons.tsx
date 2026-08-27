import {
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

import type {
  ReportColumn,
  ReportRow,
} from "../types/report.types";

interface Props {
  title: string;
  columns: ReportColumn[];
  rows: ReportRow[];
}

export default function ExportButtons({
  title,
  columns,
  rows,
}: Props) {
  const exportCSV = () => {
    const headers =
      columns.map(
        (column) =>
          `"${column.label}"`
      );

    const body =
      rows.map((row) =>
        columns
          .map(
            (column) => {
              const value =
                String(
                  row[
                    column.key
                  ] ?? ""
                ).replaceAll(
                  '"',
                  '""'
                );

              return `"${value}"`;
            }
          )
          .join(",")
      );

    const csv = [
      headers.join(","),
      ...body,
    ].join("\n");

    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `${title
        .toLowerCase()
        .replaceAll(
          " ",
          "-"
        )}.csv`;

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();

    URL.revokeObjectURL(
      url
    );
  };

  const exportExcel =
    () => {
      alert(
        "Excel export will be connected to the backend export API."
      );
    };

  const exportPDF =
    () => {
      alert(
        "PDF export will be connected to the backend export API."
      );
    };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={exportCSV}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
      >
        <Download
          size={16}
        />

        CSV
      </button>

      <button
        onClick={
          exportExcel
        }
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
      >
        <FileSpreadsheet
          size={16}
        />

        Excel
      </button>

      <button
        onClick={exportPDF}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
      >
        <FileText
          size={16}
        />

        PDF
      </button>
    </div>
  );
}