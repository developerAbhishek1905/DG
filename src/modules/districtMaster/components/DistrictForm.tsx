// import { useEffect, useState } from "react";

// import { useForm } from "react-hook-form";

// import { getStates } from "../../stateMaster/services/stateApi";

// import type { StateMaster } from "../../stateMaster/types/state.types";

// import type { DistrictFormData, DistrictMaster } from "../types/district.types";

// interface Props {
//   district?: DistrictMaster | null;

//   loading?: boolean;

//   onSubmit: (data: DistrictFormData) => Promise<void>;

//   onCancel: () => void;
// }

// export default function DistrictForm({
//   district,
//   loading = false,
//   onSubmit,
//   onCancel,
// }: Props) {
//   const [states, setStates] = useState<StateMaster[]>([]);

//   const [stateLoading, setStateLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     reset,

//     formState: { errors },
//   } = useForm<DistrictFormData>({
//     defaultValues: {
//       district_id: 0,

//       district_name: "",

//       state_id: 0,
//     },
//   });

//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         setStateLoading(true);

//         const response = await getStates({
//           page: 1,

//           limit: 100,
//         });

//         setStates(response.data ?? []);
//       } finally {
//         setStateLoading(false);
//       }
//     };

//     fetchStates();
//   }, []);

//   useEffect(() => {
//     if (district) {
//       reset({
//         district_id: district.district_id,

//         district_name: district.district_name,

//         state_id: district.state_id,
//       });
//     } else {
//       reset({
//         district_id: 0,

//         district_name: "",

//         state_id: 0,
//       });
//     }
//   }, [district, reset]);

//   const submitForm = async (data: DistrictFormData) => {
//     await onSubmit({
//       district_id: Number(data.district_id),

//       district_name: data.district_name.trim(),

//       state_id: Number(data.state_id),
//     });
//   };

//   const handleCancel = () => {
//     reset({
//       district_id: 0,

//       district_name: "",

//       state_id: 0,
//     });

//     onCancel();
//   };

//   return (
//     <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
//       <div>
//         <label className="mb-1.5 block text-sm font-medium text-gray-700">
//           District ID
//         </label>

//         <input
//           type="number"
//           {...register("district_id", {
//             required: "District ID is required",

//             valueAsNumber: true,

//             min: {
//               value: 1,

//               message: "District ID must be greater than 0",
//             },
//           })}
//           placeholder="Enter district ID"
//           className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//         />

//         {errors.district_id && (
//           <p className="mt-1 text-xs text-red-500">
//             {errors.district_id.message}
//           </p>
//         )}
//       </div>

//       <div>
//         <label className="mb-1.5 block text-sm font-medium text-gray-700">
//           District Name
//         </label>

//         <input
//           type="text"
//           {...register("district_name", {
//             required: "District name is required",
//           })}
//           placeholder="Enter district name"
//           className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//         />

//         {errors.district_name && (
//           <p className="mt-1 text-xs text-red-500">
//             {errors.district_name.message}
//           </p>
//         )}
//       </div>

//       <div>
//         <label className="mb-1.5 block text-sm font-medium text-gray-700">
//           State
//         </label>

//         <select
//           {...register("state_id", {
//             required: "State is required",

//             valueAsNumber: true,

//             validate: (value) => value > 0 || "Please select a state",
//           })}
//           disabled={stateLoading}
//           className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//         >
//           <option value={0}>
//             {stateLoading ? "Loading states..." : "Select state"}
//           </option>

//           {states.map((state) => (
//             <option key={state._id} value={state.state_id}>
//               {state.state_name}
//             </option>
//           ))}
//         </select>

//         {errors.state_id && (
//           <p className="mt-1 text-xs text-red-500">{errors.state_id.message}</p>
//         )}
//       </div>

//       <div className="flex justify-end gap-2 border-t border-gray-200 pt-4">
//         <button
//           type="button"
//           disabled={loading}
//           onClick={handleCancel}
//           className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//         >
//           Cancel
//         </button>

