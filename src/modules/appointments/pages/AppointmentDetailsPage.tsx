import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Phone,
  RefreshCw,
  UserRound,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Card from "../../../components/ui/Card";

import AppointmentStatusBadge from "../components/AppointmentStatusBadge";
import RescheduleModal from "../components/RescheduleModal";

import {
  useAppointmentDetails,
} from "../hooks/useAppointments";

import {
  rescheduleAppointment,
  updateAppointmentStatus,
} from "../services/appointmentApi";

import type {
  RescheduleAppointmentPayload,
} from "../types/appointment.types";

export default function AppointmentDetailsPage() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const [
    rescheduleOpen,
    setRescheduleOpen,
  ] =
    useState(false);

  const {
    appointment,
    loading,
    setAppointment,
  } =
    useAppointmentDetails(
      id
    );

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Loading appointment...
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        Appointment not found.
      </div>
    );
  }

  const handleStatus =
    async (
      status:
        | "CONFIRMED"
        | "COMPLETED"
        | "CANCELLED"
        | "NO_SHOW"
    ) => {
      const updated =
        await updateAppointmentStatus(
          appointment.id,
          status
        );

      if (updated) {
        setAppointment({
          ...updated,
        });
      }
    };

  const handleReschedule =
    async (
      payload: RescheduleAppointmentPayload
    ) => {
      const updated =
        await rescheduleAppointment(
          payload
        );

      setAppointment({
        ...updated,
      });

      setRescheduleOpen(
        false
      );
    };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
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

        <div className="flex flex-wrap gap-2">
          {appointment.status !==
            "COMPLETED" &&
            appointment.status !==
              "CANCELLED" && (
              <button
                onClick={() =>
                  setRescheduleOpen(
                    true
                  )
                }
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm"
              >
                <RefreshCw
                  size={16}
                />

                Reschedule
              </button>
            )}

          {appointment.status ===
            "SCHEDULED" && (
            <button
              onClick={() =>
                handleStatus(
                  "CONFIRMED"
                )
              }
              className="rounded-lg bg-[#123B7A] px-4 py-2 text-sm text-white"
            >
              Confirm
            </button>
          )}

          {appointment.status !==
            "COMPLETED" &&
            appointment.status !==
              "CANCELLED" && (
              <button
                onClick={() =>
                  handleStatus(
                    "COMPLETED"
                  )
                }
                className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white"
              >
                Complete
              </button>
            )}
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div>
            <p className="text-xs font-medium text-[#123B7A]">
              {
                appointment.complaintNumber
              }
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              Appointment{" "}
              {appointment.id}
            </h1>
          </div>

          <AppointmentStatusBadge
            status={
              appointment.status
            }
          />
        </div>

        <div className="mt-6 grid gap-5 border-t border-gray-100 pt-6 sm:grid-cols-2 xl:grid-cols-4">
          <Info
            icon={CalendarDays}
            label="Date"
            value={
              appointment.appointmentDate
            }
          />

          <Info
            icon={Clock3}
            label="Time"
            value={
              appointment.appointmentTime
            }
          />

          <Info
            label="Type"
            value={
              appointment.type
            }
          />

          <Info
            label="Rescheduled"
            value={String(
              appointment.rescheduleCount
            )}
          />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900">
            Customer Information
          </h3>

          <div className="mt-5 space-y-4">
            <Info
              icon={UserRound}
              label="Customer"
              value={
                appointment.customer
                  .name
              }
            />

            <Info
              icon={Phone}
              label="Phone"
              value={
                appointment.customer
                  .phone
              }
            />

            <Info
              icon={MapPin}
              label="Address"
              value={`${appointment.customer.address}, ${appointment.customer.city}`}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900">
            Dealer Information
          </h3>

          <div className="mt-5 space-y-4">
            <Info
              icon={UserRound}
              label="Dealer"
              value={
                appointment.dealer
                  .name
              }
            />

            <Info
              label="Dealer Code"
              value={
                appointment.dealer
                  .dealerCode
              }
            />

            <Info
              icon={Phone}
              label="Phone"
              value={
                appointment.dealer
                  .phone
              }
            />
          </div>
        </Card>
      </div>

      {appointment.rescheduleReason && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900">
            Reschedule Information
          </h3>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <Info
              label="Original Date"
              value={
                appointment.originalAppointmentDate ??
                "-"
              }
            />

            <Info
              label="Original Time"
              value={
                appointment.originalAppointmentTime ??
                "-"
              }
            />

            <Info
              label="Reason"
              value={
                appointment.rescheduleReason
              }
            />
          </div>
        </Card>
      )}

      {appointment.notes && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900">
            Notes
          </h3>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            {
              appointment.notes
            }
          </p>
        </Card>
      )}

      <RescheduleModal
        open={
          rescheduleOpen
        }
        appointment={
          appointment
        }
        onClose={() =>
          setRescheduleOpen(
            false
          )
        }
        onSubmit={
          handleReschedule
        }
      />
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      {Icon && (
        <Icon
          size={17}
          className="mt-1 shrink-0 text-gray-400"
        />
      )}

      <div>
        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}