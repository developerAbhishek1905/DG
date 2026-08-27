import {
  CalendarDays,
  Plus,
} from "lucide-react";

import {
  useMemo,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import AppointmentFilters from "../components/AppointmentFilters";
import AppointmentTable from "../components/AppointmentTable";
import RescheduleModal from "../components/RescheduleModal";

import {
  useAppointments,
} from "../hooks/useAppointments";

import {
  closeRescheduleModal,
  openRescheduleModal,
} from "../store/appointmentSlice";

import {
  rescheduleAppointment,
} from "../services/appointmentApi";

import type {
  RescheduleAppointmentPayload,
} from "../types/appointment.types";

export default function AppointmentListPage() {
  const navigate =
    useNavigate();

  const dispatch =
    useAppDispatch();

  const {
    appointments,
    loading,
    refetch,
  } =
    useAppointments();

  const {
    search,
    status,
    type,
    date,
    selectedAppointmentId,
    rescheduleModalOpen,
  } = useAppSelector(
    (state) =>
      state.appointments
  );

  const filteredAppointments =
    useMemo(
      () =>
        appointments.filter(
          (appointment) => {
            const query =
              search
                .trim()
                .toLowerCase();

            const matchesSearch =
              !query ||
              appointment.complaintNumber
                .toLowerCase()
                .includes(
                  query
                ) ||
              appointment.customer.name
                .toLowerCase()
                .includes(
                  query
                ) ||
              appointment.dealer.name
                .toLowerCase()
                .includes(
                  query
                );

            const matchesStatus =
              status ===
                "ALL" ||
              appointment.status ===
                status;

            const matchesType =
              type === "ALL" ||
              appointment.type ===
                type;

            const matchesDate =
              !date ||
              appointment.appointmentDate ===
                date;

            return (
              matchesSearch &&
              matchesStatus &&
              matchesType &&
              matchesDate
            );
          }
        ),
      [
        appointments,
        search,
        status,
        type,
        date,
      ]
    );

  const selectedAppointment =
    appointments.find(
      (appointment) =>
        appointment.id ===
        selectedAppointmentId
    );

  const handleReschedule =
    async (
      payload: RescheduleAppointmentPayload
    ) => {
      await rescheduleAppointment(
        payload
      );

      dispatch(
        closeRescheduleModal()
      );

      await refetch();
    };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Appointments
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage customer
            appointments and
            service visits.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              navigate(
                "/appointments/calendar"
              )
            }
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700"
          >
            <CalendarDays
              size={17}
            />

            Calendar View
          </button>

          <button
            className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white"
          >
            <Plus size={17} />

            New Appointment
          </button>
        </div>
      </div>

      <AppointmentFilters />

      {loading ? (
        <div className="rounded-xl border bg-white p-12 text-center text-sm text-gray-500">
          Loading appointments...
        </div>
      ) : (
        <AppointmentTable
          appointments={
            filteredAppointments
          }
          onReschedule={(
            appointmentId
          ) =>
            dispatch(
              openRescheduleModal(
                appointmentId
              )
            )
          }
        />
      )}

      <RescheduleModal
        open={
          rescheduleModalOpen
        }
        appointment={
          selectedAppointment
        }
        onClose={() =>
          dispatch(
            closeRescheduleModal()
          )
        }
        onSubmit={
          handleReschedule
        }
      />
    </div>
  );
}