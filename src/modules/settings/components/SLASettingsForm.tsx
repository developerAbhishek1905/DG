import {
  useForm,
} from "react-hook-form";

import type {
  SLASettings,
} from "../types/settings.types";

interface Props {
  settings: SLASettings;

  saving?: boolean;

  onSubmit: (
    data: SLASettings
  ) => Promise<void> | void;
}

export default function SLASettingsForm({
  settings,
  saving,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
  } =
    useForm<SLASettings>({
      defaultValues:
        settings,
    });

  return (
    <form
      onSubmit={
        handleSubmit(
          onSubmit
        )
      }
      className="space-y-6"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <NumberInput
          label="Dealer Allocation SLA"
          suffix="hours"
          {...register(
            "allocationSlaHours",
            {
              valueAsNumber:
                true,
            }
          )}
        />

        <NumberInput
          label="Appointment SLA"
          suffix="hours"
          {...register(
            "appointmentSlaHours",
            {
              valueAsNumber:
                true,
            }
          )}
        />

        <NumberInput
          label="Service Completion SLA"
          suffix="hours"
          {...register(
            "serviceSlaHours",
            {
              valueAsNumber:
                true,
            }
          )}
        />

        <NumberInput
          label="Verification SLA"
          suffix="hours"
          {...register(
            "verificationSlaHours",
            {
              valueAsNumber:
                true,
            }
          )}
        />

        <NumberInput
          label="Warning Before SLA"
          suffix="hours"
          {...register(
            "warningBeforeHours",
            {
              valueAsNumber:
                true,
            }
          )}
        />

        <NumberInput
          label="Escalation Delay"
          suffix="hours"
          {...register(
            "escalationAfterHours",
            {
              valueAsNumber:
                true,
            }
          )}
        />
      </div>

      <Toggle
        label="Enable SLA Escalation"
        description="Escalate complaints when SLA limits are exceeded."
        {...register(
          "enableEscalation"
        )}
      />

      <div className="flex justify-end border-t pt-5">
        <button
          disabled={saving}
          className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save SLA Settings"}
        </button>
      </div>
    </form>
  );
}

interface NumberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  suffix?: string;
}

function NumberInput({
  label,
  suffix,
  ...props
}: NumberInputProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          type="number"
          min={0}
          {...props}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-16 text-sm"
        />

        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  description?: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
      <input
        type="checkbox"
        className="mt-1"
        {...props}
      />

      <div>
        <p className="text-sm font-medium text-gray-800">
          {label}
        </p>

        {description && (
          <p className="mt-1 text-xs text-gray-500">
            {
              description
            }
          </p>
        )}
      </div>
    </label>
  );
}