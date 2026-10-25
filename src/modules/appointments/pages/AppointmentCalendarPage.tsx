import { getPanelBase } from "../../../utils/panelPath";
import { ArrowLeft } from "lucide-react";

import { useNavigate } from "react-router-dom";

import AppointmentCalendar from "../components/AppointmentCalendar";

export default function AppointmentCalendarPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(`${getPanelBase()}/appointments`)}
        className="inline-flex items-center gap-2 text-sm text-gray-500"
      >
        <ArrowLeft size={17} />
        Back to Appointments
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Appointment Calendar
        </h1>

        <p className="mt-1 text-sm text-gray-500">View appointments by date.</p>
      </div>

      <AppointmentCalendar
        onAppointmentClick={(appointment) => {
          navigate(`${getPanelBase()}/appointments/${appointment._id}`);
        }}
      />
    </div>
  );
}
