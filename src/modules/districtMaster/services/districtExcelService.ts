import * as XLSX from "xlsx";

export const downloadDistrictSampleExcel =
  () => {
    const sampleData = [
      {
        district_id: 100,
        district_name:
          "Bhopal",
        state_id: 10,
      },
      {
        district_id: 101,
        district_name:
          "Indore",
        state_id: 10,
      },
    ];

    const worksheet =
      XLSX.utils.json_to_sheet(
        sampleData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Districts"
    );

    XLSX.writeFile(
      workbook,
      "district_sample.xlsx"
    );
  };