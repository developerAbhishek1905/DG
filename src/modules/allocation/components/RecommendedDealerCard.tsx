import {
  Award,
  CheckCircle2,
  Gauge,
  MapPin,
  PackageCheck,
  Percent,
  Users,
} from "lucide-react";

import Card from "../../../components/ui/Card";

import AllocationReason from "./AllocationReason";

import type {
  EligibleDealer,
} from "../types/allocation.types";

interface Props {
  dealer?: EligibleDealer;

  onAssign?: (
    dealer: EligibleDealer
  ) => void;

  assigning?: boolean;
}

export default function RecommendedDealerCard({
  dealer,
  onAssign,
  assigning = false,
}: Props) {
  if (!dealer) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900">
          Recommended Dealer
        </h3>

        <p className="mt-4 text-sm text-gray-500">
          No eligible dealer is currently available.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-blue-100 bg-blue-50 px-6 py-4">
        <div className="flex items-center gap-2 text-[#123B7A]">
          <Award size={20} />

          <h3 className="font-semibold">
            Recommended Dealer
          </h3>
        </div>

        <p className="mt-1 text-xs text-blue-700">
          Best match based on allocation rules
        </p>
      </div>

      <div className="p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div>
            <p className="text-xs font-medium text-gray-400">
              {dealer.dealerCode}
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              {dealer.name}
            </h2>

            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={15} />

              {dealer.city}
            </div>
          </div>

          <div className="rounded-xl bg-green-50 px-5 py-3 text-center">
            <p className="text-2xl font-bold text-green-700">
              {dealer.recommendationScore}
            </p>

            <p className="text-xs text-green-600">
              Match Score
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            icon={Users}
            label="Available"
            value={`${dealer.availableCapacity}/${dealer.totalCapacity}`}
          />

          <Metric
            icon={Percent}
            label="Cancellation"
            value={`${dealer.cancellationRate}%`}
          />

          <Metric
            icon={Gauge}
            label="SLA"
            value={`${dealer.slaCompliance}%`}
          />

          <Metric
            icon={PackageCheck}
            label="Performance"
            value={`${dealer.performanceScore}/100`}
          />
        </div>

        <div className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-4">
          <p className="mb-3 text-sm font-semibold text-gray-900">
            Why this dealer?
          </p>

          <AllocationReason
            reasons={
              dealer.recommendationReasons
            }
          />
        </div>

        {onAssign && (
          <button
            type="button"
            disabled={assigning}
            onClick={() =>
              onAssign(dealer)
            }
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:opacity-60"
          >
            <CheckCircle2 size={17} />

            {assigning
              ? "Assigning..."
              : "Assign Recommended Dealer"}
          </button>
        )}
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
    <div className="rounded-lg border border-gray-100 bg-white p-3">
      <div className="flex items-center gap-2 text-gray-400">
        <Icon size={15} />

        <span className="text-xs">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}