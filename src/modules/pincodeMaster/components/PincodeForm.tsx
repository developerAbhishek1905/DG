import { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";

import { getCities } from "../../cityMaster/services/cityApi";

import type { CityMaster } from "../../cityMaster/types/city.types";

import type { PincodeFormData, PincodeMaster } from "../types/pincode.types";

interface Props {
  pincode?: PincodeMaster | null;

  loading?: boolean;

  onSubmit: (data: PincodeFormData) => Promise<void>;

  onCancel: () => void;
}

export default function PincodeForm({
  pincode,
  loading = false,
  onSubmit,
  onCancel,
}: Props) {
  const [cities, setCities] = useState<CityMaster[]>([]);

  const [cityLoading, setCityLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<PincodeFormData>({
    defaultValues: {
      pincode_id: undefined,

      pincode_name: "",

      city_id: 0,
    },
  });

  /* ============================
     FETCH CITIES
  ============================ */

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setCityLoading(true);

        const response = await getCities({
          page: 1,
          limit: 500,
        });

        setCities(response.data ?? []);
      } catch (error) {
        console.error("Failed to fetch cities", error);
      } finally {
        setCityLoading(false);
      }
    };

    fetchCities();
  }, []);

  /* ============================
     EDIT DATA
  ============================ */

  useEffect(() => {
    if (pincode) {
      reset({
        pincode_id: pincode.pincode_id,

        pincode_name: pincode.pincode_name ?? "",

        city_id: Number(pincode.city_id),
      });
    } else {
      reset({
        pincode_id: undefined,

        pincode_name: "",

        city_id: 0,
      });
    }
  }, [pincode, reset]);

  /* ============================
     SUBMIT
  ============================ */

  const submitForm = async (data: PincodeFormData) => {
    const payload: PincodeFormData = {
      pincode_name: data.pincode_name.trim(),

      city_id: Number(data.city_id),
    };

    /*
     pincode_id optional hai.
     Value ho tabhi payload me bhejna.
    */

    if (
      data.pincode_id !== undefined &&
      data.pincode_id !== null &&
      !Number.isNaN(Number(data.pincode_id))
    ) {
      payload.pincode_id = Number(data.pincode_id);
    }

    await onSubmit(payload);
  };

  const handleCancel = () => {
    reset({
      pincode_id: undefined,

      pincode_name: "",

      city_id: 0,
    });

    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
      {/* PINCODE ID */}

      <div>
        <label className={labelClass}>
          Pincode ID
          <span className="ml-2 text-xs font-normal text-gray-400">
            Optional
          </span>
        </label>

        <input
          type="number"
          placeholder="Enter pincode ID (optional)"
          {...register("pincode_id", {
            setValueAs: (value) => (value === "" ? undefined : Number(value)),

            min: {
              value: 1,

              message: "Pincode ID must be greater than 0",
            },
          })}
          className={inputClass}
        />

        {errors.pincode_id && (
          <ErrorText>{errors.pincode_id.message}</ErrorText>
        )}
      </div>

      {/* PINCODE */}

      <div>
        <label className={labelClass}>
          Pincode
          <span className="ml-1 text-red-500">*</span>
        </label>

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="Example: 452001"
          {...register("pincode_name", {
            required: "Pincode is required",

            pattern: {
              value: /^[1-9][0-9]{5}$/,

              message: "Enter a valid 6 digit pincode",
            },
          })}
          className={inputClass}
        />

        {errors.pincode_name && (
          <ErrorText>{errors.pincode_name.message}</ErrorText>
        )}
      </div>

      {/* CITY */}

      <div>
        <label className={labelClass}>
          City
          <span className="ml-1 text-red-500">*</span>
        </label>

        <Controller
          name="city_id"
          control={control}
          rules={{
            validate: (value) => Number(value) > 0 || "Please select a city",
          }}
          render={({ field }) => (
            <select
              value={field.value ?? 0}
              onChange={(event) => field.onChange(Number(event.target.value))}
              disabled={cityLoading}
              className={inputClass}
            >
              <option value={0}>
                {cityLoading ? "Loading cities..." : "Select City"}
              </option>

              {cities.map((city) => (
                <option key={city._id} value={Number(city.city_id)}>
                  {city.city_name}
                </option>
              ))}
            </select>
          )}
        />

        {errors.city_id && <ErrorText>{errors.city_id.message}</ErrorText>}
      </div>

      {/* BUTTONS */}

      <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
        <button
          type="button"
          disabled={loading}
          onClick={handleCancel}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading || cityLoading}
          className="rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:opacity-50"
        >
          {loading
            ? pincode
              ? "Updating..."
              : "Saving..."
            : pincode
              ? "Update Pincode"
              : "Add Pincode"}
        </button>
      </div>
    </form>
  );
}

function ErrorText({ children }: { children?: React.ReactNode }) {
  return <p className="mt-1 text-xs text-red-500">{children}</p>;
}

const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100";
