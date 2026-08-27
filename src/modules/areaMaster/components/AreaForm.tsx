import {
  Loader2,
} from "lucide-react";

import {
  useEffect,
} from "react";

import {
  useForm,
} from "react-hook-form";

import {
  AREA_STATUS_OPTIONS,
  STATE_OPTIONS,
} from "../constants/area.constants";

import type {
  Area,
  AreaFormData,
} from "../types/area.types";

interface Props {
  area?: Area | null;

  loading?: boolean;

  onSubmit: (
    data: AreaFormData
  ) => void;

  onCancel: () => void;
}

export default function AreaForm({
  area,
  loading,
  onSubmit,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,

    formState: {
      errors,
    },
  } =
    useForm<AreaFormData>(
      {
        defaultValues: {
          areaCode: "",

          areaName: "",

          city: "",

          district: "",

          state:
            "Madhya Pradesh",

          pincode: "",

          zone: "",

          latitude:
            undefined,

          longitude:
            undefined,

          status:
            "ACTIVE",
        },
      }
    );

  useEffect(() => {
    if (area) {
      reset({
        areaCode:
          area.areaCode,

        areaName:
          area.areaName,

        city:
          area.city,

        district:
          area.district ||
          "",

        state:
          area.state,

        pincode:
          area.pincode ||
          "",

        zone:
          area.zone || "",

        latitude:
          area.latitude,

        longitude:
          area.longitude,

        status:
          area.status,
      });
    }
  }, [
    area,
    reset,
  ]);

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="space-y-6"
    >
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Area Information
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Configure the
            geographical area
            used for complaint
            and dealer mapping.
          </p>
        </div>

        <div className="grid gap-5 p-5 md:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Area Code"
            required
            placeholder="IND-VIJ-001"
            error={
              errors.areaCode
                ?.message
            }
            {...register(
              "areaCode",
              {
                required:
                  "Area code is required",
              }
            )}
          />

          <Input
            label="Area Name"
            required
            placeholder="Vijay Nagar"
            error={
              errors.areaName
                ?.message
            }
            {...register(
              "areaName",
              {
                required:
                  "Area name is required",
              }
            )}
          />

          <Input
            label="Pincode"
            placeholder="452010"
            maxLength={6}
            inputMode="numeric"
            error={
              errors.pincode
                ?.message
            }
            {...register(
              "pincode",
              {
                pattern: {
                  value:
                    /^$|^[0-9]{6}$/,
                  message:
                    "Enter valid 6 digit pincode",
                },
              }
            )}
          />

          <Input
            label="City"
            required
            placeholder="Indore"
            error={
              errors.city
                ?.message
            }
            {...register(
              "city",
              {
                required:
                  "City is required",
              }
            )}
          />

          <Input
            label="District"
            placeholder="Indore"
            {...register(
              "district"
            )}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              State
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <select
              {...register(
                "state",
                {
                  required:
                    "State is required",
                }
              )}
              className={
                inputClass
              }
            >
              <option value="">
                Select State
              </option>

              {STATE_OPTIONS.map(
                (
                  option
                ) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </option>
                )
              )}
            </select>

            {errors.state && (
              <ErrorText>
                {
                  errors.state
                    .message
                }
              </ErrorText>
            )}
          </div>

          <Input
            label="Zone"
            placeholder="East / West / Central"
            {...register(
              "zone"
            )}
          />

          <Input
            label="Latitude"
            type="number"
            step="any"
            placeholder="22.7533"
            {...register(
              "latitude",
              {
                setValueAs: (
                  value
                ) =>
                  value ===
                  ""
                    ? undefined
                    : Number(
                        value
                      ),
              }
            )}
          />

          <Input
            label="Longitude"
            type="number"
            step="any"
            placeholder="75.8937"
            {...register(
              "longitude",
              {
                setValueAs: (
                  value
                ) =>
                  value ===
                  ""
                    ? undefined
                    : Number(
                        value
                      ),
              }
            )}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              {...register(
                "status"
              )}
              className={
                inputClass
              }
            >
              {AREA_STATUS_OPTIONS.map(
                (
                  option
                ) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={
            onCancel
          }
          disabled={
            loading
          }
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            loading
          }
          className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:opacity-50"
        >
          {loading && (
            <Loader2
              size={17}
              className="animate-spin"
            />
          )}

          {loading
            ? "Saving..."
            : area
              ? "Update Area"
              : "Create Area"}
        </button>
      </div>
    </form>
  );
}

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;

  error?: string;

  required?: boolean;
}

function Input({
  label,
  error,
  required,
  ...props
}: InputProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        {...props}
        className={
          inputClass
        }
      />

      {error && (
        <ErrorText>
          {error}
        </ErrorText>
      )}
    </div>
  );
}

function ErrorText({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <p className="mt-1 text-xs text-red-600">
      {children}
    </p>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";