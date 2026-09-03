import {
  Download,
  FileSpreadsheet,
  Upload,
} from "lucide-react";

import {
  useRef,
} from "react";

import {
  downloadCitySampleExcel,
} from "../services/cityExcelService";

interface Props {
  importing?: boolean;

  onImport: (
    file: File
  ) => Promise<void>;

  onExport:
    () => Promise<void>;
}

export default function CityExcelActions({
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

      if (!file) return;

      try {
        await onImport(
          file
        );
      } finally {
        event.target.value =
          "";
      }
    };

  return (
    <div className="flex flex-wrap items-center gap-2">
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

      {/* Import */}

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
          onExport
        }
        className="inline-flex items-center gap-2 rounded-lg border border-[#123B7A] px-4 py-2.5 text-sm font-medium text-[#123B7A] hover:bg-blue-50 disabled:opacity-50"
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
          downloadCitySampleExcel
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