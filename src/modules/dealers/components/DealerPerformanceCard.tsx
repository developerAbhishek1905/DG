// import type { DealerPerformance } from "../types/dealer.types";

// interface Props {
//   performance: DealerPerformance;
// }

// export default function DealerPerformanceCard({
//   performance,
// }: Props) {
//   return (
//     <div className="rounded-xl border bg-white p-5">
//       <h3 className="font-semibold">
//         Performance
//       </h3>

//       <div className="mt-4 grid grid-cols-2 gap-4">
//         <div>
//           <p className="text-sm text-gray-500">
//             Total Orders
//           </p>

//           <p className="text-xl font-bold">
//             {performance.totalOrders}
//           </p>
//         </div>

//         <div>
//           <p className="text-sm text-gray-500">
//             Completed
//           </p>

//           <p className="text-xl font-bold">
//             {performance.completedOrders}
//           </p>
//         </div>

//         <div>
//           <p className="text-sm text-gray-500">
//             Pending
//           </p>

//           <p className="text-xl font-bold">
//             {performance.pendingOrders}
//           </p>
//         </div>

//         <div>
//           <p className="text-sm text-gray-500">
//             Cancelled
//           </p>

//           <p className="text-xl font-bold">
//             {performance.cancelledOrders}
//           </p>
//         </div>

//         <div>
//           <p className="text-sm text-gray-500">
//             Completion Rate
//           </p>

//           <p className="text-xl font-bold">
//             {performance.completionRate}%
//           </p>
//         </div>

//         <div>
//           <p className="text-sm text-gray-500">
//             Rating
//           </p>

//           <p className="text-xl font-bold">
//             ⭐ {performance.rating}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import {
  Clock3,
  Star,
  Target,
  XCircle,
} from "lucide-react";

import Card from "../../../components/ui/Card";

import type {
  DealerPerformance,
} from "../types/dealer.types";

interface Props {
  performance: DealerPerformance;
}

export default function DealerPerformanceCard({
  performance,
}: Props) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">
            Performance
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Overall dealer performance
          </p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold text-[#123B7A]">
            {performance.performanceScore}
          </p>

          <p className="text-xs text-gray-500">
            Score / 100
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Metric
          icon={Target}
          label="SLA Compliance"
          value={`${performance.slaCompliance}%`}
        />

        <Metric
          icon={XCircle}
          label="Cancellation"
          value={`${performance.cancellationRate}%`}
        />

        <Metric
          icon={Clock3}
          label="Avg Response"
          value={`${performance.averageResponseTime} min`}
        />

        <Metric
          icon={Star}
          label="Feedback"
          value={`${performance.feedbackScore}/5`}
        />
      </div>
    </Card>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#123B7A]">
        <Icon size={18} />
      </div>

      <div>
        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p className="text-sm font-semibold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}