// import { useEffect } from "react";

// import {
//   useNavigate,
//   useParams,
// } from "react-router-dom";

// import { useDispatch, useSelector } from "react-redux";

// import DealerPerformanceCard from "../components/DealerPerformanceCard";

// import {
//   fetchDealerById,
// } from "../store/dealerSlice";

// import type {
//   AppDispatch,
//   RootState,
// } from "../../../app/store";

// export default function DealerPerformancePage() {
//   const { id } = useParams();

//   const navigate = useNavigate();

//   const dispatch =
//     useDispatch<AppDispatch>();

//   const {
//     selectedDealer,
//     loading,
//   } = useSelector(
//     (state: RootState) =>
//       state.dealers
//   );

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchDealerById(id));
//     }
//   }, [id, dispatch]);

//   if (loading || !selectedDealer) {
//     return (
//       <div className="p-8">
//         Loading performance...
//       </div>
//     );
//   }

//   const dealer = selectedDealer;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">
//             Dealer Performance
//           </h1>

//           <p className="text-sm text-gray-500">
//             {dealer.name} ·{" "}
//             {dealer.dealerCode}
//           </p>
//         </div>

//         <button
//           onClick={() =>
//             navigate(`/dealers/${dealer._id}`)
//           }
//           className="rounded-lg border px-4 py-2"
//         >
//           Back
//         </button>
//       </div>

//       <DealerPerformanceCard
//         performance={dealer.performance}
//       />

//       {/* Future analytics */}

//       <div className="rounded-xl border bg-white p-6">
//         <h2 className="font-semibold">
//           Performance Analytics
//         </h2>

//         <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
//           <div className="rounded-lg bg-gray-50 p-4">
//             <p className="text-sm text-gray-500">
//               Completion Rate
//             </p>

//             <p className="mt-1 text-2xl font-bold">
//               {dealer.performance.completionRate}%
//             </p>
//           </div>

//           <div className="rounded-lg bg-gray-50 p-4">
//             <p className="text-sm text-gray-500">
//               Orders
//             </p>

//             <p className="mt-1 text-2xl font-bold">
//               {dealer.performance.totalOrders}
//             </p>
//           </div>

//           <div className="rounded-lg bg-gray-50 p-4">
//             <p className="text-sm text-gray-500">
//               Rating
//             </p>

//             <p className="mt-1 text-2xl font-bold">
//               ⭐ {dealer.performance.rating}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Star,
  XCircle,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Card from "../../../components/ui/Card";

import {
  useDealerDetails,
} from "../hooks/useDealers";

export default function DealerPerformancePage() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const {
    dealer,
    loading,
  } =
    useDealerDetails(id);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Loading performance...
      </div>
    );
  }

  if (!dealer) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Dealer not found.
      </div>
    );
  }

  const {
    performance,
  } = dealer;

  const completionRate =
    performance.totalComplaints
      ? (
          (performance
            .completedComplaints /
            performance
              .totalComplaints) *
          100
        ).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      <button
        onClick={() =>
          navigate(
            `/dealers/${dealer.id}`
          )
        }
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={17} />
        Back to Dealer
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dealer Performance
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {dealer.name} •{" "}
          {dealer.dealerCode}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPI
          icon={
            CheckCircle2
          }
          label="Completion Rate"
          value={`${completionRate}%`}
        />

        <KPI
          icon={XCircle}
          label="Cancellation Rate"
          value={`${performance.cancellationRate}%`}
        />

        <KPI
          icon={Clock3}
          label="Average Response"
          value={`${performance.averageResponseTime} min`}
        />

        <KPI
          icon={Star}
          label="Feedback Score"
          value={`${performance.feedbackScore}/5`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <p className="text-sm text-gray-500">
            Overall Score
          </p>

          <p className="mt-3 text-5xl font-bold text-[#123B7A]">
            {
              performance.performanceScore
            }
          </p>

          <p className="mt-1 text-sm text-gray-500">
            out of 100
          </p>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[#123B7A]"
              style={{
                width: `${performance.performanceScore}%`,
              }}
            />
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h3 className="font-semibold text-gray-900">
            Complaint Summary
          </h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Summary
              label="Total"
              value={
                performance.totalComplaints
              }
            />

            <Summary
              label="Completed"
              value={
                performance.completedComplaints
              }
            />

            <Summary
              label="Pending"
              value={
                performance.pendingComplaints
              }
            />

            <Summary
              label="Cancelled"
              value={
                performance.cancelledComplaints
              }
            />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900">
          Performance Indicators
        </h3>

        <div className="mt-6 space-y-6">
          <Progress
            label="SLA Compliance"
            value={
              performance.slaCompliance
            }
          />

          <Progress
            label="Completion Rate"
            value={
              Number(
                completionRate
              )
            }
          />

          <Progress
            label="Performance Score"
            value={
              performance.performanceScore
            }
          />
        </div>
      </Card>
    </div>
  );
}

function KPI({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#123B7A]">
          <Icon size={21} />
        </div>

        <div>
          <p className="text-xs text-gray-500">
            {label}
          </p>

          <p className="mt-1 text-xl font-bold text-gray-900">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}

function Summary({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-2xl font-bold text-gray-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {label}
      </p>
    </div>
  );
}

function Progress({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          {label}
        </p>

        <p className="text-sm font-semibold text-gray-900">
          {value}%
        </p>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-[#123B7A]"
          style={{
            width: `${Math.min(
              value,
              100
            )}%`,
          }}
        />
      </div>
    </div>
  );
}