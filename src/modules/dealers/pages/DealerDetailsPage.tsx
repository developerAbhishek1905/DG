import {
  ArrowLeft,
  BriefcaseBusiness,
  Edit,
  LogIn,
  Mail,
  MapPin,
  Phone,
  User,
  Activity,
  CalendarDays,
  LogOut,
  RefreshCcw,
  ShieldBan,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../../components/ui/Card";
import DealerStatusBadge from "../components/DealerStatusBadge";
import { useDealerDetails } from "../hooks/useDealers";
import { usePermission } from "../../../hooks/usePermission";
import { useCallback, useEffect, useState } from "react";
import DealerLeaveModal from "../components/DealerLeaveModal";
import DealerRatingModal from "../components/DealerRatingModal";
import DealerSuspendModal from "../components/DealerSuspendModal";
import DealerRejoinModal from "../components/DealerRejoinModal";
import DealerLeaveHistoryModal from "../components/DealerLeaveHistoryModal";
import { getDealerLifecycleLogs } from "../services/dealerApi";
// import LeaveHistoryCard from "../components/LeaveHistoryCard";
import type {
  DealerLifecycleLog,
  DealerLifecycleType,
} from "../types/dealer.types";
export default function DealerDetailsPage() {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const { id } = useParams();
  const IMAGE_UPLOAD_URL = "http://localhost:5004";
  const { dealer, loading, refetch } = useDealerDetails(id);
  type DealerDocuments = {
    aadhaarFront?: string | null;
    aadhaarBack?: string | null;
    panFront?: string | null;
    panBack?: string | null;
    drivingLicenceFront?: string | null;
    drivingLicenceBack?: string | null;
    otherDocuments?: string[];
  };
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [rejoinModalOpen, setRejoinModalOpen] = useState(false);

  const [leaveHistoryOpen, setLeaveHistoryOpen] = useState(false);
  const [activityLogs, setActivityLogs] = useState<DealerLifecycleLog[]>([]);

  const fetchDealerActivity = useCallback(async () => {
    if (!id) return;

    try {
      setActivityLoading(true);

      const response = await getDealerLifecycleLogs(id);

      setActivityLogs(response.data ?? []);
    } catch (error) {
      console.error("Failed to fetch dealer activity:", error);

      setActivityLogs([]);
    } finally {
      setActivityLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDealerActivity();
  }, [fetchDealerActivity]);

  const [activityLoading, setActivityLoading] = useState(false);
  const dealerDocuments = (dealer as { documents?: DealerDocuments } | null)
    ?.documents;

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        Loading dealer...
      </div>
    );
  }

  console.log(dealer);

  if (!dealer) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500">Dealer not found.</p>

        <button
          type="button"
          onClick={() => navigate("/dealers")}
          className="mt-4 text-sm font-medium text-blue-600 hover:underline"
        >
          Back to Dealers
        </button>
      </div>
    );
  }

  // One entry per city: primary business city + every additional city
  const cityEntries = [
    {
      key: "primary",
      city: dealer.businessAddress?.city || "Primary city",
      isPrimary: true,
      services: dealer.productServices ?? [],
      capacities: dealer.individualCapacities ?? [],
      combined: dealer.combinedCapacity,
    },
    ...(dealer.additionalCities ?? []).map((item, index) => ({
      key: `${item.cityId ?? "city"}-${index}`,
      city: item.city,
      isPrimary: false,
      services: item.productServices ?? [],
      capacities: item.individualCapacities ?? [],
      combined: item.combinedCapacity,
    })),
  ].map((entry) => {
    const combinedCapacity = Number(entry.combined?.capacity ?? 0);
    const individualTotal = entry.capacities.reduce(
      (total, item) => total + Number(item.capacity || 0),
      0,
    );

    return {
      ...entry,
      combinedProducts: entry.combined?.products ?? [],
      combinedCapacity,
      individualTotal,
      total: combinedCapacity + individualTotal,
    };
  });

  const totalCapacity = cityEntries.reduce(
    (sum, entry) => sum + entry.total,
    0,
  );

  return (
    <div className="space-y-6">
      {/* ======================================
          PAGE ACTIONS
      ====================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => navigate("/dealers")}
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
        >
          <ArrowLeft size={17} />
          Back to Dealers
        </button>

        {/* {hasPermission("dealers.update") && (
          <button
            type="button"
            onClick={() => navigate(`/dealers/${dealer._id}/edit`)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B2854]"
          >
            <Edit size={17} />
            Edit Dealer
          </button>
        )} */}
        <div className="flex flex-wrap items-center gap-2">
          {dealer.status === "ACTIVE" && hasPermission("dealers.leave") && (
            <button
              type="button"
              onClick={() => setLeaveModalOpen(true)}
              className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100"
            >
              Leave
            </button>
          )}

          {(dealer.status === "INACTIVE" || dealer.status === "SUSPENDED") &&
            hasPermission("dealers.rejoin") && (
            <button
              type="button"
              onClick={() => setRejoinModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700"
            >
              <LogIn size={16} />
              Rejoin
            </button>
          )}
          {hasPermission("dealers.rating") && (
          <button
            type="button"
            onClick={() => setRatingModalOpen(true)}
            className="rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            Rating
          </button>
          )}

          {dealer.status !== "SUSPENDED" && hasPermission("dealers.suspend") && (
            <button
              type="button"
              onClick={() => setSuspendModalOpen(true)}
              className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
            >
              Suspend
            </button>
          )}
          {hasPermission("dealers.leave_history") && (
          <button
            type="button"
            onClick={() => setLeaveHistoryOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <CalendarDays size={16} />
            Leave History
            {!!dealer.leaves?.length && (
              <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
                {dealer.leaves.length}
              </span>
            )}
          </button>
          )}

          {hasPermission("dealers.update") && (
            <button
              type="button"
              onClick={() => navigate(`/dealers/${dealer._id}/edit`)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2 text-sm font-medium text-white"
            >
              <Edit size={16} />
              Edit Dealer
            </button>
          )}
        </div>
      </div>

      {/* ======================================
          DEALER SUMMARY
      ====================================== */}

      <Card className="p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {dealer.technicianFirmName || dealer.headName || "-"}
              </h1>

              {/* <DealerStatusBadge status={dealer.technicianStatus} /> */}

              <DealerStatusBadge
                status={
                  dealer.effectiveStatus ??
                  dealer.status ??
                  dealer.technicianStatus ??
                  "INACTIVE"
                }
              />
            </div>

            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
              {dealer.headCode && (
                <span>
                  Head Code:{" "}
                  <span className="font-medium text-gray-700">
                    {dealer.headCode}
                  </span>
                </span>
              )}

              {dealer.technicianCode && (
                <span>
                  Technician Code:{" "}
                  <span className="font-medium text-gray-700">
                    {dealer.technicianCode}
                  </span>
                </span>
              )}
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 px-5 py-4">
            <p className="text-xs font-medium text-blue-600">Total Capacity</p>
            <p className="mt-1 text-3xl font-bold text-[#123B7A]">
              {totalCapacity}
            </p>
          </div>
        </div>

        {/* CONTACT INFO */}

        <div className="mt-6 grid gap-5 border-t border-gray-100 pt-6 md:grid-cols-2 xl:grid-cols-4">
          <Info
            icon={User}
            label="Technician Name"
            value={dealer.technicianName || "-"}
          />

          <Info
            icon={Phone}
            label="Mobile Number"
            value={dealer.mobileNumber || "-"}
          />

          <Info icon={Mail} label="Email" value={dealer.email || "-"} />

          <Info
            icon={MapPin}
            label="Location"
            value={
              [dealer.businessAddress?.city, dealer.businessAddress?.state]
                .filter(Boolean)
                .join(", ") || "-"
            }
          />
        </div>
      </Card>
      {/* <LeaveHistoryCard
    leaves={dealer.leaves}
  /> */}

      {/* ======================================
          BASIC INFORMATION
      ====================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900">Dealer Information</h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <DetailItem label="Head Name" value={dealer.headName} />

            {/* <DetailItem
              label="Group Head"
              value={
                dealer.groupHead ? formatGroupHead(dealer.groupHead) : undefined
              }
            /> */}

            <DetailItem label="Firm Name" value={dealer.technicianFirmName} />

            <DetailItem label="Technician Name" value={dealer.technicianName} />

            <DetailItem label="Contact Person" value={dealer.contactPerson} />

            <DetailItem label="Mobile Number" value={dealer.mobileNumber} />

            <DetailItem
              label="Alternative Number"
              value={dealer.alternativeNumber}
            />

            {/* <DetailItem label="Landline / Phone" value={dealer.phoneNumbers} /> */}

            <DetailItem label="Email" value={dealer.email} />

            <DetailItem
              label="Date of Joining"
              value={
                dealer.dateOfJoining
                  ? new Date(dealer.dateOfJoining).toLocaleDateString("en-IN")
                  : "-"
              }
            />

            <DetailItem
              label="Date of Leaving"
              value={
                dealer.dateOfLeaving
                  ? new Date(dealer.dateOfLeaving).toLocaleDateString("en-IN")
                  : "-"
              }
            />

            <DetailItem
              label="Rating"
              value={dealer.rating !== undefined ? `${dealer.rating} / 5` : "-"}
            />

            <DetailItem label="Status" value={dealer.status} />
          </div>
        </Card>

        {/* TAX / ACCOUNT */}

        <Card className="p-5">
          <h3 className="font-semibold text-gray-900">
            Tax & Account Information
          </h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {/* <DetailItem label="Tax Apply" value={dealer.taxApply} /> */}

            <DetailItem label="GST Applicable" value={dealer.gstApplicable} />

            <DetailItem label="GST Number" value={dealer.gstNumber} />

            <DetailItem
              label="GST Rate"
              value={dealer.gstRate !== undefined ? `${dealer.gstRate}%` : "-"}
            />

            {/* <DetailItem label="PAN Number" value={dealer.panNumber} /> */}

            <DetailItem label="TIN Number" value={dealer.tinNumber} />

            {/* <DetailItem label="UIN Number" value={dealer.uinNumber} /> */}

            <DetailItem label="HSN Code" value={dealer.hsnCode} />

            <DetailItem
              label="Reverse Charge Limit"
              value={
                dealer.reverseChargeLimit !== undefined
                  ? `₹${Number(dealer.reverseChargeLimit).toLocaleString(
                      "en-IN",
                    )}`
                  : "-"
              }
            />

            <DetailItem
              label="Tax Input Payable"
              value={
                dealer.taxInputPayable
                  ? formatGroupHead(dealer.taxInputPayable)
                  : "-"
              }
            />

            <DetailItem
              label="Credit Limit"
              value={
                dealer.creditLimit !== undefined
                  ? `₹${Number(dealer.creditLimit).toLocaleString("en-IN")}`
                  : "-"
              }
            />

            <DetailItem
              label="Opening Balance"
              value={
                dealer.openingBalance !== undefined
                  ? `₹${Number(dealer.openingBalance).toLocaleString(
                      "en-IN",
                    )} ${dealer.openingBalanceType ?? ""}`
                  : "-"
              }
            />

            <DetailItem
              label="Account Status"
              value={dealer.accountDeactivated ? "Deactivated" : "Active"}
            />

            {dealer.additionalInfo?.map((item, index) => (
              <DetailItem
                key={index}
                label={`Additional Info ${index + 1}`}
                value={item.value}
              />
            ))}
          </div>
        </Card>
      </div>

      {/* ======================================
          CITY WISE PRODUCT & SERVICE MAPPING + CAPACITY
      ====================================== */}

      {cityEntries.map((entry) => (
        <Card key={entry.key} className="p-4">
          {/* CITY HEADER */}

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">
                {entry.city}
              </h3>

              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  entry.isPrimary
                    ? "bg-blue-50 text-[#123B7A]"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {entry.isPrimary ? "Primary" : "Additional"}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>
                Combined{" "}
                <b className="text-gray-800">{entry.combinedCapacity}</b>
              </span>
              <span>
                Individual{" "}
                <b className="text-gray-800">{entry.individualTotal}</b>
              </span>
              <span className="rounded-md bg-blue-50 px-2 py-1 font-semibold text-[#123B7A]">
                Total {entry.total}
              </span>
            </div>
          </div>

          {/* PRODUCT & SERVICE MAPPING */}

          <div className="mt-3">
            <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              <BriefcaseBusiness size={13} />
              Product & Service Mapping
            </p>

            {entry.services.length ? (
              <div className="divide-y divide-gray-100 rounded-lg border border-gray-200">
                {entry.services.map((product, index) => (
                  <div
                    key={`${product.productId}-${index}`}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-1.5"
                  >
                    <p className="w-40 shrink-0 truncate text-xs font-medium text-gray-900">
                      {product.productName}
                      <span className="ml-1 font-normal text-gray-400">
                        #{product.productId}
                      </span>
                    </p>

                    <div className="flex min-w-0 flex-1 flex-wrap gap-1">
                      {product.categories?.length ? (
                        product.categories.map((category) => (
                          <span
                            key={category.categoryId}
                            className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700"
                          >
                            {category.categoryName} - {category?.description} -{" "}
                            {category.rate !== undefined
                              ? `₹${Number(category.rate).toLocaleString("en-IN")}`
                              : "-"}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-gray-400">
                          No services mapped
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No products mapped.</p>
            )}
          </div>

          {/* CAPACITY */}

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 px-3 py-2">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Combined Capacity ·{" "}
                <span className="text-gray-900">{entry.combinedCapacity}</span>
              </p>

              {entry.combinedProducts.length ? (
                <div className="flex flex-wrap gap-1">
                  {entry.combinedProducts.map((product) => (
                    <span
                      key={product.productId}
                      className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700"
                    >
                      {product.productName}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Not mapped.</p>
              )}
            </div>

            <div className="rounded-lg border border-gray-200 px-3 py-2">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Individual Capacity ·{" "}
                <span className="text-gray-900">{entry.individualTotal}</span>
              </p>

              {entry.capacities.length ? (
                <div className="flex flex-wrap gap-1">
                  {entry.capacities.map((item, index) => (
                    <span
                      key={`${item.productId}-${index}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700"
                    >
                      {item.productName}
                      <b className="text-gray-900">{item.capacity}</b>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Not mapped.</p>
              )}
            </div>
          </div>
        </Card>
      ))}

      {/* ======================================
          ADDRESS
      ====================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        <AddressCard
          title="Business Address"
          address={dealer.businessAddress}
        />

        <AddressCard
          title="Residential Address"
          address={dealer.residentialAddress}
        />
      </div>

      {/* ======================================
          DOCUMENT INFORMATION
      ====================================== */}

      <Card className="p-5">
        <h3 className="font-semibold text-gray-900">Document Information</h3>

        {/* DOCUMENT NUMBERS */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem label="Aadhaar Number" value={dealer.aadhaarNumber} />

          <DetailItem label="PAN Number" value={dealer.panNumber} />

          <DetailItem
            label="Driving Licence Number"
            value={dealer.drivingLicenceNumber}
          />
        </div>

        {/* DOCUMENT IMAGES */}
        <div className="mt-6 border-t border-gray-100 pt-6">
          <h4 className="text-sm font-semibold text-gray-800">
            Uploaded Documents
          </h4>

          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <DocumentPreview
              label="Aadhaar Front"
              url={`${IMAGE_UPLOAD_URL}${dealerDocuments?.aadhaarFront}`}
            />

            <DocumentPreview
              label="Aadhaar Back"
              url={`${IMAGE_UPLOAD_URL}${dealerDocuments?.aadhaarBack}`}
            />

            <DocumentPreview
              label="PAN Front"
              url={`${IMAGE_UPLOAD_URL}${dealerDocuments?.panFront}`}
            />

            <DocumentPreview
              label="PAN Back"
              url={`${IMAGE_UPLOAD_URL}${dealerDocuments?.panBack}`}
            />

            <DocumentPreview
              label="Driving Licence Front"
              url={`${IMAGE_UPLOAD_URL}${dealerDocuments?.drivingLicenceFront}`}
            />

            <DocumentPreview
              label="Driving Licence Back"
              url={`${IMAGE_UPLOAD_URL}${dealerDocuments?.drivingLicenceBack}`}
            />
          </div>

          {/* OTHER DOCUMENTS */}
          {dealerDocuments?.otherDocuments?.length ? (
            <div className="mt-6">
              <h4 className="mb-3 text-sm font-semibold text-gray-800">
                Other Documents
              </h4>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {dealerDocuments.otherDocuments.map(
                  (document: string, index: number) => (
                    <DocumentPreview
                      key={`${document}-${index}`}
                      label={`Other Document ${index + 1}`}
                      url={`${IMAGE_UPLOAD_URL}${document}`}
                    />
                  ),
                )}
              </div>
            </div>
          ) : null}
        </div>
      </Card>
      {/* ======================================
          OTHER INFORMATION
      ====================================== */}

      {dealer.otherInfo && (
        <Card className="p-5">
          <h3 className="font-semibold text-gray-900">Other Information</h3>

          <p className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-600">
            {dealer.otherInfo}
          </p>
        </Card>
      )}

      <Card className="p-5">
        <h3 className="font-semibold text-gray-900">System Information</h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem label="Dealer ID" value={dealer._id} />

          <DetailItem label="Head Code" value={dealer.headCode} />

          <DetailItem
            label="Created At"
            value={
              dealer.createdAt
                ? new Date(dealer.createdAt).toLocaleString("en-IN")
                : "-"
            }
          />

          <DetailItem
            label="Last Updated"
            value={
              dealer.updatedAt
                ? new Date(dealer.updatedAt).toLocaleString("en-IN")
                : "-"
            }
          />
        </div>
      </Card>

      <DealerLeaveModal
        open={leaveModalOpen}
        dealerId={dealer._id}
        onClose={() => setLeaveModalOpen(false)}
        onSuccess={() => {
          setLeaveModalOpen(false);
          refetch();
        }}
      />

      <DealerRatingModal
        open={ratingModalOpen}
        dealerId={dealer._id}
        currentRating={dealer.rating ?? 0}
        onClose={() => setRatingModalOpen(false)}
        onSuccess={() => {
          setRatingModalOpen(false);
          refetch();
        }}
      />

      <DealerSuspendModal
        open={suspendModalOpen}
        dealerId={dealer._id}
        onClose={() => setSuspendModalOpen(false)}
        onSuccess={() => {
          setSuspendModalOpen(false);
          refetch();
        }}
      />

      <DealerRejoinModal
        open={rejoinModalOpen}
        dealerId={dealer._id}
        onClose={() => setRejoinModalOpen(false)}
        onSuccess={() => {
          setRejoinModalOpen(false);
          refetch();
        }}
      />

      <DealerLeaveHistoryModal
        dealerId={dealer._id}
        open={leaveHistoryOpen}
        leaves={dealer.leaves}
        onClose={() => setLeaveHistoryOpen(false)}
        onLeaveEnded={refetch}
      />

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-[#123B7A]" />

            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Dealer Activity
              </h2>

              <p className="mt-0.5 text-xs text-gray-500">
                Joining, leaving, suspension and rejoining history
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchDealerActivity}
            disabled={activityLoading}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCcw
              size={13}
              className={activityLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* BODY */}

        <div className="p-5">
          {activityLoading ? (
            <div className="py-8 text-center text-sm text-gray-500">
              Loading activity...
            </div>
          ) : activityLogs.length === 0 ? (
            <div className="py-10 text-center">
              <Activity size={30} className="mx-auto mb-2 text-gray-300" />

              <p className="text-sm font-medium text-gray-600">
                No activity found
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Dealer lifecycle activity will appear here.
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline vertical line */}

              <div className="absolute bottom-3 left-[17px] top-3 w-px bg-gray-200" />

              <div className="space-y-5">
                {activityLogs.map((log) => (
                  <DealerActivityItem key={log._id} log={log} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================================
   INFO
======================================== */

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="flex gap-3">
      <div className="mt-1 text-gray-400">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>

        <p className="mt-1 wrap-break-word text-sm font-medium text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}
/* ========================================
   DETAIL ITEM
======================================== */

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>

      <p className="mt-1 wrap-break-word text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}

/* ========================================
   ADDRESS CARD
======================================== */

interface Address {
  addressLine?: string;

  stateId?: number;
  state?: string;
  stateCode?: string;

  districtId?: number;
  district?: string;

  cityId?: number;
  city?: string;

  pincodeId?: number;
  pinCode?: string;
}

function AddressCard({ title, address }: { title: string; address?: Address }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <MapPin size={18} className="text-gray-400" />

        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="mt-4 text-sm leading-6 text-gray-600">
        <p className="font-medium text-gray-900">
          {address?.addressLine || "-"}
        </p>

        <p>
          {[address?.city, address?.district].filter(Boolean).join(", ") || "-"}
        </p>

        <p>
          {[address?.state, address?.pinCode].filter(Boolean).join(" - ") ||
            "-"}
        </p>
      </div>
    </Card>
  );
}

/* ========================================
   FORMAT ENUM
======================================== */

function formatGroupHead(value: string) {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function DocumentPreview({
  label,
  url,
}: {
  label: string;
  url?: string | null;
}) {
  const hasDocument = Boolean(url?.trim());

  const isImage =
    hasDocument &&
    /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(url?.split("?")[0] ?? "");

  return (
    <div>
      <p className="mb-2 text-xs font-medium text-gray-500">{label}</p>

      {hasDocument ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          {isImage ? (
            <a
              href={url!}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={url!}
                alt={label}
                className="h-48 w-full object-contain p-2"
              />
            </a>
          ) : (
            <div className="flex h-48 items-center justify-center p-4">
              <a
                href={url!}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-[#123B7A] px-4 py-2 text-sm font-medium text-white hover:bg-[#0B2854]"
              >
                View Document
              </a>
            </div>
          )}

          <div className="border-t border-gray-200 bg-white p-3">
            <a
              href={url!}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              Open {label}
            </a>
          </div>
        </div>
      ) : (
        <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
          <p className="text-xs text-gray-400">No document uploaded</p>
        </div>
      )}
    </div>
  );
}

function DealerActivityItem({ log }: { log: DealerLifecycleLog }) {
  const config = getActivityConfig(log.type);

  const Icon = config.icon;

  return (
    <div className="relative flex gap-4">
      {/* ICON */}

      <div
        className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${config.iconStyle}`}
      >
        <Icon size={15} />
      </div>

      {/* CONTENT */}

      <div className="min-w-0 flex-1 pb-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {config.title}
            </p>

            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
              <CalendarDays size={12} />

              {formatActivityDate(log.date)}
            </div>
          </div>

          <span
            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${config.badgeStyle}`}
          >
            {config.label}
          </span>
        </div>

        {/* REASON */}

        {log.reason && (
          <div className="mt-2 rounded-md bg-gray-50 px-3 py-2">
            <p className="text-xs text-gray-500">Reason</p>

            <p className="mt-0.5 text-sm text-gray-700">{log.reason}</p>
          </div>
        )}

        {/* CREATED BY */}

        {log.createdBy?.name && (
          <p className="mt-2 text-xs text-gray-400">
            Updated by{" "}
            <span className="font-medium text-gray-500">
              {log.createdBy.name}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
function getActivityConfig(type: DealerLifecycleType) {
  switch (type) {
    case "JOINED":
      return {
        title: "Dealer Joined",
        label: "Joined",
        icon: LogIn,

        iconStyle: "border-green-200 bg-green-50 text-green-700",

        badgeStyle: "border-green-200 bg-green-50 text-green-700",
      };

    case "LEFT":
      return {
        title: "Dealer Left",
        label: "Left",
        icon: LogOut,

        iconStyle: "border-gray-200 bg-gray-50 text-gray-600",

        badgeStyle: "border-gray-200 bg-gray-50 text-gray-600",
      };

    case "SUSPENDED":
      return {
        title: "Dealer Suspended",
        label: "Suspended",
        icon: ShieldBan,

        iconStyle: "border-red-200 bg-red-50 text-red-700",

        badgeStyle: "border-red-200 bg-red-50 text-red-700",
      };

    case "REJOINED":
      return {
        title: "Dealer Rejoined",
        label: "Rejoined",
        icon: RefreshCcw,

        iconStyle: "border-blue-200 bg-blue-50 text-blue-700",

        badgeStyle: "border-blue-200 bg-blue-50 text-blue-700",
      };

    default:
      return {
        title: "Dealer Activity",
        label: type,
        icon: Activity,

        iconStyle: "border-gray-200 bg-gray-50 text-gray-600",

        badgeStyle: "border-gray-200 bg-gray-50 text-gray-600",
      };
  }
}

function formatActivityDate(date: string) {
  if (!date) return "-";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "-";
  }

  return value.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
