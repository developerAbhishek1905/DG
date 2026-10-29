import { getPanelBase } from "../../../utils/panelPath";
import TableSkeleton from "../../../components/ui/TableSkeleton";
import { CalendarDays, Plus } from "lucide-react";

import { useEffect, useState, useCallback } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import NotificationDropdown from "../../notifications/components/NotificationDropdown";
import AppointmentFilters from "../components/AppointmentFilters";
import AppointmentTable from "../components/AppointmentTable";
import Pagination from "../../../components/ui/Pagination";
import { useDebounce } from "../../../hooks/useDebounce";

import {
  getAppointments,
  updateAppointmentStatus,
} from "../services/appointmentApi";

import type {
  Appointment,
  AppointmentStatus,
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
  | Pagination (server side)
  |--------------------------------------------------------------------------
  */

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

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
        page,
        limit,
        search: debouncedSearch.trim() || undefined,
        status: status === "ALL" ? undefined : status,
        complaintType: type === "ALL" ? undefined : type,
        fromDate: date || undefined,
        toDate: date || undefined,
      });

      setAppointments(response.data || []);
      setTotal(response.pagination?.total ?? 0);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error: any) {
      console.error("Fetch appointments error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to load appointments",
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, status, type, date]);

  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

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
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <NotificationDropdown />

          <button
            onClick={() => navigate(`${getPanelBase()}/appointments/calendar`)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700"
          >
            <CalendarDays size={17} />
            Calendar View
          </button>

          {/* <button
            onClick={() => navigate(`${getPanelBase()}/appointments/create`)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#6D28D9] px-4 py-2.5 text-sm font-medium text-white"
          >
            <Plus size={17} />
            New Appointment
          </button> */}
        </div>
      </div>

      {/* Filters */}

      <AppointmentFilters
        search={search}
        status={status}
        type={type}
        date={date}
        total={total}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onTypeChange={(value) => {
          setType(value);
          setPage(1);
        }}
        onDateChange={(value) => {
          setDate(value);
          setPage(1);
        }}
        onReset={() => {
          setSearch("");
          setStatus("ALL");
          setType("ALL");
          setDate("");
          setPage(1);
        }}
      />

      {/* Table */}

      {loading ? (
        <TableSkeleton />
      ) : (
        <AppointmentTable
          appointments={appointments}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Pagination */}

      {!loading && total > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(value) => {
              setLimit(value);
              setPage(1);
            }}
          />
        </div>
      )}

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
