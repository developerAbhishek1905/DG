import * as XLSX from "xlsx";

export const downloadCitySampleExcel =
  () => {
    const sampleData = [
      {
        city_id: 100,
        city_name:
          "Bhopal",
        district_id:
          46,
        state_id:
          23,
      },
      {
        city_id: 101,
        city_name:
          "Indore",
        district_id:
          45,
        state_id:
          23,
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
      "Cities"
    );

    XLSX.writeFile(
      workbook,
      "city_sample.xlsx"
    );
  };