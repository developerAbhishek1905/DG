import type {
  ReportColumn,
  ReportRow,
} from "../types/report.types";

interface Props {
  columns: ReportColumn[];
  rows: ReportRow[];
}

export default function ReportTable({
  columns,
  rows,
}: Props) {
  if (!rows.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <p className="text-sm text-gray-500">
          No report records found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {columns.map(
                (column) => (
                  <th
                    key={column.key}
                    className={`whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase text-gray-500 ${
                      column.align ===
                      "right"
                        ? "text-right"
                        : column.align ===
                          "center"
                        ? "text-center"
                        : "text-left"
                    }`}
                  >
                    {
                      column.label
                    }
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {rows.map(
              (row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50"
                >
                  {columns.map(
                    (
                      column
                    ) => {
                      const value =
                        row[
                          column
                            .key
                        ];

                      return (
                        <td
                          key={
                            column.key
                          }
                          className={`whitespace-nowrap px-5 py-4 text-sm text-gray-700 ${
                            column.align ===
                            "right"
                              ? "text-right"
                              : column.align ===
                                "center"
                              ? "text-center"
                              : "text-left"
                          }`}
                        >
                          {String(
                            value ??
                              "-"
                          )}
                        </td>
                      );
                    }
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}