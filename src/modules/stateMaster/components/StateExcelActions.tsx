import {
  Download,
  FileSpreadsheet,
  Upload,
} from "lucide-react";

import {
  useRef,
} from "react";

import {
  downloadStateSampleExcel,
} from "../services/stateExcelService";

interface Props {
  importing?: boolean;

  onImport: (
    file: File
  ) => Promise<void>;

  onExport: () => Promise<void>;
}

export default function StateExcelActions({
  importing = false,
  onImport,
  onExport,
}: Props) {
  const fileInputRef =
    useRef<HTMLInputElement>(
      null
    );

  const handleFileChange =
    async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      try {
        await onImport(
          file
        );
      } catch (
        error
      ) {
        console.error(
          error
        );

        alert(
          "Unable to import Excel file."
        );
      } finally {
        event.target.value =
          "";
      }
    };

  const handleExport =
    async () => {
      try {
        await onExport();
      } catch (
        error
      ) {
        console.error(
          error
        );

        alert(
          "Unable to export Excel file."
        );
      }
    };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Import */}

      <input
        ref={
          fileInputRef
        }
        type="file"
        accept=".xlsx,.xls"
        onChange={
          handleFileChange
        }
        className="hidden"
      />

      <button
        type="button"
        disabled={
          importing
        }
        onClick={() =>
          fileInputRef.current?.click()
        }
        className="inline-flex items-center gap-2 rounded-lg border border-green-600 px-4 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Upload
          size={17}
        />

        {importing
          ? "Importing..."
          : "Import Excel"}
      </button>

      {/* Export */}

      <button
        type="button"
        disabled={
          importing
        }
        onClick={
          handleExport
        }
        className="inline-flex items-center gap-2 rounded-lg border border-[#123B7A] px-4 py-2.5 text-sm font-medium text-[#123B7A] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FileSpreadsheet
          size={17}
        />

        Export Excel
      </button>

      {/* Sample */}

      <button
        type="button"
        onClick={
          downloadStateSampleExcel
        }
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <Download
          size={17}
        />

        Sample Excel
      </button>
    </div>
  );
}