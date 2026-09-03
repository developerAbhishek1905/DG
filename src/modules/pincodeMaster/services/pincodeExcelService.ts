import * as XLSX from "xlsx";

export const downloadPincodeSampleExcel = () => {
  const sampleData = [
    {
      pincode_id: 100,

      pincode_name: "452001",

      city_id: 10,
    },

    {
      pincode_id: "",

      pincode_name: "452020",

      city_id: 10,
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Pincodes");

  XLSX.writeFile(workbook, "pincode_sample.xlsx");
};
