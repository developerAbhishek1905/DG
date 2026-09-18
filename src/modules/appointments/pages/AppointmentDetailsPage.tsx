import PercentageClosureForm from "../components/PercentageClosureForm";
// import {
//   ArrowLeft,
//   CalendarDays,
//   Clock3,
//   MapPin,
//   Phone,
//   RefreshCw,
//   UserRound,
// } from "lucide-react";

// import { useState } from "react";

// import { useNavigate, useParams } from "react-router-dom";

// import Card from "../../../components/ui/Card";

// import AppointmentStatusBadge from "../components/AppointmentStatusBadge";
// import RescheduleModal from "../components/RescheduleModal";

// import { useAppointmentDetails } from "../hooks/useAppointments";

// import {
//   rescheduleAppointment,
//   updateAppointmentStatus,
// } from "../services/appointmentApi";

// import type { RescheduleAppointmentPayload } from "../types/appointment.types";

// export default function AppointmentDetailsPage() {
//   const navigate = useNavigate();

//   const { id } = useParams();

//   const [rescheduleOpen, setRescheduleOpen] = useState(false);

//   const { appointment, loading, setAppointment } = useAppointmentDetails(id);

//   if (loading) {
//     return (
//       <div className="rounded-xl border bg-white p-12 text-center">
//         Loading appointment...
//       </div>
//     );
//   }

//   if (!appointment) {
//     return (
//       <div className="rounded-xl border bg-white p-12 text-center">
//         Appointment not found.
//       </div>
//     );
//   }

//   const handleStatus = async (
//     status: "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW",
//   ) => {
//     const updated = await updateAppointmentStatus(appointment.id, status);

//     if (updated) {
//       setAppointment({
//         ...updated,
//       });
//     }
//   };

//   const handleReschedule = async (payload: RescheduleAppointmentPayload) => {
//     const updated = await rescheduleAppointment(payload);

//     setAppointment({
//       ...updated,
//     });

//     setRescheduleOpen(false);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
//         <button
//           onClick={() => navigate("/appointments")}
//           className="inline-flex items-center gap-2 text-sm text-gray-500"
//         >
//           <ArrowLeft size={17} />
//           Back to Appointments
//         </button>

//         <div className="flex flex-wrap gap-2">
//           {appointment.status !== "COMPLETED" &&
//             appointment.status !== "CANCELLED" && (
//               <button
//                 onClick={() => setRescheduleOpen(true)}
//                 className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm"
//               >
//                 <RefreshCw size={16} />
//                 Reschedule
//               </button>
//             )}

//           {appointment.status === "SCHEDULED" && (
//             <button
//               onClick={() => handleStatus("CONFIRMED")}
//               className="rounded-lg bg-[#123B7A] px-4 py-2 text-sm text-white"
//             >
//               Confirm
//             </button>
//           )}

//           {appointment.status !== "COMPLETED" &&
//             appointment.status !== "CANCELLED" && (
//               <button
//                 onClick={() => handleStatus("COMPLETED")}
//                 className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white"
//               >
//                 Complete
//               </button>
//             )}
//         </div>
//       </div>

//       <Card className="p-6">
//         <div className="flex flex-col justify-between gap-4 md:flex-row">
//           <div>
//             <p className="text-xs font-medium text-[#123B7A]">
//               {appointment.complaintNumber}
//             </p>

//             <h1 className="mt-1 text-2xl font-bold text-gray-900">
//               Appointment {appointment.id}
//             </h1>
//           </div>

//           <AppointmentStatusBadge status={appointment.status} />
//         </div>

//         <div className="mt-6 grid gap-5 border-t border-gray-100 pt-6 sm:grid-cols-2 xl:grid-cols-4">
//           <Info
//             icon={CalendarDays}
//             label="Date"
//             value={appointment.appointmentDate}
//           />

//           <Info
//             icon={Clock3}
//             label="Time"
//             value={appointment.appointmentTime}
//           />

//           <Info label="Type" value={appointment.type} />

//           <Info
//             label="Rescheduled"
//             value={String(appointment.rescheduleCount)}
//           />
//         </div>
//       </Card>

//       <div className="grid gap-6 lg:grid-cols-2">
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900">Customer Information</h3>

//           <div className="mt-5 space-y-4">
//             <Info
//               icon={UserRound}
//               label="Customer"
//               value={appointment.customer.name}
//             />

//             <Info
//               icon={Phone}
//               label="Phone"
//               value={appointment.customer.phone}
//             />

//             <Info
//               icon={MapPin}
//               label="Address"
//               value={`${appointment.customer.address}, ${appointment.customer.city}`}
//             />
//           </div>
//         </Card>

//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900">Dealer Information</h3>

//           <div className="mt-5 space-y-4">
//             <Info
//               icon={UserRound}
//               label="Dealer"
//               value={appointment.dealer.name}
//             />

//             <Info label="Dealer Code" value={appointment.dealer.dealerCode} />

//             <Info icon={Phone} label="Phone" value={appointment.dealer.phone} />
//           </div>
//         </Card>
//       </div>

//       {appointment.rescheduleReason && (
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900">
//             Reschedule Information
//           </h3>

//           <div className="mt-5 grid gap-5 md:grid-cols-3">
//             <Info
//               label="Original Date"
//               value={appointment.originalAppointmentDate ?? "-"}
//             />

