import {
  useForm,
} from "react-hook-form";

import type {
  BillingSettings,
} from "../types/settings.types";

interface Props {
  settings: BillingSettings;

  saving?: boolean;

  onSubmit: (
    data: BillingSettings
  ) => Promise<void> | void;
}

export default function BillingRulesForm({
  settings,
  saving,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
  } =
    useForm<BillingSettings>({
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
      className="space-y-5"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Toggle
          label="Auto Generate Bill"
          {...register(
            "autoGenerateBill"
          )}
        />

        <Toggle
          label="Generate After Verification"
          {...register(
            "billAfterVerification"
          )}
        />

        <Toggle
          label="Allow Manual Bill"
          {...register(
            "allowManualBill"
          )}
        />

        <Toggle
          label="Round Off Amount"
          {...register(
            "roundOffEnabled"
          )}
        />

        <Toggle
          label="Require Bill Approval"
          {...register(
            "requireBillApproval"
          )}
        />

        <Toggle
          label="Allow Bill Rejection"
          {...register(
            "allowBillRejection"
          )}
        />

        <Toggle
          label="Auto Post Approved Bill to Ledger"
          {...register(
            "autoPostLedger"
          )}
        />
      </div>

      <div className="max-w-sm">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Default Tax Percentage
        </label>

        <input
          type="number"
          min={0}
          max={100}
          step="0.01"
          {...register(
            "defaultTaxPercentage",
            {
              valueAsNumber:
                true,
            }
          )}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
        />
      </div>

      <div className="flex justify-end border-t pt-5">
        <button
          disabled={saving}
          className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : "Save Billing Settings"}
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