import {
  useForm,
} from "react-hook-form";

import type {
  NotificationSettings,
} from "../types/settings.types";

interface Props {
  settings: NotificationSettings;

  saving?: boolean;

  onSubmit: (
    data: NotificationSettings
  ) => Promise<void> | void;
}

export default function NotificationRulesForm({
  settings,
  saving,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
  } =
    useForm<NotificationSettings>({
      defaultValues:
        settings,
    });

  const businessRules = [
    {
      key:
        "complaintCreated" as const,
      label:
        "Complaint Created",
    },

    {
      key:
        "dealerAllocated" as const,
      label:
        "Dealer Allocated",
    },

    {
      key:
        "appointmentScheduled" as const,
      label:
        "Appointment Scheduled",
    },

    {
      key:
        "slaWarning" as const,
      label:
        "SLA Warning",
    },

    {
      key:
        "slaBreached" as const,
      label:
        "SLA Breached",
    },

    {
      key:
        "cancellationRequested" as const,
      label:
        "Cancellation Requested",
    },

    {
      key:
        "closureSubmitted" as const,
      label:
        "Closure Submitted",
    },

    {
      key:
        "verificationCompleted" as const,
      label:
        "Verification Completed",
    },

    {
      key:
        "billGenerated" as const,
      label:
        "Bill Generated",
    },

    {
      key:
        "paymentRecorded" as const,
      label:
        "Payment Recorded",
    },

    {
      key:
        "reconciliationMismatch" as const,
      label:
        "Reconciliation Mismatch",
    },
  ];

  return (
    <form
      onSubmit={
        handleSubmit(
          onSubmit
        )
      }
      className="space-y-6"
    >
      <section>
        <h3 className="font-semibold text-gray-900">
          Event Notifications
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Choose which business events generate notifications.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {businessRules.map(
            (rule) => (
              <Toggle
                key={
                  rule.key
                }
                label={
                  rule.label
                }
                {...register(
                  rule.key
                )}
              />
            )
          )}
        </div>
      </section>

      <section className="border-t pt-6">
        <h3 className="font-semibold text-gray-900">
          Notification Channels
        </h3>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Toggle
            label="In-App"
            {...register(
              "inAppNotifications"
            )}
          />

          <Toggle
            label="Email"
            {...register(
              "emailNotifications"
            )}
          />

          <Toggle
            label="Push"
            {...register(
              "pushNotifications"
            )}
          />
        </div>
      </section>

      <div className="flex justify-end border-t pt-5">
        <button
          disabled={saving}
          className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Notification Settings"}
        </button>
      </div>
    </form>
  );
}

function Toggle({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
      <input
        type="checkbox"
        {...props}
      />

      <span className="text-sm font-medium text-gray-700">
        {label}
      </span>
    </label>
  );
}