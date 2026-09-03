import * as XLSX from "xlsx";

import type {
  StateFormData,
  StateMaster,
} from "../types/state.types";

export const exportStatesToExcel = (
  states: StateMaster[]
) => {
  const excelData = states.map((state) => ({
    state_id: state.state_id,
    state_name: state.state_name,
  }));

  const worksheet =
    XLSX.utils.json_to_sheet(excelData);

  worksheet["!cols"] = [
    { wch: 12 },
    { wch: 30 },
  ];

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "States"
  );

  XLSX.writeFile(
    workbook,
    "state-master.xlsx"
  );
};

export const downloadStateSampleExcel = () => {
  const data = [
    {
      state_id: 1,
      state_name: "Madhya Pradesh",
    },
    {
      state_id: 2,
      state_name: "Maharashtra",
    },
    {
      state_id: 3,
      state_name: "Rajasthan",
    },
  ];

  const worksheet =
    XLSX.utils.json_to_sheet(data);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "States"
  );

  XLSX.writeFile(
    workbook,
    "state-import-sample.xlsx"
  );
};

export const readStateExcel = (
  file: File
): Promise<StateFormData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target?.result;

        if (!data) {
          throw new Error("Unable to read Excel file");
        }

        const workbook = XLSX.read(data, {
          type: "array",
        });

        const sheetName =
          workbook.SheetNames[0];

        const worksheet =
          workbook.Sheets[sheetName];

        const rows =
          XLSX.utils.sheet_to_json<
            Record<string, unknown>
          >(worksheet);

        const states: StateFormData[] = rows
          .map((row) => ({
            state_id: Number(row.state_id),

            state_name: String(
              row.state_name ?? ""
            ).trim(),
          }))
          .filter(
            (state) =>
              Number.isFinite(state.state_id) &&
              state.state_id > 0 &&
              state.state_name
          );

        resolve(states);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(
        new Error("Failed to read Excel file")
      );
    };

    reader.readAsArrayBuffer(file);
  });
};