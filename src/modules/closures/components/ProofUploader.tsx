import {
  FileImage,
  Trash2,
  UploadCloud,
} from "lucide-react";

import type {
  ClosureProof,
} from "../types/closure.types";

interface Props {
  proofs: ClosureProof[];

  onChange: (
    proofs: ClosureProof[]
  ) => void;

  maxFiles?: number;
}

export default function ProofUploader({
  proofs,
  onChange,
  maxFiles = 5,
}: Props) {
  const handleFiles = (
    files:
      FileList | null
  ) => {
    if (!files) return;

    const remaining =
      maxFiles -
      proofs.length;

    const selectedFiles =
      Array.from(files).slice(
        0,
        remaining
      );

    const newProofs =
      selectedFiles.map(
        (file) => ({
          id: `PRF-${Date.now()}-${Math.random()}`,

          name: file.name,

          type: file.type,

          size: file.size,

          previewUrl:
            file.type.startsWith(
              "image/"
            )
              ? URL.createObjectURL(
                  file
                )
              : undefined,
        })
      );

    onChange([
      ...proofs,
      ...newProofs,
    ]);
  };

  const removeProof = (
    id: string
  ) => {
    onChange(
      proofs.filter(
        (proof) =>
          proof.id !== id
      )
    );
  };

  return (
    <div>
      <div>
        <h3 className="font-semibold text-gray-900">
          Proof / Evidence
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Upload completion photos or supporting documents.
        </p>
      </div>

      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 hover:border-blue-400 hover:bg-blue-50/40">
        <UploadCloud
          size={28}
          className="text-gray-400"
        />

        <p className="mt-3 text-sm font-medium text-gray-700">
          Click to upload proof
        </p>

        <p className="mt-1 text-xs text-gray-500">
          Maximum {maxFiles} files
        </p>

        <input
          type="file"
          multiple
          accept="image/*,.pdf"
          className="hidden"
          onChange={(event) => {
            handleFiles(
              event.target.files
            );

            event.target.value =
              "";
          }}
        />
      </label>

      {proofs.length >
        0 && (
        <div className="mt-4 space-y-3">
          {proofs.map(
            (proof) => (
              <div
                key={
                  proof.id
                }
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#123B7A]">
                    <FileImage
                      size={17}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {
                        proof.name
                      }
                    </p>

                    <p className="text-xs text-gray-400">
                      {(
                        proof.size /
                        1024
                      ).toFixed(
                        1
                      )}{" "}
                      KB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removeProof(
                      proof.id
                    )
                  }
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2
                    size={16}
                  />
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}