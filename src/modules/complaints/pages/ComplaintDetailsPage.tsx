import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Package,
  Phone,
  UserRound,
  Wrench,
  History,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getComplaintById } from "../services/complaintApi";
import DealerInfoCard from "../components/DealerInfoCard";
import ComplaintActivityModal from "../../appointments/components/ComplaintActivityModal";
import { getComplaintActivities } from "../../appointments/services/appointmentApi";

/* =========================================================
   TYPES - EXACTLY BASED ON YOUR API RESPONSE
========================================================= */

interface Address {
  addressLine: string;
  stateId: number | null;
  state: string;
  districtId: number | null;
  district: string;
  cityId: number | null;
  city: string;
  pincodeId: number | null;
  pinCode: string;
}

interface Customer {
  _id: string;
  customerCode: string;
  name: string;
  phone: string;
  alternatePhone: string;
  email: string;
  address: Address;
  contactInfo: string;
  status: string;
}

interface Brand {
  _id: string;
  brandName: string;
}

interface ProductType {
  _id: string;
  product_id: number;
  product_code: string;
  product_type: string;
}

interface Category {
  _id: string;
  product_id: number;
  description: string;
  category: string;
  categoryDescription: string;
  status: string;
}

interface AllocatedDealer {
  _id: string;
  technicianFirmName: string;
  technicianName: string;
  mobileNumber: string;
  rating: number;
  status: string;
  technicianCode: string;
}

interface Complaint {
  _id: string;
  complaintNumber: string;
  complaintDateTime: string;
  customerId: Customer;
  customerName: string;
  phone: string;
  alternatePhone: string;
  email: string;
  address: Address;
  contactInfo: string;
  brandId: Brand | null;
  brand: string;
  productId: number | null;
  productName: string;
  productTypeId: ProductType | null;
  productType: string;
  productCode: string;
  productDescription: string;
  units: number;
  quoteAmount: number;
  faultReported: string;
  categoryId: Category | null;
  category: string;
  priority: string;
  complaintType: string;
  parentComplaintId: string | null;
  repeatComplaintNumber: string;
  adName: string;
  subject: string;
  description: string;
  status: string;
  technicianName: strng;
  dealerId: string | null;
  dealerName: string;
  allocatedDealerId: AllocatedDealer | null;
  allocationId: string | null;
  allocationRuleId: string | null;
  allocatedAt: string | null;
  appointmentDate: string | null;
  appointmentTime: string;
  pendingReason: string;
  suspendedAt: string | null;
  suspendedBy: string | null;
  suspensionReason: string;
  closedAt: string | null;
  warrantyStartDate: string | null;
  warrantyEndDate: string | null;
  cancelledAt: string | null;
  cancellationReason: string;
  createdAt: string;
  updatedAt: string;
  isWarranty: boolean;
    additionalInfo?: string[];  
}

