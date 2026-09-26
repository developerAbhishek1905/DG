// import * as XLSX from "xlsx";

import api from "../../../services/api/axios";

// export const downloadAreaSampleExcel = () => {
//   const sampleData = [
//     {
//       areaCode: "IND-VIJ-001",
//       areaName: "Vijay Nagar",
//       state_id: 23,
//       district_id: 45,
//       city_id: 10,
//       pincode_id: 5,
//       zone: "East",
//       latitude: 22.7533,
//       longitude: 75.8937,
//       status: "ACTIVE",
//     },
//     {
//       areaCode: "IND-PAL-002",
//       areaName: "Palasia",
//       state_id: 23,
//       district_id: 45,
//       city_id: 10,
//       pincode_id: 6,
//       zone: "Central",
//       latitude: 22.7246,
//       longitude: 75.8839,
//       status: "ACTIVE",
//     },
//   ];

//   const worksheet = XLSX.utils.json_to_sheet(sampleData);

//   worksheet["!cols"] = [
//     { wch: 18 },
//     { wch: 24 },
//     { wch: 12 },
//     { wch: 14 },
//     { wch: 12 },
//     { wch: 14 },
//     { wch: 15 },
//     { wch: 14 },
//     { wch: 14 },
//     { wch: 12 },
//   ];

//   const workbook = XLSX.utils.book_new();

//   XLSX.utils.book_append_sheet(workbook, worksheet, "Areas");

//   XLSX.writeFile(workbook, "area_sample.xlsx");
// };

/* =========================================================
   TYPES
========================================================= */

export interface LocationImportSummary {
  totalRows: number;
  processedRows: number;
  skippedRows: number;
  failedRows: number;

  statesCreated: number;
  statesExisting: number;

  districtsCreated: number;
  districtsExisting: number;

  citiesCreated: number;
  citiesExisting: number;
}

export interface LocationImportResult {
  row: number;

  status: "SUCCESS" | "FAILED";

  state_name?: string | null;
  district_name?: string | null;
  city_name?: string | null;

  stateStatus?: "CREATED" | "EXISTING";
  districtStatus?: "CREATED" | "EXISTING";
  cityStatus?: "CREATED" | "EXISTING";

  message: string;
}

export interface LocationImportResponse {
  success: boolean;
  message: string;

  summary: LocationImportSummary;

  results: LocationImportResult[];
}

/* =========================================================
   IMPORT LOCATION EXCEL
========================================================= */

export const importLocationExcel = async (
  file: File,
): Promise<LocationImportResponse> => {
  const formData = new FormData();

  /*
   * Must match:
   *
   * uploadExcel.single("file")
   */

  formData.append("file", file);

  const response = await api.post<LocationImportResponse>(
    "/areas/locations/import",
    formData,
  );

  return response.data;
};

/* =========================================================
   EXPORT LOCATION EXCEL
========================================================= */

export const exportLocationExcel = async (): Promise<void> => {
  const response = await api.get("/areas/locations/export", {
    responseType: "blob",
  });

  /*
   * Create browser download
   */

  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  /*
   * Download file name
   */

  link.download = `locations-${Date.now()}.xlsx`;

  document.body.appendChild(link);

  link.click();

  /*
   * Cleanup
   */

  link.remove();

  window.URL.revokeObjectURL(url);
};

/* =========================================================
   DOWNLOAD SAMPLE EXCEL
========================================================= */

export const downloadAreaSampleExcel = async () => {
  const response = await api.get(
    "/areas/locations/sample",
    {
      responseType: "blob",
    },
  );

  const blob = new Blob(
    [response.data],
    {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "location-import-sample.xlsx";

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};
