import { CalendarDays, Plus } from "lucide-react";

import { useEffect, useMemo, useState, useCallback } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import AppointmentFilters from "../components/AppointmentFilters";
import AppointmentTable from "../components/AppointmentTable";
import RescheduleModal from "../components/RescheduleModal";

import {
  getAppointments,
  rescheduleAppointment,
  updateAppointmentStatus
} from "../services/appointmentApi";

import type {
  Appointment,
  RescheduleAppointmentPayload,
} from "../types/appointment.types";
import StatusUpdateModal from "../components/StatusUpdateModal";

export default function AppointmentListPage() {
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Local State
  |--------------------------------------------------------------------------
  */

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [loading, setLoading] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Filters
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  const [type, setType] = useState("ALL");

  const [date, setDate] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Reschedule Modal
  |--------------------------------------------------------------------------
  */

  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);

  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);

  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const [selectedStatus, setSelectedStatus] =
    useState<AppointmentStatus | null>(null);

  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(
    null,
  );

  const [statusUpdating, setStatusUpdating] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Load Appointments
  |--------------------------------------------------------------------------
  */

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getAppointments({
        page: 1,
        limit: 100,
      });

      setAppointments(response.data || []);
    } catch (error: any) {
      console.error("Fetch appointments error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to load appointments",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  /*
  |--------------------------------------------------------------------------
  | Client Side Filtering
  |--------------------------------------------------------------------------
  */

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const query = search.trim().toLowerCase();

      const complaintNumber =
        appointment.complaintNumber?.toLowerCase()?.trim() || "";

      const customerName =
        appointment.customer?.name?.toLowerCase()?.trim() || "";

      const dealerName = appointment.dealer?.name?.toLowerCase()?.trim() || "";

      const matchesSearch =
        !query ||
        complaintNumber.includes(query) ||
        customerName.includes(query) ||
        dealerName.includes(query);

      const matchesStatus = status === "ALL" || appointment.status === status;

      const matchesType = type === "ALL" || appointment.type === type;

      const matchesDate = !date || appointment.appointmentDate === date;

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [appointments, search, status, type, date]);

  /*
  |--------------------------------------------------------------------------
  | Selected Appointment
  |--------------------------------------------------------------------------
  */

  const selectedAppointment = appointments.find(
    (appointment) => appointment.id === selectedAppointmentId,
  );

  /*
  |--------------------------------------------------------------------------
  | Open Reschedule
  |--------------------------------------------------------------------------
  */

  const handleOpenReschedule = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);

    setRescheduleModalOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Close Reschedule
  |--------------------------------------------------------------------------
  */

  const handleCloseReschedule = () => {
    setRescheduleModalOpen(false);

    setSelectedAppointmentId(null);
  };

  /*
  |--------------------------------------------------------------------------
  | Reschedule Appointment
  |--------------------------------------------------------------------------
  */

  const handleReschedule = async (payload: RescheduleAppointmentPayload) => {
    try {
      await rescheduleAppointment(payload);

      toast.success("Appointment rescheduled successfully");

      handleCloseReschedule();

      await fetchAppointments();
    } catch (error: any) {
      console.error("Reschedule appointment error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to reschedule appointment",
      );
    }
  };

  // const handleStatusChange = async (
  //   appointmentId: string,
  //   status: AppointmentStatus,
  // ) => {
  //   try {
  //     await updateAppointmentStatus(appointmentId, status);

  //     toast.success("Status updated successfully");

  //     await fetchAppointments();
  //   } catch (error: any) {
  //     toast.error(error?.response?.data?.message || "Failed to update status");
  //   }
  // };

  const handleStatusChange = async (
    complaintId: string,
    status: AppointmentStatus,
  ) => {
    /*
  |--------------------------------------------------------------------------
  | These statuses need additional information
  |--------------------------------------------------------------------------
  */

    if (
      status === "APPOINTMENT_SCHEDULED" ||
      status === "PENDING" ||
      status === "CANCELLED"
    ) {
      setSelectedComplaintId(complaintId);

      setSelectedStatus(status);

      setStatusModalOpen(true);

      return;
    }

    /*
  |--------------------------------------------------------------------------
  | CLOSED - Direct Update
  |--------------------------------------------------------------------------
  */

    try {
      setStatusUpdating(true);

      await updateAppointmentStatus(complaintId, {
        status,
      });

      toast.success("Status updated successfully");

      await fetchAppointments();
    } catch (error: any) {
      console.log(error)
      toast.error(error || "Failed to update status");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleStatusModalSubmit = async (data: {
    appointmentDate?: string;
    appointmentTime?: string;
    pendingReason?: string;
    cancellationReason?: string;
  }) => {
    if (!selectedComplaintId || !selectedStatus) {
      return;
    }

    try {
      setStatusUpdating(true);

      await updateAppointmentStatus(selectedComplaintId, {
        status: selectedStatus,
        ...data,
      });

      toast.success("Status updated successfully");

      setStatusModalOpen(false);

      setSelectedComplaintId(null);
      setSelectedStatus(null);

      await fetchAppointments();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage customer appointments and service visits.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/appointments/calendar")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700"
          >
            <CalendarDays size={17} />
            Calendar View
          </button>

          <button
            onClick={() => navigate("/appointments/create")}
            className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white"
          >
            <Plus size={17} />
            New Appointment
          </button>
        </div>
      </div>

      {/* Filters */}

      <AppointmentFilters
        search={search}
        status={status}
        type={type}
        date={date}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onTypeChange={setType}
        onDateChange={setDate}
        onReset={() => {
          setSearch("");
          setStatus("ALL");
          setType("ALL");
          setDate("");
        }}
      />

      {/* Table */}

      {loading ? (
        <div className="rounded-xl border bg-white p-12 text-center text-sm text-gray-500">
          Loading appointments...
        </div>
      ) : (
        <AppointmentTable
          appointments={filteredAppointments}
          onReschedule={handleOpenReschedule}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Reschedule Modal */}

      <RescheduleModal
        open={rescheduleModalOpen}
        appointment={selectedAppointment}
        onClose={handleCloseReschedule}
        onSubmit={handleReschedule}
      />

      <StatusUpdateModal
        open={statusModalOpen}
        status={selectedStatus}
        loading={statusUpdating}
        onClose={() => {
          setStatusModalOpen(false);
          setSelectedComplaintId(null);
          setSelectedStatus(null);
        }}
        onSubmit={handleStatusModalSubmit}
      />
    </div>
  );
}
