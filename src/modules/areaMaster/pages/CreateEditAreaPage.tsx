import { useState } from "react";
import { toast } from "react-toastify";
import AreaForm from "../components/AreaForm";
import AreaExcelActions from "../components/AreaExcelActions";
import {
  exportLocationExcel,
  importLocationExcel,
} from "../services/areaExcelService";

/**
 * Area Master opens straight on the form (no listing page).
 */
export default function CreateEditAreaPage() {
  const [excelLoading, setExcelLoading] = useState(false);

  const handleImport = async (file: File) => {
    try {
      setExcelLoading(true);

      const response = await importLocationExcel(file);
      const { summary } = response;
      const failed = response.results.filter((r) => r.status === "FAILED");

      toast.success(
        `Import completed. ${summary.processedRows} rows processed, ${summary.failedRows} failed. New: ${summary.statesCreated} states, ${summary.districtsCreated} districts, ${summary.citiesCreated} cities, ${summary.pincodesCreated ?? 0} pincodes.`,
      );

      if (failed.length > 0) {
        const preview = failed
          .slice(0, 3)
          .map((r) => `Row ${r.row}: ${r.message}`)
          .join(" | ");

        toast.warn(
          `${failed.length} row(s) failed. ${preview}${failed.length > 3 ? " ..." : ""}`,
          { autoClose: 10000 },
        );
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to import Excel",
      );
    } finally {
      setExcelLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExcelLoading(true);
      await exportLocationExcel();
      toast.success("Location Excel exported successfully");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to export Excel",
      );
    } finally {
      setExcelLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Area Master</h1>

        <AreaExcelActions
          loading={excelLoading}
          onImport={handleImport}
          onExport={handleExport}
        />
      </div>

      <AreaForm />
    </div>
  );
}
