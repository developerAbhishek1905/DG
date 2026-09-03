import * as XLSX from "xlsx";

export const downloadAreaSampleExcel = () => {
  const sampleData = [
    {
      areaCode: "IND-VIJ-001",
      areaName: "Vijay Nagar",
      state_id: 23,
      district_id: 45,
      city_id: 10,
      pincode_id: 5,
      zone: "East",
      latitude: 22.7533,
      longitude: 75.8937,
      status: "ACTIVE",
    },
    {
      areaCode: "IND-PAL-002",
      areaName: "Palasia",
      state_id: 23,
      district_id: 45,
      city_id: 10,
      pincode_id: 6,
      zone: "Central",
      latitude: 22.7246,
      longitude: 75.8839,
      status: "ACTIVE",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);

  worksheet["!cols"] = [
    { wch: 18 },
    { wch: 24 },
    { wch: 12 },
    { wch: 14 },
    { wch: 12 },
    { wch: 14 },
    { wch: 15 },
    { wch: 14 },
    { wch: 14 },
    { wch: 12 },
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Areas");

  XLSX.writeFile(workbook, "area_sample.xlsx");
};
