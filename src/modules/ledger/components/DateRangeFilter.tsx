import { RotateCcw } from "lucide-react";

type Props = {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
};

const pad = (value: number) => String(value).padStart(2, "0");

const toInput = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const presets = [
  {
    label: "This Month",
    range: () => {
      const now = new Date();
      return [
        toInput(new Date(now.getFullYear(), now.getMonth(), 1)),
        toInput(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
      ];
    },
  },
  {
    label: "Last Month",
    range: () => {
      const now = new Date();
      return [
        toInput(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
        toInput(new Date(now.getFullYear(), now.getMonth(), 0)),
      ];
    },
  },
  {
    label: "This Financial Year",
    range: () => {
      const now = new Date();
      const startYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
      return [
        toInput(new Date(startYear, 3, 1)),
        toInput(new Date(startYear + 1, 2, 31)),
      ];
    },
  },
];

const inputClass =
  "h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-[#123B7A] focus:ring-2 focus:ring-blue-100";

export default function DateRangeFilter({ from, to, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          From
        </label>

        <input
          type="date"
          className={inputClass}
          value={from}
          max={to || undefined}
          onChange={(e) => onChange(e.target.value, to)}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          To
        </label>

        <input
          type="date"
          className={inputClass}
          value={to}
          min={from || undefined}
          onChange={(e) => onChange(from, e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              const [start, end] = preset.range();
              onChange(start, end);
            }}
            className="h-9 rounded-lg border border-gray-300 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            {preset.label}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onChange("", "")}
          disabled={!from && !to}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw size={13} />
          Clear
        </button>
      </div>
    </div>
  );
}
