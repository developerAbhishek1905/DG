import {
  ArrowLeft,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import AppointmentCalendar from "../components/AppointmentCalendar";

import {
  useAppointments,
} from "../hooks/useAppointments";

export default function AppointmentCalendarPage() {
  const navigate =
    useNavigate();

  const {
    appointments,
    loading,
  } =
    useAppointments();

  return (
    <div className="space-y-6">
      <button
        onClick={() =>
          navigate(
            "/appointments"
          )
        }
        className="inline-flex items-center gap-2 text-sm text-gray-500"
      >
        <ArrowLeft
          size={17}
        />

        Back to Appointments
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Appointment Calendar
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View appointments by
          date.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          Loading calendar...
        </div>
      ) : (
        <AppointmentCalendar
          appointments={
            appointments
          }
          onAppointmentClick={(
            appointment
          ) =>
            navigate(
              `/appointments/${appointment.id}`
            )
          }
        />
      )}
    </div>
  );
}