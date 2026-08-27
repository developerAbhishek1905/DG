import {
  Boxes,
  PackageCheck,
  Settings,
  Truck,
  Wrench,
} from "lucide-react";

import type {
  ClosureType,
} from "../types/closure.types";

interface Props {
  value:
    | ClosureType
    | null;

  onChange: (
    type: ClosureType
  ) => void;
}

const closureTypes = [
  {
    type: "VISIT" as const,
    label:
      "Visit Closure",
    description:
      "Close after inspection or visit.",

    icon: Truck,
  },

  {
    type: "PART" as const,
    label:
      "Part Closure",
    description:
      "Part replacement closure.",

    icon: Boxes,
  },

  {
    type: "SERVICE" as const,
    label:
      "Service Closure",
    description:
      "Repair/service completion.",

    icon: Wrench,
  },

  {
    type:
      "INSTALLATION" as const,

    label:
      "Installation Closure",

    description:
      "Product installation completed.",

    icon:
      PackageCheck,
  },

  {
    type:
      "UNINSTALLATION" as const,

    label:
      "Uninstallation Closure",

    description:
      "Product removed or collected.",

    icon: Settings,
  },
];

export default function ClosureTypeSelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {closureTypes.map(
        (item) => {
          const Icon =
            item.icon;

          const selected =
            value ===
            item.type;

          return (
            <button
              key={
                item.type
              }
              type="button"
              onClick={() =>
                onChange(
                  item.type
                )
              }
              className={`rounded-xl border p-4 text-left transition ${
                selected
                  ? "border-[#123B7A] bg-blue-50 ring-1 ring-[#123B7A]"
                  : "border-gray-200 bg-white hover:border-blue-300"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  selected
                    ? "bg-[#123B7A] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Icon
                  size={19}
                />
              </div>

              <p className="mt-4 text-sm font-semibold text-gray-900">
                {item.label}
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                {
                  item.description
                }
              </p>
            </button>
          );
        }
      )}
    </div>
  );
}