//             <Info
//               label="Original Time"
//               value={appointment.originalAppointmentTime ?? "-"}
//             />

//             <Info label="Reason" value={appointment.rescheduleReason} />
//           </div>
//         </Card>
//       )}

//       {appointment.notes && (
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900">Notes</h3>

//           <p className="mt-3 text-sm leading-6 text-gray-600">
//             {appointment.notes}
//           </p>
//         </Card>
//       )}

//       <RescheduleModal
//         open={rescheduleOpen}
//         appointment={appointment}
//         onClose={() => setRescheduleOpen(false)}
//         onSubmit={handleReschedule}
//       />
//     </div>
//   );
// }

// function Info({
//   icon: Icon,
//   label,
//   value,
// }: {
//   icon?: React.ElementType;
//   label: string;
//   value: string;
// }) {
//   return (
//     <div className="flex gap-3">
//       {Icon && <Icon size={17} className="mt-1 shrink-0 text-gray-400" />}

//       <div>
//         <p className="text-xs text-gray-500">{label}</p>

//         <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
//       </div>
//     </div>
//   );
// }
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Phone,
  RefreshCw,
  UserRound,
  Package,
  Tag,
  Wrench,
  Hash,
  Mail,
  ShieldCheck,
  History,
} from "lucide-react";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Card from "../../../components/ui/Card";

import AppointmentStatusBadge from "../components/AppointmentStatusBadge";
import RescheduleModal from "../components/RescheduleModal";

import { useAppointmentDetails } from "../hooks/useAppointments";
import {
  rescheduleAppointment,
  updateAppointmentStatus,
  getReasonDropdown,
  getComplaintActivities,
} from "../services/appointmentApi";

import type { RescheduleAppointmentPayload } from "../types/appointment.types";
import ComplaintActivityModal from "../components/ComplaintActivityModal";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../app/hooks";
import PercentageClosureModal from "../components/PercentageClosureForm";


