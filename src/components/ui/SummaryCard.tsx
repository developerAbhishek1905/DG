// import type { LucideIcon } from "lucide-react";
// import { FileText } from "lucide-react";

// interface SummaryCardProps {
//   label: string;
//   count: number;
//   icon?: LucideIcon;
// }

// export default function SummaryCard({
//   label,
//   count,
//   icon: Icon = FileText,
// }: SummaryCardProps) {
//   return (
//     <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
//       <div className="flex items-center justify-between gap-4">
//         <div className="min-w-0">
//           <p className="truncate text-sm font-medium text-gray-500">
//             {label}
//           </p>

//           <p className="mt-2 text-2xl font-bold text-gray-900">
//             {count}
//           </p>
//         </div>

//         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
//           <Icon
//             size={20}
//             className="text-gray-600"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }


// import type { LucideIcon } from "lucide-react";
// import { FileText } from "lucide-react";

// type CardColor =
//   | "blue"
//   | "green"
//   | "red"
//   | "yellow"
//   | "orange"
//   | "purple"
//   | "pink"
//   | "cyan"
//   | "indigo"
//   | "gray";

// interface SummaryCardProps {
//   label: string;
//   count: number;
//   icon?: LucideIcon;
//   color?: CardColor;
// }

// const colorStyles: Record<
//   CardColor,
//   {
//     card: string;
//     iconBox: string;
//     icon: string;
//     count: string;
//   }
// > = {
//   blue: {
//     card: "border-blue-200 bg-blue-50",
//     iconBox: "bg-blue-100",
//     icon: "text-blue-600",
//     count: "text-blue-700",
//   },

//   green: {
//     card: "border-green-200 bg-green-50",
//     iconBox: "bg-green-100",
//     icon: "text-green-600",
//     count: "text-green-700",
//   },

//   red: {
//     card: "border-red-200 bg-red-50",
//     iconBox: "bg-red-100",
//     icon: "text-red-600",
//     count: "text-red-700",
//   },

//   yellow: {
//     card: "border-yellow-200 bg-yellow-50",
//     iconBox: "bg-yellow-100",
//     icon: "text-yellow-600",
//     count: "text-yellow-700",
//   },

//   orange: {
//     card: "border-orange-200 bg-orange-50",
//     iconBox: "bg-orange-100",
//     icon: "text-orange-600",
//     count: "text-orange-700",
//   },

//   purple: {
//     card: "border-purple-200 bg-purple-50",
//     iconBox: "bg-purple-100",
//     icon: "text-purple-600",
//     count: "text-purple-700",
//   },

//   pink: {
//     card: "border-pink-200 bg-pink-50",
//     iconBox: "bg-pink-100",
//     icon: "text-pink-600",
//     count: "text-pink-700",
//   },

//   cyan: {
//     card: "border-cyan-200 bg-cyan-50",
//     iconBox: "bg-cyan-100",
//     icon: "text-cyan-600",
//     count: "text-cyan-700",
//   },

//   indigo: {
//     card: "border-indigo-200 bg-indigo-50",
//     iconBox: "bg-indigo-100",
//     icon: "text-indigo-600",
//     count: "text-indigo-700",
//   },

//   gray: {
//     card: "border-gray-200 bg-gray-50",
//     iconBox: "bg-gray-100",
//     icon: "text-gray-600",
//     count: "text-gray-700",
//   },
// };

// export default function SummaryCard({
//   label,
//   count,
//   icon: Icon = FileText,
//   color = "blue",
// }: SummaryCardProps) {
//   const styles = colorStyles[color];

//   return (
//     <div
//       className={`
//         rounded-xl border p-4 shadow-sm
//         transition-all duration-200
//         hover:-translate-y-0.5 hover:shadow-md
//         ${styles.card}
//       `}
//     >
//       <div className="flex items-center justify-between gap-4">
//         <div className="min-w-0">
//           <p className="text-sm font-medium text-gray-600">
//             {label}
//           </p>

//           <p
//             className={`mt-2 text-2xl font-bold ${styles.count}`}
//           >
//             {count}
//           </p>
//         </div>

//         <div
//           className={`
//             flex h-11 w-11 shrink-0
//             items-center justify-center
//             rounded-xl
//             ${styles.iconBox}
//           `}
//         >
//           <Icon
//             size={21}
//             className={styles.icon}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }


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
}: SummaryCardProps) {
  return (
    <div
      className={`
        rounded-xl border p-4 shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-md
        ${colorStyles[color]}
      `}
    >
      <p className="text-sm font-medium opacity-80">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {count}
      </p>
    </div>
  );
}