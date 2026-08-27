// import { useNavigate } from "react-router-dom";

// import type { Dealer } from "../types/dealer.types";

// import DealerStatusBadge from "./DealerStatusBadge";

// interface Props {
//   dealer: Dealer;
// }

// export default function DealerCard({
//   dealer,
// }: Props) {
//   const navigate = useNavigate();

//   return (
//     <div className="rounded-xl border bg-white p-5 shadow-sm">
//       <div className="flex items-start justify-between">
//         <div>
//           <h3 className="font-semibold">
//             {dealer.name}
//           </h3>

//           <p className="text-sm text-gray-500">
//             {dealer.dealerCode}
//           </p>
//         </div>

//         <DealerStatusBadge
//           status={dealer.status}
//         />
//       </div>

//       <div className="mt-4 space-y-2 text-sm">
//         <p>
//           <span className="text-gray-500">
//             Phone:
//           </span>{" "}
//           {dealer.phone}
//         </p>

//         <p>
//           <span className="text-gray-500">
//             City:
//           </span>{" "}
//           {dealer.address.city}
//         </p>

//         <p>
//           <span className="text-gray-500">
//             Capacity:
//           </span>{" "}
//           {dealer.capacity.usedCapacity}/
//           {dealer.capacity.totalCapacity}
//         </p>
//       </div>

//       <button
//         onClick={() =>
//           navigate(`/dealers/${dealer._id}`)
//         }
//         className="mt-4 w-full rounded-lg border py-2"
//       >
//         View Details
//       </button>
//     </div>
//   );
// }

import {
  MapPin,
  Phone,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Card from "../../../components/ui/Card";

import DealerStatusBadge from "./DealerStatusBadge";

import type {
  Dealer,
} from "../types/dealer.types";

interface Props {
  dealer: Dealer;
}

export default function DealerCard({
  dealer,
}: Props) {
  const navigate = useNavigate();

  const available =
    dealer.capacity.total -
    dealer.capacity.used;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-gray-400">
            {dealer.dealerCode}
          </p>

          <h3 className="mt-1 font-semibold text-gray-900">
            {dealer.name}
          </h3>
        </div>

        <DealerStatusBadge
          status={dealer.status}
        />
      </div>

      <div className="mt-5 space-y-3">
        <Info
          icon={User}
          value={dealer.ownerName}
        />

        <Info
          icon={Phone}
          value={dealer.phone}
        />

        <Info
          icon={MapPin}
          value={`${dealer.city}, ${dealer.state}`}
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4 text-center">
        <div>
          <p className="font-semibold text-gray-900">
            {available}
          </p>

          <p className="text-xs text-gray-500">
            Capacity
          </p>
        </div>

        <div>
          <p className="font-semibold text-gray-900">
            {dealer.performance.slaCompliance}%
          </p>

          <p className="text-xs text-gray-500">
            SLA
          </p>
        </div>

        <div>
          <p className="font-semibold text-gray-900">
            {dealer.performance.performanceScore}
          </p>

          <p className="text-xs text-gray-500">
            Score
          </p>
        </div>
      </div>

      <button
        onClick={() =>
          navigate(
            `/dealers/${dealer.id}`
          )
        }
        className="mt-5 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        View Dealer
      </button>
    </Card>
  );
}

function Info({
  icon: Icon,
  value,
}: {
  icon: React.ElementType;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-600">
      <Icon
        size={16}
        className="text-gray-400"
      />

      {value}
    </div>
  );
}