interface ComplaintApiResponse {
  success: boolean;
  data: Complaint;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ComplaintDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activityOpen, setActivityOpen] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activities, setActivities] = useState<ComplaintActivity[]>([]);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);

  /* =========================================================
     FETCH COMPLAINT
  ========================================================= */

  const fetchComplaint = async () => {
    if (!id) {
      setError("Complaint ID not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = (await getComplaintById(id)) as ComplaintApiResponse;
      console.log("Complaint API Response:", response);
      setComplaint(response);
    } catch (error: any) {
      console.error("Complaint fetch error:", error);
      setComplaint(null);
      setError(error?.response?.data?.message || "Failed to fetch complaint");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleOpenActivity = async () => {
    if (!id) return;

    try {
      setActivityOpen(true);
      setActivityLoading(true);
      const response = await getComplaintActivities(id);
      setActivities(response?.activities);
    } catch (error) {
      console.error("Failed to fetch complaint activities:", error);
      setActivities([]);
    } finally {
      setActivityLoading(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <p className="text-sm text-gray-500">Loading complaint...</p>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !complaint) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <p className="text-sm text-red-500">{error || "Complaint not found"}</p>

        <button
          type="button"
          onClick={() => navigate("/complaints")}
          className="mt-4 text-sm font-medium text-[#123B7A]"
        >
          Back to Complaints
        </button>
      </div>
    );
  }

  // const customer = complaint.customerId;
  // const dealer = complaint.allocatedDealerId;
  const brand = complaint.brandId;
  const productType = complaint.productTypeId;
  const category = complaint.categoryId;

  return (
    <div className="space-y-3">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/complaints")}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={15} />
          Back to Complaints
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Activity */}
          <button
            type="button"
            onClick={handleOpenActivity}
            className=" inline-flex items-center gap-1.5 rounded-lg border border-[#123B7A] bg-white  px-3 py-2  text-xs font-semibold text-[#123B7A] transition hover:bg-blue-50"
          >
            <History size={15} />
            Activity
          </button>

          {/* Close Complaint */}
          {[
            "IN_PROGRESS",
            "APPOINTMENT_COMPLETED",
            "SERVICE_COMPLETED",
          ].includes(complaint.status) && (
            <button
              type="button"
              onClick={() => navigate(`/closures/${complaint._id}`)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700"
            >
              <CheckCircle2 size={15} />
              Close Complaint
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          SUMMARY
      ====================================================== */}

      <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-5">
            {/* Complaint */}
            <div>
              <p className="text-[11px] font-medium text-gray-500">Complaint</p>

              <h1 className="text-base font-semibold text-[#123B7A]">
                {complaint.complaintNumber}
              </h1>
            </div>

            <div className="hidden h-8 w-px bg-gray-200 md:block" />

            {/* Created Date */}
            <div>
              <p className="text-[11px] text-gray-500">Created</p>

              <p className="text-xs font-medium text-gray-700">
                {formatDate(complaint.createdAt)}
              </p>
            </div>

            <div className="hidden h-8 w-px bg-gray-200 md:block" />

            {/* Created By */}
            <div>
              <p className="text-[11px] text-gray-500">Created By</p>

              <p className="text-xs font-semibold text-gray-700">
                {complaint.createdBy?.name || "-"}
              </p>

              {complaint.createdBy?.email && (
                <p className="text-[10px] text-gray-400">
                  {complaint.createdBy.email}
                </p>
              )}
            </div>

            {/* Closed Date - only show when available */}
            {complaint.closedAt && (
              <>
                <div className="hidden h-8 w-px bg-gray-200 md:block" />

                <div>
                  <p className="text-[11px] text-gray-500">Closed Date</p>

                  <p className="text-xs font-semibold text-green-700">
                    {formatDate(complaint.closedAt)}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Status */}
          <StatusBadge status={complaint.status} />
        </div>
      </div>

      {/* =====================================================
        ROW 1
        CUSTOMER + PRODUCT
    ====================================================== */}

      <div className="grid gap-3 xl:grid-cols-2">
        {/* CUSTOMER */}
        <div>
          <CompactSection
            title="Customer Information"
            action={
              <button
                type="button"
                onClick={() => setShowCustomerDetails((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#123B7A] px-2.5 py-1 text-[11px] font-semibold text-[#123B7A] transition hover:bg-blue-50"
              >
                <UserRound size={13} />

                {showCustomerDetails ? "Hide Customer" : "View Customer"}
              </button>
            }
          >
            {showCustomerDetails && (
              <div className="space-y-4">
                {/* BASIC INFORMATION */}
                <div>
                  <SubSectionTitle title="Customer Details" />

                  <div className="grid grid-cols-2 gap-x-5 gap-y-3 lg:grid-cols-4">
                    <InfoItem
                      label="Customer Code"
                      value={complaint?.customer?.customerCode}
                    />

                    <InfoItem
                      label="Customer Name"
                      value={complaint?.customerName}
                    />

                    <InfoItem label="Mobile" value={complaint?.phone} />

                    <InfoItem
                      label="Alternate Mobile"
                      value={complaint?.alternatePhone}
                    />
                  </div>
                </div>

                {/* REGISTERED ADDRESS */}
                <div>
                  <SubSectionTitle title="Registered Address" />

                  <div className="grid grid-cols-2 gap-x-5 gap-y-3 lg:grid-cols-4">
                    <div className="col-span-2 lg:col-span-4">
                      <InfoItem
                        label="Address"
                        value={complaint.customer?.address?.addressLine}
                        multiline
                      />
                    </div>

                    <InfoItem
                      label="State"
                      value={complaint.customer?.address?.state}
                    />

                    <InfoItem
                      label="District"
                      value={complaint.customer?.address?.district}
                    />

                    <InfoItem
                      label="City"
                      value={complaint.customer?.address?.city}
                    />

                    <InfoItem
                      label="Pincode"
                      value={complaint.customer?.address?.pinCode}
                    />
                  </div>
                </div>
              </div>
            )}
          </CompactSection>

          {(complaint.status === "REGISTERED" ||
            complaint.status === "CANCEL_ON_CALL" ||
            complaint.status === "CANCEL_ON_VISIT" ||
            complaint.status === "CANCELLED") && (
            <DealerInfoCard
              complaintId={complaint._id}
              dealer={
                complaint.allocatedDealerId
                  ? {
                      id: complaint.allocatedDealerId._id,
                      name: complaint.allocatedDealerId.technicianName || "",
                      firmName:
                        complaint.allocatedDealerId.technicianFirmName || "",
                      phone: complaint.allocatedDealerId.mobileNumber || "",
                      headCode: complaint.allocatedDealerId.headCode || "",
                      rating: complaint.allocatedDealerId.rating ?? 0,
                      status: complaint.allocatedDealerId.status || "ACTIVE",
                    }
                  : null
              }
              allocationStatus={
                complaint.allocatedDealerId ? "ASSIGNED" : "UNASSIGNED"
              }
            />
          )}
        </div>

        <CompactSection
          title="Complaint Information"
          icon={<Package size={15} />}
        >
          {/* =========================================
              CUSTOMER SNAPSHOT
          ========================================= */}

          <SubSectionTitle title="Customer Details" />

          <div className="grid grid-cols-2 gap-x-5 gap-y-3 lg:grid-cols-4">
            <InfoItem
              label="Customer Code"
              value={complaint?.customer?.customerCode}
            />

            <InfoItem label="Customer Name" value={complaint?.customerName} />

            <InfoItem label="Mobile" value={complaint?.phone} />

            <InfoItem
              label="Alternate Mobile"
              value={complaint?.alternatePhone}
            />
          </div>

          {/* =========================================
              COMPLAINT ADDRESS
          ========================================= */}

          <SubSectionTitle title="Complaint Address" className="mt-4" />

          <div className="grid grid-cols-2 gap-x-5 gap-y-3 lg:grid-cols-4">
            <div className="col-span-2">
              <InfoItem
                label="Address"
                value={complaint.address?.addressLine}
              />
            </div>

            <InfoItem label="State" value={complaint.address?.state} />

            <InfoItem label="District" value={complaint.address?.district} />

            <InfoItem label="City" value={complaint.address?.city} />

            <InfoItem label="Pincode" value={complaint.address?.pinCode} />
          </div>

          {/* =========================================
      PRODUCT / SERVICE
  ========================================= */}

          <SubSectionTitle title="Product & Service" className="mt-4" />

          <div className="grid grid-cols-2 gap-x-5 gap-y-3 lg:grid-cols-4">
            <InfoItem
              label="Brand"
              value={brand?.brandName || complaint.brand}
            />

            <InfoItem label="Product" value={complaint.productName} />

            <InfoItem
              label="Product Type"
              value={productType?.product_type || complaint.productType}
            />

            <InfoItem
              label="Category"
              value={category?.category || complaint.category}
            />

            <div className="col-span-2">
              <InfoItem
                label="Category Description"
                value={category?.description}
              />
            </div>

            <InfoItem label="Units" value={complaint.units} />

            <InfoItem
              label="Quote Amount"
              value={`₹${complaint.quoteAmount ?? 0}`}
            />

            <div className="col-span-2">
              <InfoItem
                label="Fault Reported"
                value={complaint.faultReported}
              />
            </div>

            <InfoItem label="Complaint Type" value={complaint.complaintType} />

            <InfoItem
              label="Warranty"
              value={complaint.isWarranty ? "Yes" : "No"}
            />
          </div>

          {/* =========================================
      APPOINTMENT
  ========================================= */}

          <SubSectionTitle title="Appointment" className="mt-4" />

          <div className="grid grid-cols-2 gap-x-5 gap-y-3 lg:grid-cols-4">
            <InfoItem
              label="Appointment Date"
              value={
                complaint.appointmentDate
                  ? formatDate(complaint.appointmentDate)
                  : "-"
              }
            />

            <InfoItem
              label="Appointment Time"
              value={complaint.appointmentTime}
            />

            {complaint.pendingReason && (
              <div className="col-span-2">
                <InfoItem
                  label="Pending Reason"
                  value={complaint.pendingReason}
                />
              </div>
            )}
          </div>

          {/* =========================================
      ADDITIONAL DETAILS
  ========================================= */}

          {(complaint.repeatComplaintNumber || complaint.description) && (
            <>
              <SubSectionTitle title="Additional Details" className="mt-4" />

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
                {complaint.repeatComplaintNumber && (
                  <InfoItem
                    label="Repeat Complaint"
                    value={complaint.repeatComplaintNumber}
                  />
                )}

                <div className="lg:col-span-3">
                  <InfoItem
                    label="Description"
                    value={complaint.description || "No description provided."}
                    multiline
                  />
                </div>
              </div>
            </>
          )}

          
        </CompactSection>
        {(complaint.adName ||
  complaint.subject ||
  complaint.description ||
  (complaint.additionalInfo &&
    complaint.additionalInfo.length > 0)) && (
  <CompactSection title="Other Information">
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {complaint.adName && (
        <InfoItem
          label="Ad. Name"
          value={complaint.adName}
        />
      )}

      {complaint.subject && (
        <InfoItem
          label="Subject"
          value={complaint.subject}
        />
      )}

      {complaint.description && (
        <div className="sm:col-span-2 lg:col-span-4">
          <InfoItem
            label="Description"
            value={complaint.description}
            multiline
          />
        </div>
      )}

      {complaint.additionalInfo?.map((info, index) => (
        <InfoItem
          key={`${index}-${info}`}
          label={`Additional Info ${index + 1}`}
          value={info}
          multiline
        />
      ))}
    </div>
  </CompactSection>
)}
      </div>

      {/* =====================================================
        CONDITIONAL STATUS INFORMATION

        Don't show empty status fields.
    ====================================================== */}

      {(complaint.suspendedAt ||
        complaint.closedAt ||
        complaint.cancelledAt ||
        complaint.warrantyStartDate ||
        complaint.warrantyEndDate) && (
        <CompactSection title="Status Information">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {complaint.suspendedAt && (
              <InfoItem
                label="Suspended At"
                value={formatDate(complaint.suspendedAt)}
              />
            )}

            {complaint.suspensionReason && (
              <InfoItem
                label="Suspension Reason"
                value={complaint.suspensionReason}
              />
            )}

            {complaint.closedAt && (
              <InfoItem
                label="Closed At"
                value={formatDate(complaint.closedAt)}
              />
            )}

            {complaint.cancelledAt && (
              <InfoItem
                label="Cancelled At"
                value={formatDate(complaint.cancelledAt)}
              />
            )}

            {complaint.cancellationReason && (
              <InfoItem
                label="Cancellation Reason"
                value={complaint.cancellationReason}
              />
            )}

            {complaint.warrantyStartDate && (
              <InfoItem
                label="Warranty Start"
                value={formatDate(complaint.warrantyStartDate)}
              />
            )}

            {complaint.warrantyEndDate && (
              <InfoItem
                label="Warranty End"
                value={formatDate(complaint.warrantyEndDate)}
              />
            )}
          </div>
        </CompactSection>
      )}
      <ComplaintActivityModal
        open={activityOpen}
        loading={activityLoading}
        activities={activities}
        complaintNumber={complaint.complaintNumber}
        onClose={() => setActivityOpen(false)}
      />
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    REGISTERED: "border-blue-200 bg-blue-50 text-blue-700",
    ALLOCATED: "border-green-200 bg-green-50 text-green-700",
    APPOINTMENT_SCHEDULED: "border-purple-200 bg-purple-50 text-purple-700",
    PENDING_ON_CALL: "border-amber-200 bg-amber-50 text-amber-700",
    PENDING_ON_VISIT: "border-amber-200 bg-amber-50 text-amber-700",
    CANCEL_ON_CALL: "border-red-200 bg-red-50 text-red-700",
    CANCEL_ON_VISIT: "border-red-200 bg-red-50 text-red-700",
    CLOSED: "border-green-200 bg-green-50 text-green-700",
    CANCELLED: "border-red-200 bg-red-50 text-red-700",
    SUSPENDED: "border-gray-300 bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold ${
        variants[status] || "border-gray-200 bg-gray-50 text-gray-700"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />

      {status.replaceAll("_", " ")}
    </span>
  );
}

/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date?: string | null) {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface CompactSectionProps {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

function CompactSection({
  title,
  icon,
  action,
  children,
}: CompactSectionProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/80 px-4 py-2.5">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-[#123B7A]">
              {icon}
            </div>
          )}

          <h3 className="text-sm font-bold text-[#123B7A]">{title}</h3>
        </div>

        {action && <div>{action}</div>}
      </div>

      {/* Only render body when there is content */}
      {children && <div className="p-3">{children}</div>}
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value?: string | number | null | undefined;
  icon?: React.ReactNode;
  multiline?: boolean;
  highlight?: boolean;
}

function InfoItem({
  label,
  value,
  icon,
  multiline = false,
  highlight = false,
}: InfoItemProps) {
  const displayValue =
    value === null || value === undefined || value === "" ? "-" : String(value);

  return (
    <div
      className={`min-w-0 rounded-lg border px-3 py-2 transition ${
        highlight
          ? "border-blue-200 bg-blue-50/70"
          : "border-gray-400 bg-gray-50/70"
      }`}
    >
      {/* LABEL */}
      <div className="flex items-center gap-1.5">
        {icon && <span className="shrink-0 text-[#123B7A]">{icon}</span>}

        <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-gray-500">
          {label}
        </p>
      </div>

      {/* VALUE */}
      <p
        title={displayValue}
        className={`mt-1 text-[13px] font-semibold text-gray-900 ${
          multiline ? "whitespace-normal break-words leading-5" : "truncate"
        }`}
      >
        {displayValue}
      </p>
    </div>
  );
}

function SubSectionTitle({
  title,
  className = "",
}: {
  title: string;
  className?: string;
}) {
  return (
    <div
      className={`mb-3 rounded-md border border-blue-100 bg-blue-50/70 px-3 py-1.5 ${className}`}
    >
      <h4 className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#123B7A]">
        {title}
      </h4>
    </div>
  );
}
