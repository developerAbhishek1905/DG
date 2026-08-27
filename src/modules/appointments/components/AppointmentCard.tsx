import {
  CalendarDays,
  Clock3,
  MapPin,
  UserRound,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import Card from "../../../components/ui/Card";

import AppointmentStatusBadge from "./AppointmentStatusBadge";

import type {
  Appointment,
} from "../types/appointment.types";

interface Props {
  appointment: Appointment;
}

export default function AppointmentCard({
  appointment,
}: Props) {
  const navigate =
    useNavigate();

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#123B7A]">
            {
              appointment.complaintNumber
            }
          </p>

          <h3 className="mt-1 font-semibold text-gray-900">
            {
              appointment.customer
                .name
            }
          </h3>
        </div>

        <AppointmentStatusBadge
          status={
            appointment.status
          }
        />
      </div>

      <div className="mt-5 space-y-3">
        <Info
          icon={CalendarDays}
          value={
            appointment.appointmentDate
          }
        />

        <Info
          icon={Clock3}
          value={
            appointment.appointmentTime
          }
        />

        <Info
          icon={UserRound}
          value={
            appointment.dealer
              .name
          }
        />

        <Info
          icon={MapPin}
          value={
            appointment.customer
              .city
          }
        />
      </div>

      <button
        onClick={() =>
          navigate(
            `/appointments/${appointment.id}`
          )
        }
        className="mt-5 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        View Appointment
      </button>
    </Card>
  );
}

function Info({
  icon: Icon,
  value,
}: {
  icon: React.ElementType;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-600">
      <Icon
        size={16}
        className="text-gray-400"
      />

      {value}
    </div>
  );
}