import {
  useEffect,
} from "react";

import {
  useForm,
} from "react-hook-form";

import type {
  Dealer,
  DealerFormData,
} from "../types/dealer.types";

interface Props {
  dealer?: Dealer;

  onSubmit: (
    data: DealerFormData
  ) => Promise<void> | void;

  submitLabel?: string;
}

export default function DealerForm({
  dealer,
  onSubmit,
  submitLabel = "Save",
}: Props) {
  const {
    register,
    handleSubmit,
    reset,

    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<DealerFormData>({
    defaultValues: {
      headCode:
        dealer?.headCode ?? "",

      groupHead:
        dealer?.groupHead ?? "",

      headName:
        dealer?.headName ?? "",

      grade:
        dealer?.grade ?? "",

      address:
        dealer?.address ?? "",

      city:
        dealer?.city ?? "",

      district:
        dealer?.district ?? "",

      state:
        dealer?.state ?? "",

      stateCode:
        dealer?.stateCode ?? "",

      pinCode:
        dealer?.pinCode ?? "",

      zone:
        dealer?.zone ?? "",

      contactPerson:
        dealer?.contactPerson ?? "",

      phoneNumbers:
        dealer?.phoneNumbers ?? "",

      mobileNumber:
        dealer?.mobileNumber ?? "",

      email:
        dealer?.email ?? "",

      taxApply:
        dealer?.taxApply ?? "",

      gstNumber:
        dealer?.gstNumber ?? "",

      tinNumber:
        dealer?.tinNumber ?? "",

      uinNumber:
        dealer?.uinNumber ?? "",

      panNumber:
        dealer?.panNumber ?? "",

      gstApplicable:
        dealer?.gstApplicable ?? "",

      gstRate:
        dealer?.gstRate ?? 0,

      hsnCode:
        dealer?.hsnCode ?? "",

      reverseChargeLimit:
        dealer?.reverseChargeLimit ?? 0,

      taxInputPayable:
        dealer?.taxInputPayable ?? "",

      vat15Column:
        dealer?.vat15Column ?? "",

      segment:
        dealer?.segment ?? "",

      creditDays:
        dealer?.creditDays ?? 0,

      creditLimit:
        dealer?.creditLimit ?? 0,

      accountType:
        dealer?.accountType ??
        "STANDARD",

      isDealer:
        dealer?.isDealer ?? true,

      disableChallan:
        dealer?.disableChallan ?? false,

      ledgerSummaryOnly:
        dealer?.ledgerSummaryOnly ?? false,

      accountDeactivated:
        dealer?.accountDeactivated ?? false,

      otherInfo:
        dealer?.otherInfo ?? "",

      rating:
        dealer?.rating ?? 0,

      openingBalance:
        dealer?.openingBalance ?? 0,

      openingBalanceType:
        dealer?.openingBalanceType ??
        "DR",
    },
  });

  useEffect(() => {
    if (!dealer) {
      return;
    }

    reset({
      headCode:
        dealer.headCode,

      groupHead:
        dealer.groupHead,

      headName:
        dealer.headName,

      grade:
        dealer.grade ?? "",

      address:
        dealer.address ?? "",

      city:
        dealer.city ?? "",

      district:
        dealer.district ?? "",

      state:
        dealer.state ?? "",

      stateCode:
        dealer.stateCode ?? "",

      pinCode:
        dealer.pinCode ?? "",

      zone:
        dealer.zone ?? "",

      contactPerson:
        dealer.contactPerson ?? "",

      phoneNumbers:
        dealer.phoneNumbers ?? "",

      mobileNumber:
        dealer.mobileNumber ?? "",

      email:
        dealer.email ?? "",

      taxApply:
        dealer.taxApply ?? "",

      gstNumber:
        dealer.gstNumber ?? "",

      tinNumber:
        dealer.tinNumber ?? "",

      uinNumber:
        dealer.uinNumber ?? "",

      panNumber:
        dealer.panNumber ?? "",

      gstApplicable:
        dealer.gstApplicable ?? "",

      gstRate:
        dealer.gstRate ?? 0,

      hsnCode:
        dealer.hsnCode ?? "",

      reverseChargeLimit:
        dealer.reverseChargeLimit ?? 0,

      taxInputPayable:
        dealer.taxInputPayable ?? "",

      vat15Column:
        dealer.vat15Column ?? "",

      segment:
        dealer.segment ?? "",

      creditDays:
        dealer.creditDays ?? 0,

      creditLimit:
        dealer.creditLimit ?? 0,

      accountType:
        dealer.accountType,

      isDealer:
        dealer.isDealer,

      disableChallan:
        dealer.disableChallan,

      ledgerSummaryOnly:
        dealer.ledgerSummaryOnly,

      accountDeactivated:
        dealer.accountDeactivated,

      otherInfo:
        dealer.otherInfo ?? "",

      rating:
        dealer.rating ?? 0,

      openingBalance:
        dealer.openingBalance ?? 0,

      openingBalanceType:
        dealer.openingBalanceType,
    });
  }, [
    dealer,
    reset,
  ]);

  const submitForm = async (
    data: DealerFormData
  ) => {
    await onSubmit({
      ...data,

      gstRate:
        Number(
          data.gstRate || 0
        ),

      reverseChargeLimit:
        Number(
          data.reverseChargeLimit || 0
        ),

      creditDays:
        Number(
          data.creditDays || 0
        ),

      creditLimit:
        Number(
          data.creditLimit || 0
        ),

      rating:
        Number(
          data.rating || 0
        ),

      openingBalance:
        Number(
          data.openingBalance || 0
        ),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(
        submitForm
      )}
      className="space-y-7"
    >
      <Section title="Basic Information">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Head Code"
            error={
              errors.headCode?.message
            }
            {...register(
              "headCode",
              {
                required:
                  "Head code is required",
              }
            )}
          />

          <div>
            <label className={labelClass}>
              Group Head
            </label>

            <select
              {...register(
                "groupHead",
                {
                  required:
                    "Group head is required",
                }
              )}
              className={inputClass}
            >
              <option value="">
                Select Group Head
              </option>

              <option value="SUNDRY_DEBTORS">
                Sundry Debtors
              </option>

              <option value="SUNDRY_CREDITORS">
                Sundry Creditors
              </option>

              <option value="SALES">
                Sales
              </option>

              <option value="PURCHASE">
                Purchase
              </option>

              <option value="EXPENSE">
                Expense
              </option>
            </select>

            {errors.groupHead && (
              <ErrorText>
                {
                  errors.groupHead
                    .message
                }
              </ErrorText>
            )}
          </div>

          <Input
            label="Head Name"
            error={
              errors.headName?.message
            }
            {...register(
              "headName",
              {
                required:
                  "Head name is required",
              }
            )}
          />

          <Input
            label="Grade"
            {...register("grade")}
          />

          <Input
            label="Segment"
            {...register("segment")}
          />
        </div>
      </Section>

      <Section title="Address Information">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2 lg:col-span-3">
            <label className={labelClass}>
              Address
            </label>

            <textarea
              rows={3}
              {...register("address")}
              className={textareaClass}
            />
          </div>

          <Input
            label="City"
            {...register("city")}
          />

          <Input
            label="District"
            {...register("district")}
          />

          <Input
            label="State"
            {...register("state")}
          />

          <Input
            label="State Code"
            {...register("stateCode")}
          />

          <Input
            label="PIN Code"
            maxLength={6}
            inputMode="numeric"
            {...register(
              "pinCode",
              {
                pattern: {
                  value:
                    /^$|^[0-9]{6}$/,
                  message:
                    "Enter valid 6 digit PIN code",
                },
              }
            )}
            error={
              errors.pinCode?.message
            }
          />

          <Input
            label="Zone"
            {...register("zone")}
          />
        </div>
      </Section>

      <Section title="Contact Information">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Contact Person"
            {...register(
              "contactPerson"
            )}
          />

          <Input
            label="Phone Nos."
            {...register(
              "phoneNumbers"
            )}
          />

          <Input
            label="Mobile No."
            maxLength={10}
            inputMode="numeric"
            {...register(
              "mobileNumber"
            )}
          />

          <Input
            label="Email"
            type="email"
            {...register("email")}
          />
        </div>
      </Section>

      <Section title="Tax Information">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClass}>
              Tax Apply
            </label>

            <select
              {...register(
                "taxApply"
              )}
              className={inputClass}
            >
              <option value="">
                Select
              </option>

              <option value="WITHIN_STATE">
                Within State
              </option>

              <option value="OUTSIDE_STATE">
                Outside State
              </option>
            </select>
          </div>

          <Input
            label="GST No."
            {...register(
              "gstNumber"
            )}
          />

          <Input
            label="TIN No."
            {...register(
              "tinNumber"
            )}
          />

          <Input
            label="UIN No."
            {...register(
              "uinNumber"
            )}
          />

          <Input
            label="PAN No."
            {...register(
              "panNumber"
            )}
          />

          <div>
            <label className={labelClass}>
              GST Applicable
            </label>

            <select
              {...register(
                "gstApplicable"
              )}
              className={inputClass}
            >
              <option value="">
                Select
              </option>

              <option value="YES">
                Yes
              </option>

              <option value="NO">
                No
              </option>
            </select>
          </div>

          <Input
            label="GST Rate"
            type="number"
            min={0}
            step="0.01"
            {...register(
              "gstRate",
              {
                valueAsNumber:
                  true,
              }
            )}
          />

          <Input
            label="HSN Code"
            {...register(
              "hsnCode"
            )}
          />

          <Input
            label="Limit of Reverse Charges"
            type="number"
            min={0}
            {...register(
              "reverseChargeLimit",
              {
                valueAsNumber:
                  true,
              }
            )}
          />

          <div>
            <label className={labelClass}>
              Tax Input / Payable
            </label>

            <select
              {...register(
                "taxInputPayable"
              )}
              className={inputClass}
            >
              <option value="">
                Select
              </option>

              <option value="INPUT">
                Input
              </option>

              <option value="PAYABLE">
                Payable
              </option>
            </select>
          </div>

          <Input
            label="Column Form VAT-15"
            {...register(
              "vat15Column"
            )}
          />
        </div>
      </Section>

      <Section title="Credit Information">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Credit Days"
            type="number"
            min={0}
            {...register(
              "creditDays",
              {
                valueAsNumber:
                  true,
              }
            )}
          />

          <Input
            label="Credit Limit"
            type="number"
            min={0}
            {...register(
              "creditLimit",
              {
                valueAsNumber:
                  true,
              }
            )}
          />
        </div>
      </Section>

      <Section title="Account Configuration">
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Account Type
          </label>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <Radio
              label="Standard"
              value="STANDARD"
              {...register(
                "accountType"
              )}
            />

            <Radio
              label="As Other Expenses in Invoice"
              value="OTHER_EXPENSE_IN_INVOICE"
              {...register(
                "accountType"
              )}
            />

            <Radio
              label="Bank"
              value="BANK"
              {...register(
                "accountType"
              )}
            />

            <Radio
              label="Tax Code"
              value="TAX_CODE"
              {...register(
                "accountType"
              )}
            />

            <Radio
              label="Sale / Purchase Account"
              value="SALE_PURCHASE_ACCOUNT"
              {...register(
                "accountType"
              )}
            />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Checkbox
              label="Dealer"
              {...register(
                "isDealer"
              )}
            />

            <Checkbox
              label="Disable Challan"
              {...register(
                "disableChallan"
              )}
            />

            <Checkbox
              label="Ledger Summary Only"
              {...register(
                "ledgerSummaryOnly"
              )}
            />

            <Checkbox
              label="Account Deactivated"
              {...register(
                "accountDeactivated"
              )}
            />
          </div>
        </div>
      </Section>

      <Section title="Opening Balance & Other Information">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Rating"
            type="number"
            min={0}
            {...register(
              "rating",
              {
                valueAsNumber:
                  true,
              }
            )}
          />

          <Input
            label="Opening Balance"
            type="number"
            step="0.01"
            {...register(
              "openingBalance",
              {
                valueAsNumber:
                  true,
              }
            )}
          />

          <div>
            <label className={labelClass}>
              Balance Type
            </label>

            <select
              {...register(
                "openingBalanceType"
              )}
              className={inputClass}
            >
              <option value="DR">
                Debit (Dr)
              </option>

              <option value="CR">
                Credit (Cr)
              </option>
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className={labelClass}>
              Other Info.
            </label>

            <textarea
              rows={3}
              {...register(
                "otherInfo"
              )}
              className={textareaClass}
            />
          </div>
        </div>
      </Section>

      <div className="flex justify-end border-t border-gray-100 pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-gray-100 pt-6 first:border-t-0 first:pt-0">
      <h3 className="text-base font-semibold text-gray-900">
        {title}
      </h3>

      <div className="mt-4">
        {children}
      </div>
    </section>
  );
}

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function Input({
  label,
  error,
  ...props
}: InputProps) {
  return (
    <div>
      <label className={labelClass}>
        {label}
      </label>

      <input
        {...props}
        className={inputClass}
      />

      {error && (
        <ErrorText>
          {error}
        </ErrorText>
      )}
    </div>
  );
}

interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Checkbox({
  label,
  ...props
}: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
      <input
        {...props}
        type="checkbox"
      />

      <span className="text-sm text-gray-700">
        {label}
      </span>
    </label>
  );
}

interface RadioProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Radio({
  label,
  ...props
}: RadioProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
      <input
        {...props}
        type="radio"
      />

      <span className="text-sm text-gray-700">
        {label}
      </span>
    </label>
  );
}

function ErrorText({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="mt-1 text-xs text-red-600">
      {children}
    </p>
  );
}

const labelClass =
  "mb-1 block text-sm font-medium text-gray-700";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const textareaClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";