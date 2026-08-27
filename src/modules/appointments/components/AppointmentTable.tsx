import {
  CalendarClock,
  Eye,
  RefreshCw,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import AppointmentStatusBadge from "./AppointmentStatusBadge";

import type {
  Appointment,
} from "../types/appointment.types";

interface Props {
  appointments: Appointment[];

  onReschedule?: (
    appointmentId: string
  ) => void;
}

export default function AppointmentTable({
  appointments,
  onReschedule,
}: Props) {
  const navigate =
    useNavigate();

  if (!appointments.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
        No appointments found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {[
                "Complaint",
                "Customer",
                "Dealer",
                "Type",
                "Date",
                "Time",
                "Status",
                "Reschedules",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-5 py-3 text-xs font-semibold uppercase text-gray-500"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {appointments.map(
              (appointment) => (
                <tr
                  key={
                    appointment.id
                  }
                  className="hover:bg-gray-50"
                >
                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        navigate(
                          `/appointments/${appointment.id}`
                        )
                      }
                      className="font-medium text-[#123B7A] hover:underline"
                    >
                      {
                        appointment.complaintNumber
                      }
                    </button>

                    <p className="mt-1 text-xs text-gray-400">
                      {
                        appointment.id
                      }
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {
                        appointment.customer
                          .name
                      }
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {
                        appointment.customer
                          .phone
                      }
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-700">
                      {
                        appointment.dealer
                          .name
                      }
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {
                      appointment.type
                    }
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {
                      appointment.appointmentDate
                    }
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {
                      appointment.appointmentTime
                    }
                  </td>

                  <td className="px-5 py-4">
                    <AppointmentStatusBadge
                      status={
                        appointment.status
                      }
                    />
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {
                      appointment.rescheduleCount
                    }
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          navigate(
                            `/appointments/${appointment.id}`
                          )
                        }
                        title="View"
                        className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye
                          size={17}
                        />
                      </button>

                      {onReschedule &&
                        appointment.status !==
                          "COMPLETED" &&
                        appointment.status !==
                          "CANCELLED" && (
                          <button
                            onClick={() =>
                              onReschedule(
                                appointment.id
                              )
                            }
                            title="Reschedule"
                            className="rounded-lg p-2 text-gray-500 hover:bg-amber-50 hover:text-amber-600"
                          >
                            <RefreshCw
                              size={17}
                            />
                          </button>
                        )}

                      {/* <button
                        title="Calendar"
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                      >
                        <CalendarClock
                          size={17}
                        />
                      </button> */}
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}