//         <button
//           type="submit"
//           disabled={loading}
//           className="rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:opacity-50"
//         >
//           {loading
//             ? district
//               ? "Updating..."
//               : "Saving..."
//             : district
//               ? "Update District"
//               : "Add District"}
//         </button>
//       </div>
//     </form>
//   );
// }

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { getStates } from "../../stateMaster/services/stateApi";

import type { StateMaster } from "../../stateMaster/types/state.types";

import type { DistrictFormData, DistrictMaster } from "../types/district.types";

interface Props {
  district?: DistrictMaster | null;

  loading?: boolean;

  onSubmit: (data: DistrictFormData) => Promise<void>;

  onCancel: () => void;
}

export default function DistrictForm({
  district,
  loading = false,
  onSubmit,
  onCancel,
}: Props) {
  const [states, setStates] = useState<StateMaster[]>([]);

  const [stateLoading, setStateLoading] = useState(false);

  const defaultFormValues: DistrictFormData = {
    district_id: Number(district?.district_id),
    district_name: "",
    state_id: 0,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DistrictFormData>({
    defaultValues: defaultFormValues,
  });

  /* ==============================
     FETCH STATES
  ============================== */

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

  /* ==============================
     SET EDIT DATA
  ============================== */

  useEffect(() => {
    // Wait until states load
    if (stateLoading) {
      return;
    }

    if (district) {
      reset({
        district_id: Number(district.district_id ),
        district_name: district.district_name ?? "",
        state_id: Number(district.state_id ?? 0),
      });
      return;
    }

    reset(defaultFormValues);
  }, [district, states, stateLoading, reset]);

  /* ==============================
     SUBMIT
  ============================== */

  const submitForm = async (data: DistrictFormData) => {
    await onSubmit({
      district_id: Number(data.district_id),

      district_name: data.district_name.trim(),

      state_id: Number(data.state_id),
    });
  };

  /* ==============================
     CANCEL
  ============================== */

  const handleCancel = () => {
    reset(defaultFormValues);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
      {/* District ID */}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          District ID
          {/* <span className="ml-1 text-red-500">*</span> */}
        </label>

        <input
          type="number"
          placeholder="Enter district ID"
          {...register("district_id", {
            //   required:
            //     "District ID is required",

            valueAsNumber: true,

            //   min: {
            //     value: 1,
            //     message:
            //       "District ID must be greater than 0",
            //   },
          })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {errors.district_id && (
          <p className="mt-1 text-xs text-red-500">
            {errors.district_id.message}
          </p>
        )}
      </div>

      {/* District Name */}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          District Name
          <span className="ml-1 text-red-500">*</span>
        </label>

        <input
          type="text"
          placeholder="Enter district name"
          {...register("district_name", {
            required: "District name is required",

            minLength: {
              value: 2,
              message: "District name must contain at least 2 characters",
            },
          })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {errors.district_name && (
          <p className="mt-1 text-xs text-red-500">
            {errors.district_name.message}
          </p>
        )}
      </div>

      {/* State */}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          State
          <span className="ml-1 text-red-500">*</span>
        </label>

        <select
          {...register("state_id", {
            required: "State is required",

            valueAsNumber: true,

            validate: (value) => Number(value) > 0 || "Please select a state",
          })}
          disabled={stateLoading}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
        >
          <option value={0}>
            {stateLoading ? "Loading states..." : "Select state"}
          </option>

          {states.map((state) => (
            <option key={state._id} value={state.state_id}>
              {state.state_name}
            </option>
          ))}
        </select>

        {errors.state_id && (
          <p className="mt-1 text-xs text-red-500">{errors.state_id.message}</p>
        )}
      </div>

      {/* Buttons */}

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
          disabled={loading || stateLoading}
          className="rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? district
              ? "Updating..."
              : "Saving..."
            : district
              ? "Update District"
              : "Add District"}
        </button>
      </div>
    </form>
  );
}
