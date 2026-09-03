import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { getStates } from "../../stateMaster/services/stateApi";
import { getDistrictsByState } from "../../districtMaster/services/districtApi";

import type { StateMaster } from "../../stateMaster/types/state.types";
import type { DistrictMaster } from "../../districtMaster/types/district.types";

import type { CityFormData, CityMaster } from "../types/city.types";

interface Props {
  city?: CityMaster | null;

  loading?: boolean;

  onSubmit: (data: CityFormData) => Promise<void>;

  onCancel: () => void;
}

export default function CityForm({
  city,
  loading = false,
  onSubmit,
  onCancel,
}: Props) {
  const [states, setStates] = useState<StateMaster[]>([]);

  const [districts, setDistricts] = useState<DistrictMaster[]>([]);

  const [stateLoading, setStateLoading] = useState(false);

  const [districtLoading, setDistrictLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CityFormData>({
    defaultValues: {
      city_id: 0,
      city_name: "",
      state_id: 0,
      district_id: 0,
    },
  });

  const selectedStateId = watch("state_id");

  /* ==========================================
     FETCH STATES
  ========================================== */

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setStateLoading(true);

        const response = await getStates({
          page: 1,
          limit: 100,
        });

        setStates(response.data ?? []);
      } catch (error) {
        console.error("Failed to fetch states:", error);
      } finally {
        setStateLoading(false);
      }
    };

    fetchStates();
  }, []);

  /* ==========================================
     EDIT FORM INITIALIZATION
  ========================================== */

  useEffect(() => {
    const initializeEditForm = async () => {
      /*
       * ADD MODE
       */
      if (!city) {
        reset({
          city_id: 0,
          city_name: "",
          state_id: 0,
          district_id: 0,
        });

        setDistricts([]);

        return;
      }

      /*
       * EDIT MODE
       */

      const stateId = Number(city.state_id);

      const districtId = Number(city.district_id);

      // First set city + state
      reset({
        city_id: Number(city.city_id),

        city_name: city.city_name ?? "",

        state_id: stateId,

        district_id: 0,
      });

      if (!stateId) {
        return;
      }

      try {
        setDistrictLoading(true);

        // Fetch districts of selected state
        const districtData = await getDistrictsByState(stateId);

        setDistricts(districtData ?? []);

        // After options are available,
        // select edit district
        setValue("district_id", districtId, {
          shouldValidate: false,
          shouldDirty: false,
        });
      } catch (error) {
        console.error("Failed to fetch districts:", error);

        setDistricts([]);
      } finally {
        setDistrictLoading(false);
      }
    };

    initializeEditForm();
  }, [city, reset, setValue]);

  /* ==========================================
     STATE CHANGE
  ========================================== */

  const handleStateChange = async (stateId: number) => {
    setValue("state_id", stateId, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Reset district whenever state changes
    setValue("district_id", 0, {
      shouldValidate: false,
      shouldDirty: true,
    });

    setDistricts([]);

    if (!stateId) {
      return;
    }

    try {
      setDistrictLoading(true);

      const districtData = await getDistrictsByState(stateId);

      setDistricts(districtData ?? []);
    } catch (error) {
      console.error("Failed to fetch districts:", error);

      setDistricts([]);
    } finally {
      setDistrictLoading(false);
    }
  };

  /* ==========================================
     SUBMIT
  ========================================== */

  const submitForm = async (data: CityFormData) => {
    const payload: CityFormData = {
      city_id: Number(data.city_id),

      city_name: data.city_name.trim(),

      state_id: Number(data.state_id),

      district_id: Number(data.district_id),
    };

    console.log("CITY PAYLOAD:", payload);

    await onSubmit(payload);
  };

  /* ==========================================
     CANCEL
  ========================================== */

  const handleCancel = () => {
    reset({
      city_id: 0,
      city_name: "",
      state_id: 0,
      district_id: 0,
    });

    setDistricts([]);

    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
      {/* CITY ID */}

      <div>
        <label className={labelClass}>
          City ID
          <span className="ml-1 text-red-500">*</span>
        </label>

        <input
          type="number"
          placeholder="Enter city ID"
          {...register("city_id", {
            required: "City ID is required",

            valueAsNumber: true,

            min: {
              value: 1,

              message: "City ID must be greater than 0",
            },
          })}
          className={inputClass}
        />

        {errors.city_id && <ErrorText>{errors.city_id.message}</ErrorText>}
      </div>

      {/* CITY NAME */}

      <div>
        <label className={labelClass}>
          City Name
          <span className="ml-1 text-red-500">*</span>
        </label>

        <input
          type="text"
          placeholder="Enter city name"
          {...register("city_name", {
            required: "City name is required",

            minLength: {
              value: 2,

              message: "City name must contain at least 2 characters",
            },
          })}
          className={inputClass}
        />

        {errors.city_name && <ErrorText>{errors.city_name.message}</ErrorText>}
      </div>

      {/* STATE */}

      <div>
        <label className={labelClass}>
          State
          <span className="ml-1 text-red-500">*</span>
        </label>

        <Controller
          name="state_id"
          control={control}
          rules={{
            validate: (value) => Number(value) > 0 || "Please select a state",
          }}
          render={({ field }) => (
            <select
              value={field.value ?? 0}
              disabled={stateLoading}
              onChange={(event) => {
                const value = Number(event.target.value);

                field.onChange(value);

                handleStateChange(value);
              }}
              className={inputClass}
            >
              <option value={0}>
                {stateLoading ? "Loading states..." : "Select State"}
              </option>

              {states.map((state) => (
                <option key={state._id} value={Number(state.state_id)}>
                  {state.state_name}
                </option>
              ))}
            </select>
          )}
        />

        {errors.state_id && <ErrorText>{errors.state_id.message}</ErrorText>}

        {/* For debugging */}
        {city && (
          <p className="mt-1 text-xs text-gray-400">
            Selected State ID: {selectedStateId}
          </p>
        )}
      </div>

      {/* DISTRICT */}

      <div>
        <label className={labelClass}>
          District
          <span className="ml-1 text-red-500">*</span>
        </label>

        <Controller
          name="district_id"
          control={control}
          rules={{
            validate: (value) =>
              Number(value) > 0 || "Please select a district",
          }}
          render={({ field }) => (
            <select
              value={field.value ?? 0}
              onChange={(event) => field.onChange(Number(event.target.value))}
              disabled={!Number(selectedStateId) || districtLoading}
              className={inputClass}
            >
              <option value={0}>
                {!Number(selectedStateId)
                  ? "Select state first"
                  : districtLoading
                    ? "Loading districts..."
                    : "Select District"}
              </option>

              {districts.map((district) => (
                <option key={district._id} value={Number(district.district_id)}>
                  {district.district_name}
                </option>
              ))}
            </select>
          )}
        />

        {errors.district_id && (
          <ErrorText>{errors.district_id.message}</ErrorText>
        )}
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
          disabled={loading || stateLoading || districtLoading}
          className="rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? city
              ? "Updating..."
              : "Saving..."
            : city
              ? "Update City"
              : "Add City"}
        </button>
      </div>
    </form>
  );
}

/* ==========================================
   COMMON
========================================== */

function ErrorText({ children }: { children?: React.ReactNode }) {
  return <p className="mt-1 text-xs text-red-500">{children}</p>;
}

const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100";
