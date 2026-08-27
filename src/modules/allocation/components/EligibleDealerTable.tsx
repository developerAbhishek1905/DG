import {
  Check,
  CircleX,
  Eye,
} from "lucide-react";

import AllocationReason from "./AllocationReason";

import type {
  EligibleDealer,
} from "../types/allocation.types";

interface Props {
  dealers: EligibleDealer[];

  selectedDealerId?: string | null;

  onSelect: (
    dealerId: string
  ) => void;

  onAssign?: (
    dealer: EligibleDealer
  ) => void;
}

export default function EligibleDealerTable({
  dealers,
  selectedDealerId,
  onSelect,
  onAssign,
}: Props) {
  if (!dealers.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        No dealers found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3" />

              {[
                "Dealer",
                "City",
                "Product",
                "Capacity",
                "Cancellation %",
                "SLA",
                "Performance",
                "Eligibility",
                "Action",
              ].map((heading) => (
                <th
                  key={heading}
                  className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase text-gray-500"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {dealers.map(
              (dealer) => {
                const selected =
                  selectedDealerId ===
                  dealer.id;

                return (
                  <tr
                    key={dealer.id}
                    className={
                      selected
                        ? "bg-blue-50/50"
                        : "hover:bg-gray-50"
                    }
                  >
                    <td className="px-4 py-4">
                      <input
                        type="radio"
                        name="dealer"
                        disabled={
                          !dealer.eligible
                        }
                        checked={selected}
                        onChange={() =>
                          onSelect(
                            dealer.id
                          )
                        }
                      />
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {dealer.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {dealer.dealerCode}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <StatusIcon
                        valid={
                          dealer.cityMatched
                        }
                        text={
                          dealer.city
                        }
                      />
                    </td>

                    <td className="px-4 py-4">
                      <StatusIcon
                        valid={
                          dealer.productMatched
                        }
                        text={
                          dealer.productMatched
                            ? "Supported"
                            : "Not supported"
                        }
                      />
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {
                          dealer.availableCapacity
                        }{" "}
                        available
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {
                          dealer.usedCapacity
                        }
                        /
                        {
                          dealer.totalCapacity
                        }{" "}
                        used
                      </p>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {
                        dealer.cancellationRate
                      }
                      %
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={
                          dealer.slaCompliance >=
                          90
                            ? "text-sm font-semibold text-green-600"
                            : "text-sm font-semibold text-amber-600"
                        }
                      >
                        {
                          dealer.slaCompliance
                        }
                        %
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-gray-900">
                        {
                          dealer.performanceScore
                        }
                        /100
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {dealer.eligible ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                          <Check size={13} />
                          Eligible
                        </span>
                      ) : (
                        <div className="group relative">
                          <span className="inline-flex cursor-help items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                            <CircleX
                              size={13}
                            />
                            Not Eligible
                          </span>

                          <div className="absolute right-0 top-full z-30 mt-2 hidden w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-lg group-hover:block">
                            <AllocationReason
                              reasons={
                                dealer.recommendationReasons
                              }
                              eligible={
                                false
                              }
                            />
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      {dealer.eligible &&
                        onAssign && (
                          <button
                            type="button"
                            onClick={() =>
                              onAssign(
                                dealer
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-xs font-medium text-[#123B7A] hover:bg-blue-50"
                          >
                            <Eye
                              size={14}
                            />
                            Assign
                          </button>
                        )}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusIcon({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {valid ? (
        <Check
          size={15}
          className="text-green-600"
        />
      ) : (
        <CircleX
          size={15}
          className="text-red-500"
        />
      )}

      <span className="text-sm text-gray-600">
        {text}
      </span>
    </div>
  );
}