import {
  CheckCircle2,
  MapPin,
  Star,
  Users,
  Wrench,
  X,
} from "lucide-react";

export interface AllocationDealer {
  id: string;
  name: string;
  code: string;
  phone: string;
  city: string;

//   distance: number;

  activeJobs: number;

  technicians: number;

  rating: number;

  serviceMatch: boolean;

  available: boolean;
}

interface DealerAllocationModalProps {
  open: boolean;

  complaintNumber?: string;

  dealers: AllocationDealer[];

  selectedDealerId?: string;

  onSelectDealer: (dealerId: string) => void;

  onAllocate: () => void;

  onSkip: () => void;

  loading?: boolean;
}

export default function DealerAllocationModal({
  open,
  complaintNumber,
  dealers,
  selectedDealerId,
  onSelectDealer,
  onAllocate,
  onSkip,
  loading = false,
}: DealerAllocationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-xl">

        {/* Header */}

        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-200 bg-white px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={20}
                className="text-green-600"
              />

              <h2 className="text-xl font-semibold text-gray-900">
                Complaint Created Successfully
              </h2>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              {complaintNumber
                ? `${complaintNumber} is ready for dealer allocation.`
                : "The complaint is ready for dealer allocation."}
            </p>
          </div>

          <button
            type="button"
            onClick={onSkip}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">

          {/* Allocation Criteria */}

          <div>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-gray-900">
                Allocation Criteria
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Dealers are recommended based on the following criteria.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* <CriteriaCard
                icon={<MapPin size={18} />}
                title="Distance"
                description="Nearest dealer gets higher preference"
              /> */}

              <CriteriaCard
                icon={<Wrench size={18} />}
                title="Service Match"
                description="Dealer should support complaint category"
              />

              <CriteriaCard
                icon={<Users size={18} />}
                title="Workload"
                description="Dealer with fewer active jobs preferred"
              />

              <CriteriaCard
                icon={<Star size={18} />}
                title="Performance"
                description="Rating and service performance considered"
              />
            </div>
          </div>

          {/* Allocation Rules */}

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <h4 className="text-sm font-semibold text-[#123B7A]">
              Allocation Priority
            </h4>

            <div className="mt-3 flex flex-wrap gap-2">
              <CriteriaBadge>
                Same City
              </CriteriaBadge>

              <CriteriaBadge>
                Service Capability
              </CriteriaBadge>

              <CriteriaBadge>
                Dealer Available
              </CriteriaBadge>

              <CriteriaBadge>
                Lowest Workload
              </CriteriaBadge>

              {/* <CriteriaBadge>
                Nearest Distance
              </CriteriaBadge> */}

              <CriteriaBadge>
                Best Rating
              </CriteriaBadge>
            </div>
          </div>

          {/* Dealers */}

          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Recommended Dealers
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Select the most suitable dealer for this complaint.
                </p>
              </div>

              <span className="text-sm text-gray-500">
                {dealers.length} dealers found
              </span>
            </div>

            <div className="space-y-3">
              {dealers.map((dealer, index) => {
                const selected =
                  selectedDealerId === dealer.id;

                return (
                  <button
                    type="button"
                    key={dealer.id}
                    disabled={!dealer.available}
                    onClick={() =>
                      onSelectDealer(dealer.id)
                    }
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-[#123B7A] bg-blue-50 ring-1 ring-[#123B7A]"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    } ${
                      !dealer.available
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

                      {/* Dealer */}

                      <div className="flex min-w-[220px] items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                            index === 0
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {index + 1}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-gray-900">
                              {dealer.name}
                            </p>

                            {index === 0 &&
                              dealer.available && (
                                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
                                  Best Match
                                </span>
                              )}
                          </div>

                          <p className="mt-0.5 text-xs text-gray-500">
                            {dealer.code} • {dealer.city}
                          </p>
                        </div>
                      </div>

                      {/* Criteria */}

                      <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-5">
                        {/* <DealerMetric
                          label="Distance"
                          value={`${dealer.distance} km`}
                        /> */}

                        <DealerMetric
                          label="Active Jobs"
                          value={dealer.activeJobs}
                        />

                        <DealerMetric
                          label="Technicians"
                          value={dealer.technicians}
                        />

                        <DealerMetric
                          label="Rating"
                          value={`${dealer.rating}/5`}
                        />

                        <DealerMetric
                          label="Service"
                          value={
                            dealer.serviceMatch
                              ? "Matched"
                              : "Not Matched"
                          }
                          success={dealer.serviceMatch}
                        />
                      </div>

                      {/* Radio */}

                      <div
                        className={`h-5 w-5 shrink-0 rounded-full border-2 ${
                          selected
                            ? "border-[#123B7A]"
                            : "border-gray-300"
                        }`}
                      >
                        {selected && (
                          <div className="m-[3px] h-[10px] w-[10px] rounded-full bg-[#123B7A]" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-gray-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onSkip}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Allocate Later
          </button>

          <button
            type="button"
            disabled={!selectedDealerId || loading}
            onClick={onAllocate}
            className="rounded-lg bg-[#123B7A] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B2854] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Allocating..."
              : "Allocate Dealer"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CriteriaCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#123B7A]">
        {icon}
      </div>

      <p className="text-sm font-semibold text-gray-900">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-gray-500">
        {description}
      </p>
    </div>
  );
}

function CriteriaBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-medium text-[#123B7A]">
      {children}
    </span>
  );
}

function DealerMetric({
  label,
  value,
  success,
}: {
  label: string;
  value: React.ReactNode;
  success?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-medium ${
          success === true
            ? "text-green-600"
            : success === false
              ? "text-red-500"
              : "text-gray-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}