export default function AppointmentDetailsPage() {
  const [percentageBilling, setPercentageBilling] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const { appointment, loading, setAppointment } = useAppointmentDetails(id);

  type ReasonOption = {
    id: string;
    reasonName: string;
    reasonType?: string;
  };

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const [reasons, setReasons] = useState<ReasonOption[]>([]);
  const [reasonLoading, setReasonLoading] = useState(false);

  const [selectedReason, setSelectedReason] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  const [visitOpen, setVisitOpen] = useState(false);

  const [visitPendingOpen, setVisitPendingOpen] = useState(false);

  const [visitCancelOpen, setVisitCancelOpen] = useState(false);

  const [activityOpen, setActivityOpen] = useState(false);

  const [activityLoading, setActivityLoading] = useState(false);

  const [activities, setActivities] = useState<ComplaintActivity[]>([]);
  const [billingModalOpen, setBillingModalOpen] = useState(false);

  const [billingLoading, setBillingLoading] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const billingType = user?.dealerId?.billingType

  // const [percentageBilling, setPercentageBilling] =
  // useState(false);

  console.log(reasons);
  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center text-sm text-gray-500">
        Loading complaint details...
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center text-sm text-gray-500">
        Complaint not found.
      </div>
    );
  }

  console.log(appointment);

  /* =========================
     HELPERS
  ========================= */

  const formatDate = (date?: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date?: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatReason = (value?: string) => {
    if (!value) return "-";

    return value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const complaintAddress = [
    appointment.address?.addressLine,
    appointment.address?.city,
    appointment.address?.district,
    appointment.address?.state,
    appointment.address?.pinCode,
  ]
    .filter(Boolean)
    .join(", ");

  /* =========================
     STATUS UPDATE
  ========================= */

  const handleStatus = async (status: string) => {
    try {
      const updated = await updateAppointmentStatus(appointment._id, status);

      if (updated) {
        setAppointment(updated);
      }
    } catch (error) {
      console.error("Failed to update complaint status:", error);
    }
  };

  /* =========================
     RESCHEDULE
  ========================= */

  const handleReschedule = async (payload: RescheduleAppointmentPayload) => {
    try {
      const updated = await updateAppointmentStatus(
        payload.appointmentId,
        "RESCHEDULED",
        {
          appointmentDate: payload.appointmentDate,

          appointmentTime: payload.appointmentTime,
        },
      );

      if (updated) {
        setAppointment(updated);
      }

      setRescheduleOpen(false);
    } catch (error) {
      console.error("Failed to reschedule appointment:", error);
    }
  };

  const openPendingModal = async () => {
    try {
      setReasonLoading(true);
      setSelectedReason("");
      setPendingOpen(true);

      const response = await getReasonDropdown("on_call_pending");

      console.log("Pending reasons:", response);

      setReasons(response?.data || []);
    } catch (error) {
      console.error("Failed to load pending reasons:", error);

      setReasons([]);
    } finally {
      setReasonLoading(false);
    }
  };

  const openCancelModal = async () => {
    try {
      setReasonLoading(true);
      setSelectedReason("");
      setCancelOpen(true);

      const response = await getReasonDropdown("on_call_cancel");

      console.log("Cancel reasons:", response);

      setReasons(response?.data || []);
    } catch (error) {
      console.error("Failed to load cancellation reasons:", error);

      setReasons([]);
    } finally {
      setReasonLoading(false);
    }
  };

  const today = new Date();

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const toDateInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const todayValue = toDateInput(today);
  const tomorrowValue = toDateInput(tomorrow);

  const openVisitPendingModal = async () => {
    try {
      // close every other reason popup
      setPendingOpen(false);
      setCancelOpen(false);
      setVisitCancelOpen(false);

      setReasonLoading(true);
      setSelectedReason("");
      setReasons([]);

      setVisitPendingOpen(true);

      const response = await getReasonDropdown("after_call_pending");

      setReasons(response?.data || []);
    } catch (error) {
      console.error("Failed to load visit pending reasons:", error);

      setReasons([]);
    } finally {
      setReasonLoading(false);
    }
  };

  const openVisitCancelModal = async () => {
    try {
      // close every other reason popup
      setPendingOpen(false);
      setCancelOpen(false);
      setVisitPendingOpen(false);

      setReasonLoading(true);
      setSelectedReason("");
      setReasons([]);

      setVisitCancelOpen(true);

      const response = await getReasonDropdown("after_call_cancel");

      setReasons(response?.data || []);
    } catch (error) {
      console.error("Failed to load visit cancel reasons:", error);

      setReasons([]);
    } finally {
      setReasonLoading(false);
    }
  };

  const handleViewActivity = async () => {
    if (!appointment?._id) {
      return;
    }

    try {
      setActivityOpen(true);

      setActivityLoading(true);

      const response = await getComplaintActivities(appointment._id);

      setActivities(response?.activities || []);
    } catch (error) {
      console.error("Failed to load complaint activity:", error);

      toast.error("Failed to load activity");

      setActivities([]);
    } finally {
      setActivityLoading(false);
    }
  };
  // const handleCloseOnBilling = async () => {
  //   const dealer = appointment.allocatedDealerId;

  //   if (!dealer) {
  //     toast.error("Dealer not found");
  //     return;
  //   }

  //   const billingType = dealer.billingType;

  //   /*
  // |--------------------------------------------------------------------------
  // | FIXED
  // |--------------------------------------------------------------------------
  // */

  //   if (billingType === "FIXED") {
  //     try {
  //       setActionLoading(true);

  //       const updated = await updateAppointmentStatus(
  //         appointment._id,
  //         "CLOSE_ON_BILLING",
  //       );

  //       if (updated) {
  //         setAppointment(updated);
  //       }
  //     } catch (error) {
  //       console.error("Close billing failed:", error);
  //     } finally {
  //       setActionLoading(false);
  //     }

  //     return;
  //   }

  //   /*
  // |--------------------------------------------------------------------------
  // | PARTIAL / PROFIT
  // |--------------------------------------------------------------------------
  // */

  //   if (billingType === "PARTIAL_PAYMENT" || billingType === "PROFIT_SHARING") {
  //     setBillingModalOpen(true);
  //     return;
  //   }

  //   toast.error("Dealer billing type is not configured");
  // };
console.log(user)
  const handleCloseOnBilling = async () => {
    /*
  |--------------------------------------------------------------------------
  | Dealer billing configuration from logged-in user
  |--------------------------------------------------------------------------
  */

    const dealer = user?.dealerId;

    if (!dealer) {
      toast.error("Dealer billing information not found");
      return;
    }

    const billingType = dealer.billingType;

    /*
  |--------------------------------------------------------------------------
  | FIXED
  |--------------------------------------------------------------------------
  */

    if (billingType === "FIXED") {
      try {
        setActionLoading(true);

        const updated = await updateAppointmentStatus(
          appointment._id,
          "CLOSE_ON_BILLING",
        );

        if (updated) {
          setAppointment(updated);
        }
      } catch (error) {
        console.error("Close billing failed:", error);
      } finally {
        setActionLoading(false);
      }

      return;
    }

    /*
  |--------------------------------------------------------------------------
  | PARTIAL PAYMENT
  |--------------------------------------------------------------------------
  */

    if (billingType === "PARTIAL_PAYMENT") {
      setBillingModalOpen(true);
      return;
    }

    /*
  |--------------------------------------------------------------------------
  | PROFIT SHARING
  |--------------------------------------------------------------------------
  */

    if (billingType === "PROFIT_SHARING") {
      setBillingModalOpen(true);
      return;
    }

    toast.error("Dealer billing type is not configured");
  };

  const handleBillingSubmit = async ({
  customerAmount,
  profitAmount,
}: {
  customerAmount: number;
  profitAmount?: number;
}) => {
  try {
    setBillingLoading(true);

    const payload =
      billingType ===
      "PROFIT_SHARING"
        ? {
            customerAmount,
            profitAmount,
          }
        : {
            customerAmount,
          };

    const updated =
      await updateAppointmentStatus(
        appointment._id,
        "CLOSE_ON_BILLING",
        payload,
      );

    if (updated) {
      setAppointment(updated);

      setBillingModalOpen(false);

      toast.success(
        "Billing submitted for verification",
      );
    }
  } catch (error) {
    console.error(
      "Billing submission failed:",
      error,
    );
  } finally {
    setBillingLoading(false);
  }
};

  const handlePercentageBillingSubmit = async ({
    customerAmount,
    profitAmount,
    percentage,
    charge,
  }: {
    customerAmount: number;
    profitAmount?: number;
    percentage: number;
    charge: number;
  }) => {
    try {
      setBillingLoading(true);

      const billingType = appointment.allocatedDealerId?.billingType;

      const payload = {
        customerAmount,

        profitAmount:
          billingType === "PROFIT_SHARING" ? profitAmount : undefined,

        percentage,

        charge,
      };

      console.log("Billing payload:", payload);

      /*
       * Call billing submission API here.
       *
       * IMPORTANT:
       * Backend should calculate percentage
       * and charge again. Never trust the
       * percentage/charge sent by frontend.
       */

      const response = await submitComplaintBilling(appointment._id, payload);

      if (response) {
        setAppointment(response);

        setBillingModalOpen(false);

        toast.success("Billing submitted for DG approval");
      }
    } catch (error) {
      console.error("Billing submission failed:", error);

      toast.error("Failed to submit billing");
    } finally {
      setBillingLoading(false);
    }
  };

  //   const openCancelModal = async () => {
  //   try {
  //     setPendingOpen(false);
  //     setVisitPendingOpen(false);
  //     setVisitCancelOpen(false);

  //     setReasonLoading(true);
  //     setSelectedReason("");
  //     setReasons([]);

  //     setCancelOpen(true);

  //     const response = await getReasonDropdown(
  //       "on_call_cancel",
  //     );

  //     setReasons(response?.data || []);
  //   } catch (error) {
  //     console.error(
  //       "Failed to load cancellation reasons:",
  //       error,
  //     );

  //     setReasons([]);
  //   } finally {
  //     setReasonLoading(false);
  //   }
  // };

  return (
    <div className="space-y-5">
      <PercentageClosureForm
        complaintId={appointment._id}
        status={appointment.status}
        onSubmitted={setAppointment}
        onMethod={setPercentageBilling}
      />
      {/* <PercentageClosureForm complaintId={appointment._id} status={appointment.status} onSubmitted={setAppointment} onMethod={setPercentageBilling} /> */}
      {/* =========================
          TOP BAR
      ========================= */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <button
          type="button"
          onClick={() => navigate("/appointments")}
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#123B7A]"
        >
          <ArrowLeft size={17} />
          Back to Appointments
        </button>

        <button
          type="button"
          onClick={handleViewActivity}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <History size={17} />
          View Activity
        </button>

        <div className="flex flex-wrap gap-2">
          {appointment.status === "APPOINTMENT_SCHEDULED" && (
            <button
              type="button"
              onClick={() => setRescheduleOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <RefreshCw size={16} />
              Reschedule
            </button>
          )}
        </div>
      </div>

      {/* =========================
          COMPLAINT HEADER
      ========================= */}
      <Card className="p-4 sm:p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Take Action
        </p>

        {/* =========================
      NEW / ALLOCATED
  ========================= */}
        {(appointment.status === "ALLOCATED" ||
          appointment.status === "REOPEN") && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => {
                setSelectedDate("");
                setSelectedTime("");
                setScheduleOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-3 text-sm font-semibold text-white"
            >
              <CalendarDays size={17} />
              Schedule Appointment
            </button>

            <button
              type="button"
              onClick={openPendingModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm font-semibold text-yellow-700"
            >
              <Clock3 size={17} />
              Pending
            </button>

            <button
              type="button"
              onClick={openCancelModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
            >
              Cancel
            </button>
          </div>
        )}

        {/* =========================
      APPOINTMENT SCHEDULED
  ========================= */}
        {appointment.status === "APPOINTMENT_SCHEDULED" && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {/* Reschedule */}

            <button
              type="button"
              onClick={() => {
                setSelectedDate("");
                setSelectedTime("");
                setRescheduleOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700"
            >
              <RefreshCw size={17} />
              Reschedule
            </button>

            {/* Visit */}

            <button
              type="button"
              disabled={actionLoading}
              onClick={async () => {
                try {
                  setActionLoading(true);

                  const updated = await updateAppointmentStatus(
                    appointment._id,
                    "VISITED",
                  );

                  if (updated) {
                    setAppointment(updated);
                  }
                } catch (error) {
                  console.error("Visit update failed:", error);
                } finally {
                  setActionLoading(false);
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              <MapPin size={17} />

              {actionLoading ? "Updating..." : "Visit"}
            </button>

            {/* Cancel */}

            <button
              type="button"
              onClick={openCancelModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
            >
              Cancel
            </button>
          </div>
        )}

        {appointment.status === "RESCHEDULED" && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              disabled={actionLoading}
              onClick={async () => {
                try {
                  setActionLoading(true);

                  const updated = await updateAppointmentStatus(
                    appointment._id,
                    "VISITED",
                  );

                  if (updated) {
                    setAppointment(updated);
                  }
                } catch (error) {
                  console.error("Visit update failed:", error);
                } finally {
                  setActionLoading(false);
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
            >
              <MapPin size={17} />

              {actionLoading ? "Updating..." : "Visit"}
            </button>

            <button
              type="button"
              onClick={openCancelModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            >
              Cancel
            </button>
          </div>
        )}

        {appointment.status === "VISITED" && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {/* CLOSE ON BILLING */}

            {/* <button
              hidden={percentageBilling}
              type="button"
              disabled={actionLoading}
              onClick={async () => {
                try {
                  setActionLoading(true);

                  const updated = await updateAppointmentStatus(
                    appointment._id,
                    "CLOSE_ON_BILLING",
                  );

                  if (updated) {
                    setAppointment(updated);
                  }
                } catch (error) {
                  console.error("Close on billing failed:", error);
                } finally {
                  setActionLoading(false);
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              Close on Billing
            </button> */}

            <button
              type="button"
              disabled={actionLoading}
              onClick={handleCloseOnBilling}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {actionLoading ? "Processing..." : "Close on Billing"}
            </button>

            {/* PENDING ON VISIT */}

            <button
              type="button"
              onClick={openVisitPendingModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-100"
            >
              <Clock3 size={17} />
              Pending on Visit
            </button>

            {/* CANCEL ON VISIT */}

            <button
              type="button"
              onClick={openVisitCancelModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            >
              Cancel on Visit
            </button>
          </div>
        )}

        {/* =========================
            PENDING ON VISIT
        ========================= */}

        {appointment.status === "PENDING_ON_VISIT" && !percentageBilling && (
          <div className="grid grid-cols-1 gap-2">
            {/* <button
              type="button"
              onClick={async () => {
                try {
                  setActionLoading(true);

                  const updated = await updateAppointmentStatus(
                    appointment._id,
                    "CLOSE_ON_BILLING",
                  );

                  if (updated) {
                    setAppointment(updated);
                  }
                } catch (error) {
                  console.error("Close on billing failed:", error);
                } finally {
                  setActionLoading(false);
                }
              }}
              disabled={actionLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              close on billing
            </button> */}

            <button
              type="button"
              onClick={handleCloseOnBilling}
              disabled={actionLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {actionLoading ? "Processing..." : "Close on Billing"}
            </button>
          </div>
        )}

        {/* =========================
            PENDING ON CALL
        ========================= */}

        {appointment.status === "PENDING_ON_CALL" && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {/* SCHEDULE APPOINTMENT */}

            <button
              type="button"
              onClick={() => {
                setSelectedDate("");
                setSelectedTime("");
                setScheduleOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#123B7A] px-4 py-3 text-sm font-semibold text-white"
            >
              <CalendarDays size={17} />
              Schedule Appointment
            </button>

            {/* CANCEL */}

            <button
              type="button"
              onClick={openCancelModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            >
              Cancel
            </button>
          </div>
        )}
      </Card>

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Complaint Number
            </p>

            <h1 className="mt-1 break-all text-xl font-bold text-[#123B7A] sm:text-2xl">
              {appointment.complaintNumber || "-"}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Created: {formatDateTime(appointment.complaintDateTime)}
            </p>
          </div>

          <div className="shrink-0">
            <AppointmentStatusBadge
              status={
                appointment.status === "ALLOCATED" ? "NEW" : appointment.status
              }
            />
          </div>
        </div>

        <div className="mt-5 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <Info
            icon={Tag}
            label="Priority"
            value={appointment.priority || "-"}
          />

          <Info
            label="Complaint Type"
            value={appointment.complaintType || "-"}
          />

          <Info
            icon={Package}
            label="Units"
            value={String(appointment.units ?? "-")}
          />

          <Info
            label="Quote Amount"
            value={
              appointment.quoteAmount != null
                ? `₹${appointment.quoteAmount}`
                : "-"
            }
          />
        </div>
      </Card>

      {/* =========================
          CUSTOMER INFORMATION
      ========================= */}

      <Card className="p-5 sm:p-6">
        <h3 className="text-base font-semibold text-gray-900">
          Customer Information
        </h3>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Info
            icon={UserRound}
            label="Customer Name"
            value={appointment.customerName || "-"}
          />

          <Info
            icon={Phone}
            label="Mobile Number"
            value={appointment.phone || "-"}
            phone
          />

          <Info
            icon={Phone}
            label="Alternate Number"
            value={appointment.alternatePhone || "-"}
            phone={Boolean(appointment.alternatePhone)}
          />

          <Info icon={Mail} label="Email" value={appointment.email || "-"} />

          <Info
            label="Customer Code"
            value={appointment.customerId?.customerCode || "-"}
          />

          <Info
            label="Customer Status"
            value={appointment.customerId?.status || "-"}
          />
        </div>

        <div className="mt-5 border-t border-gray-100 pt-5">
          <Info
            icon={MapPin}
            label="Complaint Address"
            value={complaintAddress || "-"}
          />
        </div>
      </Card>

      {/* =========================
          PRODUCT INFORMATION
      ========================= */}

      <Card className="p-5 sm:p-6">
        <h3 className="text-base font-semibold text-gray-900">
          Product & Complaint Information
        </h3>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Info
            icon={Package}
            label="Product"
            value={appointment.productName || "-"}
          />

          <Info
            icon={Hash}
            label="Product ID"
            value={String(appointment.productId ?? "-")}
          />

          <Info
            icon={Wrench}
            label="Product Type"
            value={appointment.productType || "-"}
          />

          <Info
            label="Product Code"
            value={
              appointment.productCode ||
              appointment.productTypeId?.product_code ||
              "-"
            }
          />

          <Info
            icon={Tag}
            label="Category"
            value={appointment.category || "-"}
          />

          <Info
            label="Category Description"
            value={appointment.categoryId?.description || "-"}
          />

          <Info label="Brand" value={appointment.brand || "-"} />

          <Info
            label="Complaint Type"
            value={appointment.complaintType || "-"}
          />

          <Info
            label="Warranty"
            value={appointment.isWarranty ? "Yes" : "No"}
          />
        </div>

        <div className="mt-5 border-t border-gray-100 pt-5">
          <Info
            label="Fault Reported"
            value={appointment.faultReported || "-"}
          />
        </div>

        {appointment.description && (
          <div className="mt-5 border-t border-gray-100 pt-5">
            <Info label="Description" value={appointment.description} />
          </div>
        )}
      </Card>

      {/* =========================
          APPOINTMENT INFORMATION
      ========================= */}

      {(appointment.appointmentDate || appointment.appointmentTime) && (
        <Card className="p-5 sm:p-6">
          <h3 className="text-base font-semibold text-gray-900">
            Appointment Information
          </h3>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Info
              icon={CalendarDays}
              label="Appointment Date"
              value={formatDate(appointment.appointmentDate)}
            />

            <Info
              icon={Clock3}
              label="Appointment Time"
              value={appointment.appointmentTime || "-"}
            />

            <Info label="Status" value={appointment.status || "-"} />
          </div>
        </Card>
      )}

      {/* =========================
          DEALER INFORMATION
      ========================= */}

      {appointment.allocatedDealerId && (
        <Card className="p-5 sm:p-6">
          <h3 className="text-base font-semibold text-gray-900">
            Allocated Dealer / Technician
          </h3>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Info
              icon={UserRound}
              label="Firm Name"
              value={appointment.allocatedDealerId.technicianFirmName || "-"}
            />

            <Info
              icon={UserRound}
              label="Technician Name"
              value={appointment.allocatedDealerId.technicianName || "-"}
            />

            <Info
              icon={Phone}
              label="Mobile Number"
              value={appointment.allocatedDealerId.mobileNumber || "-"}
              phone={Boolean(appointment.allocatedDealerId.mobileNumber)}
            />

            <Info
              label="Rating"
              value={String(appointment.allocatedDealerId.rating ?? 0)}
            />

            <Info
              label="Dealer Status"
              value={appointment.allocatedDealerId.status || "-"}
            />

            <Info
              label="Allocated At"
              value={formatDateTime(appointment.allocatedAt)}
            />
          </div>
        </Card>
      )}

      {/* =========================
          PENDING INFORMATION
      ========================= */}

      {appointment.status === "PENDING" && appointment.pendingReason && (
        <Card className="border-yellow-200 bg-yellow-50 p-5 sm:p-6">
          <h3 className="font-semibold text-yellow-800">Pending Information</h3>

          <div className="mt-4">
            <Info
              label="Pending Reason"
              value={formatReason(appointment.pendingReason)}
            />
          </div>
        </Card>
      )}

      {/* =========================
          CANCELLATION INFORMATION
      ========================= */}

      {appointment.status === "CANCELLED" && (
        <Card className="border-red-200 bg-red-50 p-5 sm:p-6">
          <h3 className="font-semibold text-red-800">
            Cancellation Information
          </h3>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <Info
              label="Cancellation Reason"
              value={formatReason(appointment.cancellationReason)}
            />

            <Info
              label="Cancelled At"
              value={formatDateTime(appointment.cancelledAt)}
            />
          </div>
        </Card>
      )}

      {/* =========================
          OTHER INFORMATION
      ========================= */}

      <Card className="p-5 sm:p-6">
        <h3 className="text-base font-semibold text-gray-900">
          Other Information
        </h3>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Info label="Allocation ID" value={appointment.allocationId || "-"} />

          <Info
            label="Allocation Rule ID"
            value={appointment.allocationRuleId || "-"}
          />

          <Info
            label="Created At"
            value={formatDateTime(appointment.createdAt)}
          />

          <Info
            label="Last Updated"
            value={formatDateTime(appointment.updatedAt)}
          />

          <Info
            icon={ShieldCheck}
            label="Warranty"
            value={appointment.isWarranty ? "Yes" : "No"}
          />

          {appointment.closedAt && (
            <Info
              label="Closed At"
              value={formatDateTime(appointment.closedAt)}
            />
          )}
        </div>
      </Card>

      {/* =========================
          RESCHEDULE MODAL
      ========================= */}

      <RescheduleModal
        open={rescheduleOpen}
        appointment={appointment}
        onClose={() => setRescheduleOpen(false)}
        onSubmit={handleReschedule}
      />

      {scheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Schedule Appointment
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {appointment.complaintNumber}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setScheduleOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
              >
                ×
              </button>
            </div>

            {/* Date */}

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Select Appointment Date
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDate(todayValue)}
                  className={`rounded-xl border p-3 text-left transition ${
                    selectedDate === todayValue
                      ? "border-[#123B7A] bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <p className="text-xs text-gray-500">Today</p>

                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {today.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDate(tomorrowValue)}
                  className={`rounded-xl border p-3 text-left transition ${
                    selectedDate === tomorrowValue
                      ? "border-[#123B7A] bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <p className="text-xs text-gray-500">Tomorrow</p>

                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {tomorrow.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </button>
              </div>
            </div>

            {/* Time */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Appointment Time
              </label>

              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-[#123B7A] focus:ring-1 focus:ring-[#123B7A]"
              />
            </div>

            {/* Footer */}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setScheduleOpen(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!selectedDate || !selectedTime || actionLoading}
                onClick={async () => {
                  try {
                    setActionLoading(true);

                    const updated = await updateAppointmentStatus(
                      appointment._id,
                      "APPOINTMENT_SCHEDULED",
                      {
                        appointmentDate: selectedDate,
                        appointmentTime: selectedTime,
                      },
                    );

                    if (updated) {
                      setAppointment(updated);
                    }

                    setScheduleOpen(false);
                  } catch (error) {
                    console.error("Schedule error:", error);
                  } finally {
                    setActionLoading(false);
                  }
                }}
                className="flex-1 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading ? "Saving..." : "Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingOpen && (
        <ReasonModal
          title="Mark Complaint Pending"
          description="Select the reason for keeping this complaint pending."
          loading={reasonLoading}
          reasons={reasons}
          selectedReason={selectedReason}
          onReasonChange={setSelectedReason}
          actionLoading={actionLoading}
          actionLabel="Mark Pending"
          type="pending"
          onClose={() => {
            setPendingOpen(false);
            setSelectedReason("");
            setReasons([]);
          }}
          onSubmit={async () => {
            if (!selectedReason) return;

            try {
              setActionLoading(true);

              const selected = reasons.find(
                (item) => item.id === selectedReason,
              );

              if (!selected) return;

              const updated = await updateAppointmentStatus(
                appointment._id,
                "PENDING_ON_CALL",
                {
                  pendingReason: selected.reasonName,
                },
              );

              if (updated) {
                setAppointment(updated);
              }

              setPendingOpen(false);
              setSelectedReason("");
              setReasons([]);
            } catch (error) {
              console.error("Pending update failed:", error);
            } finally {
              setActionLoading(false);
            }
          }}
        />
      )}

      {cancelOpen && (
        <ReasonModal
          title="Cancel Complaint"
          description="Select the reason for cancelling this complaint."
          loading={reasonLoading}
          reasons={reasons}
          selectedReason={selectedReason}
          onReasonChange={setSelectedReason}
          actionLoading={actionLoading}
          actionLabel="Cancel Complaint"
          type="cancel"
          onClose={() => {
            setCancelOpen(false);
            setSelectedReason("");
            setReasons([]);
          }}
          onSubmit={async () => {
            if (!selectedReason) return;

            try {
              setActionLoading(true);

              const selected = reasons.find(
                (item) => item.id === selectedReason,
              );

              if (!selected) return;

              const updated = await updateAppointmentStatus(
                appointment._id,
                "CANCEL_ON_CALL",
                {
                  cancellationReason: selected.reasonName,
                },
              );

              if (updated) {
                setAppointment(updated);
              }

              setCancelOpen(false);
              setSelectedReason("");
              setReasons([]);
            } catch (error) {
              console.error("Cancellation failed:", error);
            } finally {
              setActionLoading(false);
            }
          }}
        />
      )}

      {visitPendingOpen && (
        <ReasonModal
          title="Pending on Visit"
          description="Select the reason for keeping this complaint pending after visit."
          loading={reasonLoading}
          reasons={reasons}
          selectedReason={selectedReason}
          onReasonChange={setSelectedReason}
          actionLoading={actionLoading}
          actionLabel="Mark Pending"
          type="pending"
          onClose={() => {
            setVisitPendingOpen(false);
            setSelectedReason("");
            setReasons([]);
          }}
          onSubmit={async () => {
            if (!selectedReason) return;

            try {
              setActionLoading(true);

              const selected = reasons.find(
                (item) => item.id === selectedReason,
              );

              if (!selected) return;

              const updated = await updateAppointmentStatus(
                appointment._id,

                "PENDING_ON_VISIT",

                {
                  pendingReason: selected.reasonName,
                },
              );

              if (updated) {
                setAppointment(updated);
              }

              setVisitPendingOpen(false);

              setSelectedReason("");
              setReasons([]);
            } catch (error) {
              console.error("Pending on visit failed:", error);
            } finally {
              setActionLoading(false);
            }
          }}
        />
      )}

      {visitCancelOpen && (
        <ReasonModal
          title="Cancel on Visit"
          description="Select the reason for cancelling this complaint after visit."
          loading={reasonLoading}
          reasons={reasons}
          selectedReason={selectedReason}
          onReasonChange={setSelectedReason}
          actionLoading={actionLoading}
          actionLabel="Cancel Complaint"
          type="cancel"
          onClose={() => {
            setVisitCancelOpen(false);
            setSelectedReason("");
            setReasons([]);
          }}
          onSubmit={async () => {
            if (!selectedReason) return;

            try {
              setActionLoading(true);

              const selected = reasons.find(
                (item) => item.id === selectedReason,
              );

              if (!selected) return;

              const updated = await updateAppointmentStatus(
                appointment._id,

                "CANCEL_ON_VISIT",

                {
                  cancellationReason: selected.reasonName,
                },
              );

              if (updated) {
                setAppointment(updated);
              }

              setVisitCancelOpen(false);

              setSelectedReason("");
              setReasons([]);
            } catch (error) {
              console.error("Cancel on visit failed:", error);
            } finally {
              setActionLoading(false);
            }
          }}
        />
      )}

      {/* =========================
          ON CALL CANCEL REASON MODAL
      ========================= */}

      {cancelOpen && (
        <ReasonModal
          title="Cancel Complaint"
          description="Select the reason for cancelling this complaint."
          loading={reasonLoading}
          reasons={reasons}
          selectedReason={selectedReason}
          onReasonChange={setSelectedReason}
          actionLoading={actionLoading}
          actionLabel="Cancel Complaint"
          type="cancel"
          onClose={() => {
            setCancelOpen(false);
            setSelectedReason("");
            setReasons([]);
          }}
          onSubmit={async () => {
            if (!selectedReason) return;

            try {
              setActionLoading(true);

              const selected = reasons.find(
                (item) => item.id === selectedReason,
              );

              if (!selected) {
                return;
              }

              const updated = await updateAppointmentStatus(
                appointment._id,
                "CANCEL_ON_CALL",
                {
                  cancellationReason: selected.reasonName,
                },
              );

              if (updated) {
                setAppointment(updated);
              }

              setCancelOpen(false);
              setSelectedReason("");
              setReasons([]);
            } catch (error) {
              console.error("Cancel on call failed:", error);
            } finally {
              setActionLoading(false);
            }
          }}
        />
      )}
      {/* 
      {billingModalOpen &&
        (appointment.allocatedDealerId?.billingType === "PARTIAL_PAYMENT" ||
          appointment.allocatedDealerId?.billingType === "PROFIT_SHARING") && (
          <PercentageClosureModal
            open={billingModalOpen}
            complaintNumber={appointment.complaintNumber}
            billingType={appointment.allocatedDealerId.billingType}
            percentage={Number(
              appointment.allocatedDealerId.billingPercentage || 0,
            )}
            loading={billingLoading}
            onClose={() => setBillingModalOpen(false)}
            onSubmit={handlePercentageBillingSubmit}
          />
        )} */}

      {billingModalOpen &&
        (billingType === "PARTIAL_PAYMENT" ||
          billingType === "PROFIT_SHARING") && (
          <PercentageClosureModal
            open={billingModalOpen}
            billingType={billingType}
            // percentage={billingPercentage}
            complaintNumber={appointment.complaintNumber}
            loading={billingLoading}
            onClose={() => setBillingModalOpen(false)}
            onSubmit={handleBillingSubmit}
          />
        )}

      <ComplaintActivityModal
        open={activityOpen}
        loading={activityLoading}
        activities={activities}
        complaintNumber={appointment?.complaintNumber}
        onClose={() => {
          setActivityOpen(false);
        }}
      />
    </div>
  );
}

/* =========================
   REUSABLE INFO COMPONENT
========================= */

function Info({
  icon: Icon,
  label,
  value,
  phone = false,
}: {
  icon?: React.ElementType;
  label: string;
  value: string;
  phone?: boolean;
}) {
  return (
    <div className="flex min-w-0 gap-3">
      {Icon && <Icon size={17} className="mt-1 shrink-0 text-gray-400" />}

      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>

        {phone && value !== "-" ? (
          <a
            href={`tel:${value}`}
            className="mt-1 block break-words text-sm font-semibold text-blue-600 hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="mt-1 break-words text-sm font-medium text-gray-900">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function ReasonModal({
  title,
  description,
  reasons,
  selectedReason,
  loading,
  actionLoading,
  actionLabel,
  type,
  onReasonChange,
  onClose,
  onSubmit,
}: {
  title: string;
  description: string;
  reasons: ReasonOption[];
  selectedReason: string;
  loading: boolean;
  actionLoading: boolean;
  actionLabel: string;
  type: "pending" | "cancel";
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}

        <div className="flex items-start justify-between border-b border-gray-100 p-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {reasons?.reasonName}
            </h2>

            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500"
          >
            ×
          </button>
        </div>

        {/* Reasons */}

        <div className="max-h-[400px] overflow-y-auto p-5">
          {loading ? (
            <div className="py-8 text-center text-sm text-gray-500">
              Loading reasons...
            </div>
          ) : reasons.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              No reasons available.
            </div>
          ) : (
            <div className="space-y-2">
              {reasons.map((reason) => {
                const selected = selectedReason === reason.id;

                return (
                  <label
                    key={reason.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                      selected
                        ? type === "cancel"
                          ? "border-red-400 bg-red-50"
                          : "border-yellow-400 bg-yellow-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`${type}-reason`}
                      value={reason.id}
                      checked={selected}
                      onChange={() => {
                        onReasonChange(reason.id);
                      }}
                      className="mt-1"
                    />

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {reason.reasonName}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}

        <div className="flex gap-3 border-t border-gray-100 p-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600"
          >
            Close
          </button>

          <button
            type="button"
            disabled={!selectedReason || actionLoading || loading}
            onClick={onSubmit}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
              type === "cancel"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {actionLoading ? "Saving..." : actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
