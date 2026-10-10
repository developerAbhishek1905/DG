type CardColor =
  | "blue"
  | "orange"
  | "purple"
  | "green"
  | "red"
  | "yellow"
  | "pink"
  | "cyan"
  | "indigo";

interface SummaryCardProps {
  label: string;
  count: number;
  color?: CardColor;
  compact?: boolean;
}

const colorStyles: Record<CardColor, string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  orange: "border-orange-200 bg-orange-50 text-orange-700",
  purple: "border-purple-200 bg-purple-50 text-purple-700",
  green: "border-green-200 bg-green-50 text-green-700",
  red: "border-red-200 bg-red-50 text-red-700",
  yellow: "border-yellow-200 bg-yellow-50 text-yellow-700",
  pink: "border-pink-200 bg-pink-50 text-pink-700",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
};

export default function SummaryCard({
  label,
  count,
  color = "blue",
  compact = false,
}: SummaryCardProps) {
  return (
    <div
      className={`
        h-full border shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-md
        ${compact ? "rounded-lg px-3 py-2" : "rounded-xl p-4"}
        ${colorStyles[color]}
      `}
    >
      <p
        className={`
          font-medium opacity-80
          ${
            compact
              ? "text-[11px] leading-4"
              : "text-sm"
          }
        `}
      >
        {label}
      </p>

      <p
        className={`
          font-bold tabular-nums
          ${
            compact
              ? "mt-1 text-xl leading-6"
              : "mt-2 text-3xl"
          }
        `}
      >
        {count}
      </p>
    </div>
  );
}