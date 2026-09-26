// import { Loader2 } from "lucide-react";
// import { useEffect, useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { getStates } from "../../stateMaster/services/stateApi";
// import { getDistrictsByState } from "../../districtMaster/services/districtApi";
// import type { StateMaster } from "../../stateMaster/types/state.types";
// import type { DistrictMaster } from "../../districtMaster/types/district.types";
// import type { CityMaster } from "../../cityMaster/types/city.types";
// import type { PincodeMaster } from "../../pincodeMaster/types/pincode.types";
// import type { Area, AreaFormData } from "../types/area.types";
// import { getCitiesByStateAndDistrict } from "../../cityMaster/services/cityApi";
// import { getPincodesByCity } from "../../pincodeMaster/services/pincodeApi";

// interface Props {
//   area?: Area | null;
//   loading?: boolean;
//   onSubmit: (data: AreaFormData) => void | Promise<void>;
//   onCancel: () => void;
// }

// export default function AreaForm({ area, loading, onSubmit, onCancel }: Props) {
//   const [states, setStates] = useState<StateMaster[]>([]);
//   const [districts, setDistricts] = useState<DistrictMaster[]>([]);
//   const [cities, setCities] = useState<CityMaster[]>([]);
//   const [pincodes, setPincodes] = useState<PincodeMaster[]>([]);
//   const [stateLoading, setStateLoading] = useState(false);
//   const [districtLoading, setDistrictLoading] = useState(false);
//   const [cityLoading, setCityLoading] = useState(false);
//   const [pincodeLoading, setPincodeLoading] = useState(false);

//   const {
//     register,
//     control,
//     handleSubmit,
//     reset,
//     setValue,
//     watch,

//     formState: { errors },
//   } = useForm<AreaFormData>({
//     defaultValues: {
//       areaCode: "",
//       areaName: "",
//       state_id: 0,
//       district_id: 0,
//       city_id: 0,
//       pincode_id: 0,
//       zone: "",
//       latitude: undefined,
//       longitude: undefined,
//       status: "ACTIVE",
//     },
//   });

//   const selectedStateId = watch("state_id");
//   const selectedDistrictId = watch("district_id");
//   const selectedCityId = watch("city_id");

//   /* =====================================
//      LOAD STATES
//   ===================================== */

//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         setStateLoading(true);

//         const response = await getStates({
//           page: 1,
//           limit: 100,
//         });

//         setStates(response.data ?? []);
//       } catch (error) {
//         console.error("Failed to fetch states", error);
//       } finally {
//         setStateLoading(false);
//       }
//     };

//     fetchStates();
//   }, []);

//   /* =====================================
//      INITIALIZE ADD / EDIT
//   ===================================== */

//   useEffect(() => {
//     const initialize = async () => {
//       if (!area) {
//         reset({
//           areaCode: "",
//           areaName: "",
//           state_id: 0,
//           district_id: 0,
//           city_id: 0,
//           pincode_id: 0,
//           zone: "",
//           latitude: undefined,
//           longitude: undefined,
//           status: "ACTIVE",
//         });

//         setDistricts([]);
//         setCities([]);
//         setPincodes([]);

//         return;
//       }

//       const stateId = Number(area.state_id);
//       const districtId = Number(area.district_id);
//       const cityId = Number(area.city_id);
//       const pincodeId = Number(area.pincode_id);

//       reset({
//         areaCode: area.areaCode,
//         areaName: area.areaName,
//         state_id: stateId,
//         district_id: 0,
//         city_id: 0,
//         pincode_id: 0,
//         zone: area.zone ?? "",
//         latitude: area.latitude,
//         longitude: area.longitude,
//         status: area.status,
//       });

//       try {
//         // 1. DISTRICTS
//         setDistrictLoading(true);
//         const districtData = await getDistrictsByState(stateId);
//         setDistricts(districtData ?? []);
//         setValue("district_id", districtId, {
//           shouldValidate: false,
//           shouldDirty: false,
//         });

//         // 2. CITIES
//         setCityLoading(true);
//         const cityData = await getCitiesByStateAndDistrict(stateId, districtId);
//         setCities(cityData ?? []);
//         setValue("city_id", cityId, {
//           shouldValidate: false,
//           shouldDirty: false,
//         });

//         // 3. PINCODES
//         setPincodeLoading(true);
//         const pincodeData = await getPincodesByCity(cityId);
//         setPincodes(pincodeData ?? []);
//         setValue("pincode_id", pincodeId, {
//           shouldValidate: false,
//           shouldDirty: false,
//         });
//       } catch (error) {
//         console.error("Failed to initialize area form", error);
//       } finally {
//         setDistrictLoading(false);
//         setCityLoading(false);
//         setPincodeLoading(false);
//       }
//     };
//     initialize();
//   }, [area, reset, setValue]);

//   /* =====================================
//      STATE CHANGE
//   ===================================== */

//   const handleStateChange = async (stateId: number) => {
//     setValue("state_id", stateId);
//     setValue("district_id", 0);
//     setValue("city_id", 0);
//     setValue("pincode_id", 0);
//     setDistricts([]);
//     setCities([]);
//     setPincodes([]);

//     if (!stateId) return;

//     try {
//       setDistrictLoading(true);
//       const response = await getDistrictsByState(stateId);
//       setDistricts(response ?? []);
//     } catch (error) {
//       console.error("Failed to fetch districts", error);
//     } finally {
//       setDistrictLoading(false);
//     }
//   };

//   /* =====================================
//      DISTRICT CHANGE
//   ===================================== */

//   const handleDistrictChange = async (districtId: number) => {
//     setValue("district_id", districtId);
//     setValue("city_id", 0);
//     setValue("pincode_id", 0);
//     setCities([]);
//     setPincodes([]);
//     const stateId = Number(selectedStateId);

//     if (!stateId || !districtId) {
//       return;
//     }

//     try {
//       setCityLoading(true);
//       const response = await getCitiesByStateAndDistrict(stateId, districtId);
//       setCities(response ?? []);
//     } catch (error) {
//       console.error("Failed to fetch cities", error);
//       setCities([]);
//     } finally {
//       setCityLoading(false);
//     }
//   };
//   /* =====================================
//      CITY CHANGE
//   ===================================== */

//   const handleCityChange = async (cityId: number) => {
//     setValue("city_id", cityId);
//     setValue("pincode_id", 0);
//     setPincodes([]);

//     if (!cityId) {
//       return;
//     }

//     try {
//       setPincodeLoading(true);
//       const response = await getPincodesByCity(cityId);
//       setPincodes(response ?? []);
//     } catch (error) {
//       console.error("Failed to fetch pincodes", error);
//       setPincodes([]);
//     } finally {
//       setPincodeLoading(false);
//     }
//   };

//   /* =====================================
//      SUBMIT
//   ===================================== */

//   const submitForm = (data: AreaFormData) => {
//     const payload: AreaFormData = {
//       areaCode: data.areaCode.trim(),
//       areaName: data.areaName.trim(),
//       state_id: Number(data.state_id),
//       district_id: Number(data.district_id),
//       city_id: Number(data.city_id),
//       pincode_id: Number(data.pincode_id),
//       zone: data.zone?.trim() || undefined,
//       latitude: data.latitude,
//       longitude: data.longitude,
//       status: data.status,
//     };

//     onSubmit(payload);
//   };

//   return (
//     <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
//       <div className="rounded-xl border border-gray-200 bg-white">
//         <div className="border-b border-gray-200 px-5 py-4">
//           <h2 className="font-semibold text-gray-900">Area Information</h2>

//           <p className="mt-1 text-xs text-gray-500">
//             Configure the geographical area used for complaint and dealer
//             mapping.
//           </p>
//         </div>

//         <div className="grid gap-5 p-5 md:grid-cols-2 lg:grid-cols-3">
//           {/* AREA CODE */}

//           <Input
//             label="Area Code"
//             required
//             placeholder="IND-VIJ-001"
//             error={errors.areaCode?.message}
//             {...register("areaCode", {
//               required: "Area code is required",
//             })}
//           />

//           {/* AREA NAME */}

//           <Input
//             label="Area Name"
//             required
//             placeholder="Vijay Nagar"
//             error={errors.areaName?.message}
//             {...register("areaName", {
//               required: "Area name is required",
//             })}
//           />

//           {/* STATE */}

//           <DropdownField
//             label="State"
//             required
//             error={errors.state_id?.message}
//           >
//             <Controller
//               name="state_id"
//               control={control}
//               rules={{
//                 validate: (value) => Number(value) > 0 || "State is required",
//               }}
//               render={({ field }) => (
//                 <select
//                   value={field.value ?? 0}
//                   disabled={stateLoading}
//                   onChange={(e) => {
//                     const value = Number(e.target.value);
//                     field.onChange(value);
//                     handleStateChange(value);
//                   }}
//                   className={inputClass}
//                 >
//                   <option value={0}>
//                     {stateLoading ? "Loading states..." : "Select State"}
//                   </option>

//                   {states.map((state) => (
//                     <option key={state._id} value={state.state_id}>
//                       {state.state_name}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             />
//           </DropdownField>

//           {/* DISTRICT */}

//           <DropdownField
//             label="District"
//             required
//             error={errors.district_id?.message}
//           >
//             <Controller
//               name="district_id"
//               control={control}
//               rules={{
//                 validate: (value) =>
//                   Number(value) > 0 || "District is required",
//               }}
//               render={({ field }) => (
//                 <select
//                   value={field.value ?? 0}
//                   disabled={!Number(selectedStateId) || districtLoading}
//                   onChange={(e) => {
//                     const value = Number(e.target.value);
//                     field.onChange(value);
//                     handleDistrictChange(value);
//                   }}
//                   className={inputClass}
//                 >
//                   <option value={0}>
//                     {!Number(selectedStateId)
//                       ? "Select state first"
//                       : districtLoading
//                         ? "Loading districts..."
//                         : "Select District"}
//                   </option>

//                   {districts.map((district) => (
//                     <option key={district._id} value={district.district_id}>
//                       {district.district_name}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             />
//           </DropdownField>

//           {/* CITY */}

//           <DropdownField label="City" required error={errors.city_id?.message}>
//             <Controller
//               name="city_id"
//               control={control}
//               rules={{
//                 validate: (value) => Number(value) > 0 || "City is required",
//               }}
//               render={({ field }) => (
//                 <select
//                   value={field.value ?? 0}
//                   disabled={!Number(selectedDistrictId) || cityLoading}
//                   onChange={(e) => {
//                     const value = Number(e.target.value);
//                     field.onChange(value);
//                     handleCityChange(value);
//                   }}
//                   className={inputClass}
//                 >
//                   <option value={0}>
//                     {!Number(selectedDistrictId)
//                       ? "Select district first"
//                       : cityLoading
//                         ? "Loading cities..."
//                         : "Select City"}
//                   </option>

//                   {cities.map((city) => (
//                     <option key={city._id} value={city.city_id}>
//                       {city.city_name}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             />
//           </DropdownField>

//           {/* PINCODE */}

//           <DropdownField
//             label="Pincode"
//             required
//             error={errors.pincode_id?.message}
//           >
//             <Controller
//               name="pincode_id"
//               control={control}
//               rules={{
//                 validate: (value) => Number(value) > 0 || "Pincode is required",
//               }}
//               render={({ field }) => (
//                 <select
//                   value={field.value ?? 0}
//                   disabled={!Number(selectedCityId) || pincodeLoading}
//                   onChange={(e) => field.onChange(Number(e.target.value))}
//                   className={inputClass}
//                 >
//                   <option value={0}>
//                     {!Number(selectedCityId)
//                       ? "Select city first"
//                       : pincodeLoading
//                         ? "Loading pincodes..."
//                         : "Select Pincode"}
//                   </option>

//                   {pincodes.map((pincode) => (
//                     <option key={pincode._id} value={pincode.pincode_id}>
//                       {pincode.pincode_name}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             />
//           </DropdownField>

//           {/* ZONE */}

//           <Input
//             label="Zone"
//             placeholder="East / West / Central"
//             {...register("zone")}
//           />

//           {/* LATITUDE */}

//           <Input
//             label="Latitude"
//             type="number"
//             step="any"
//             placeholder="22.7533"
//             {...register("latitude", {
//               setValueAs: (value) => (value === "" ? undefined : Number(value)),
//             })}
//           />

//           {/* LONGITUDE */}

//           <Input
//             label="Longitude"
//             type="number"
//             step="any"
//             placeholder="75.8937"
//             {...register("longitude", {
//               setValueAs: (value) => (value === "" ? undefined : Number(value)),
//             })}
//           />

//           {/* STATUS */}

//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-gray-700">
//               Status
//             </label>

//             <select {...register("status")} className={inputClass}>
//               <option value="ACTIVE">Active</option>

//               <option value="INACTIVE">Inactive</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* BUTTONS */}

//       <div className="flex justify-end gap-3">
//         <button
//           type="button"
//           onClick={onCancel}
//           disabled={loading}
//           className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
//         >
//           Cancel
//         </button>

//         <button
//           type="submit"
//           disabled={
//             loading ||
//             stateLoading ||
//             districtLoading ||
//             cityLoading ||
//             pincodeLoading
//           }
//           className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:opacity-50"
//         >
//           {loading && <Loader2 size={17} className="animate-spin" />}

//           {loading ? "Saving..." : area ? "Update Area" : "Create Area"}
//         </button>
//       </div>
//     </form>
//   );
// }

// /* =====================================
//    INPUT
// ===================================== */

// interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   label: string;
//   error?: string;
//   required?: boolean;
// }

// function Input({ label, error, required, ...props }: InputProps) {
//   return (
//     <div>
//       <label className="mb-1.5 block text-sm font-medium text-gray-700">
//         {label}

//         {required && <span className="ml-1 text-red-500">*</span>}
//       </label>

//       <input {...props} className={inputClass} />

//       {error && <ErrorText>{error}</ErrorText>}
//     </div>
//   );
// }

// /* =====================================
//    DROPDOWN
// ===================================== */

// function DropdownField({
//   label,
//   error,
//   required,
//   children,
// }: {
//   label: string;
//   error?: string;
//   required?: boolean;
//   children: React.ReactNode;
// }) {
//   return (
//     <div>
//       <label className="mb-1.5 block text-sm font-medium text-gray-700">
//         {label}

//         {required && <span className="ml-1 text-red-500">*</span>}
//       </label>

//       {children}

//       {error && <ErrorText>{error}</ErrorText>}
//     </div>
//   );
// }

// function ErrorText({ children }: { children: React.ReactNode }) {
//   return <p className="mt-1 text-xs text-red-600">{children}</p>;
// }

// const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100";

import {
  Check,
  ChevronDown,
  Loader2,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";

import { getStates } from "../../stateMaster/services/stateApi";
import { getDistrictDropdown } from "../../districtMaster/services/districtApi";

import type { StateMaster } from "../../stateMaster/types/state.types";
import type { DistrictMaster } from "../../districtMaster/types/district.types";

import { registerLocation } from "../services/areaApi";

/* =========================================================
   TYPES
========================================================= */

interface LocationFormData {
  state_id?: number;
  state_name?: string;

  district_id?: number;
  district_name?: string;

  city_name?: string;
}

interface Props {
  onCancel?: () => void;
  onSuccess?: (data: any) => void;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function LocationForm({
  onCancel,
  onSuccess,
}: Props) {
  /* =====================================================
     STATE
  ===================================================== */

  const [states, setStates] =
    useState<StateMaster[]>([]);

  const [stateId, setStateId] =
    useState<number>(0);

  /*
   * This is both:
   *
   * 1. search text
   * 2. new state name
   */
  const [stateInput, setStateInput] =
    useState("");

  const [stateOpen, setStateOpen] =
    useState(false);

  /* =====================================================
     DISTRICT
  ===================================================== */

  const [districts, setDistricts] =
    useState<DistrictMaster[]>([]);

  const [districtId, setDistrictId] =
    useState<number>(0);

  /*
   * This is both:
   *
   * 1. district search
   * 2. new district name
   */
  const [districtInput, setDistrictInput] =
    useState("");

  const [districtOpen, setDistrictOpen] =
    useState(false);

  /* =====================================================
     CITY
  ===================================================== */

  const [cityName, setCityName] =
    useState("");

  /* =====================================================
     LOADING
  ===================================================== */

  const [stateLoading, setStateLoading] =
    useState(false);

  const [
    districtLoading,
    setDistrictLoading,
  ] = useState(false);

  const [saving, setSaving] =
    useState(false);

  /* =====================================================
     REFS
  ===================================================== */

  const stateRef =
    useRef<HTMLDivElement>(null);

  const districtRef =
    useRef<HTMLDivElement>(null);

  /* =====================================================
     LOAD STATES
  ===================================================== */

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setStateLoading(true);

        const response =
          await getStates({
            page: 1,
            limit: 100,
          });

        setStates(
          response.data ?? [],
        );
      } catch (error) {
        console.error(
          "Failed to fetch states:",
          error,
        );

        toast.error(
          "Failed to load states",
        );
      } finally {
        setStateLoading(false);
      }
    };

    fetchStates();
  }, []);

  /* =====================================================
     FILTER STATES LOCALLY
  ===================================================== */

  const filteredStates =
    states.filter((state) =>
      state.state_name
        .toLowerCase()
        .includes(
          stateInput
            .trim()
            .toLowerCase(),
        ),
    );

  /* =====================================================
     DISTRICT SEARCH API

     GET:
     /districts/dropdown
       ?state_id=23
       &search=ind
  ===================================================== */

  useEffect(() => {
    /*
     * District API can only search existing
     * districts when an existing state_id exists.
     */

    if (!stateId) {
      setDistricts([]);
      return;
    }

    const timer = setTimeout(
      async () => {
        try {
          setDistrictLoading(true);

          const response =
            await getDistrictDropdown({
              state_id: stateId,
              search:
                districtInput.trim(),
            });

          setDistricts(
            response ?? [],
          );
        } catch (error) {
          console.error(
            "Failed to search districts:",
            error,
          );

          setDistricts([]);
        } finally {
          setDistrictLoading(false);
        }
      },
      400,
    );

    return () =>
      clearTimeout(timer);
  }, [stateId, districtInput]);

  /* =====================================================
     CLICK OUTSIDE
  ===================================================== */

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as Node;

      if (
        stateRef.current &&
        !stateRef.current.contains(
          target,
        )
      ) {
        setStateOpen(false);
      }

      if (
        districtRef.current &&
        !districtRef.current.contains(
          target,
        )
      ) {
        setDistrictOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  /* =====================================================
     STATE INPUT CHANGE
  ===================================================== */

  const handleStateInputChange = (
    value: string,
  ) => {
    setStateInput(value);

    /*
     * User is typing.
     *
     * Therefore previous selected state
     * should no longer be considered selected.
     */

    setStateId(0);

    /*
     * State changed, reset children.
     */

    setDistrictId(0);
    setDistrictInput("");
    setDistricts([]);

    setCityName("");

    setStateOpen(true);
  };

  /* =====================================================
     SELECT EXISTING STATE
  ===================================================== */

  const handleSelectState = (
    state: StateMaster,
  ) => {
    setStateId(state.state_id);

    setStateInput(
      state.state_name,
    );

    setStateOpen(false);

    /*
     * Reset District + City
     */

    setDistrictId(0);
    setDistrictInput("");
    setDistricts([]);

    setCityName("");
  };

  /* =====================================================
     DISTRICT INPUT CHANGE
  ===================================================== */

  const handleDistrictInputChange = (
    value: string,
  ) => {
    setDistrictInput(value);

    /*
     * User typed something, so previous
     * existing district selection is removed.
     */

    setDistrictId(0);

    setCityName("");

    setDistrictOpen(true);
  };

  /* =====================================================
     SELECT EXISTING DISTRICT
  ===================================================== */

  const handleSelectDistrict = (
    district: DistrictMaster,
  ) => {
    setDistrictId(
      district.district_id,
    );

    setDistrictInput(
      district.district_name,
    );

    setDistrictOpen(false);

    setCityName("");
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    /* ---------------------------------------------------
       STATE
    --------------------------------------------------- */

    if (!stateInput.trim()) {
      toast.error(
        "State is required",
      );

      return;
    }

    /* ---------------------------------------------------
       CITY REQUIRES DISTRICT
    --------------------------------------------------- */

    if (
      cityName.trim() &&
      !districtInput.trim()
    ) {
      toast.error(
        "Please enter or select district before city",
      );

      return;
    }

    /* ---------------------------------------------------
       BUILD PAYLOAD
    --------------------------------------------------- */

    const payload: LocationFormData =
      {};

    /*
     * If existing state selected,
     * send state_id.
     *
     * Otherwise send typed state_name.
     */

    if (stateId) {
      payload.state_id =
        stateId;
    } else {
      payload.state_name =
        stateInput.trim();
    }

    /*
     * DISTRICT
     */

    if (districtInput.trim()) {
      if (districtId) {
        payload.district_id =
          districtId;
      } else {
        payload.district_name =
          districtInput.trim();
      }
    }

    /*
     * CITY
     */

    if (cityName.trim()) {
      payload.city_name =
        cityName.trim();
    }

    console.log(
      "Location payload:",
      payload,
    );

    /* ---------------------------------------------------
       API
    --------------------------------------------------- */

    try {
      setSaving(true);

      const response =
        await registerLocation(
          payload,
        );

      toast.success(
        response.message ||
          "Location saved successfully",
      );

      /* -------------------------------------------------
         RESET
      ------------------------------------------------- */

      setStateId(0);
      setStateInput("");

      setDistrictId(0);
      setDistrictInput("");
      setDistricts([]);

      setCityName("");

      setStateOpen(false);
      setDistrictOpen(false);

      onSuccess?.(
        response.data,
      );
    } catch (error: any) {
      console.error(
        "Register location error:",
        error,
      );

      toast.error(
        error?.response?.data
          ?.message ||
          error?.message ||
          "Failed to save location",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="rounded-xl border border-gray-200 bg-white">
        {/* HEADER */}

        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Location Information
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Select an existing State or
            District, or type a new one.
          </p>
        </div>

        {/* =================================================
            FIELDS
        ================================================= */}

        <div className="grid items-start gap-5 p-5 md:grid-cols-3">
          {/* =================================================
              STATE COMBOBOX
          ================================================= */}

          <div
            ref={stateRef}
            className="relative"
          >
            <label className={labelClass}>
              State

              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <div className="relative">
              <input
                type="text"
                value={stateInput}
                disabled={stateLoading}
                placeholder={
                  stateLoading
                    ? "Loading states..."
                    : "Select or enter state"
                }
                onFocus={() =>
                  setStateOpen(true)
                }
                onChange={(e) =>
                  handleStateInputChange(
                    e.target.value,
                  )
                }
                className={`${inputClass} pr-10`}
              />

              <button
                type="button"
                disabled={stateLoading}
                onClick={() =>
                  setStateOpen(
                    (prev) => !prev,
                  )
                }
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-400"
              >
                {stateLoading ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <ChevronDown
                    size={17}
                  />
                )}
              </button>
            </div>

            {/* STATE DROPDOWN */}

            {stateOpen &&
              !stateLoading && (
                <div className={dropdownClass}>
                  {filteredStates.length >
                  0 ? (
                    filteredStates.map(
                      (state) => (
                        <button
                          type="button"
                          key={state._id}
                          onClick={() =>
                            handleSelectState(
                              state,
                            )
                          }
                          className={optionClass}
                        >
                          <span>
                            {
                              state.state_name
                            }
                          </span>

                          {stateId ===
                            state.state_id && (
                            <Check
                              size={
                                16
                              }
                              className="text-blue-600"
                            />
                          )}
                        </button>
                      ),
                    )
                  ) : stateInput.trim() ? (
                    <div className="px-3 py-3">
                      <p className="text-sm text-gray-700">
                        No state found
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        "
                        {
                          stateInput
                        }
                        " will be
                        created as a
                        new state.
                      </p>
                    </div>
                  ) : (
                    <div className="px-3 py-3 text-sm text-gray-500">
                      No states
                      available
                    </div>
                  )}
                </div>
              )}

            {/* NEW STATE MESSAGE */}

            {!stateId &&
              stateInput.trim() && (
                <p className="mt-1.5 text-xs text-gray-500">
                  New state will be
                  created:{" "}
                  <span className="font-medium text-gray-700">
                    {stateInput.trim()}
                  </span>
                </p>
              )}
          </div>

          {/* =================================================
              DISTRICT COMBOBOX
          ================================================= */}

          <div
            ref={districtRef}
            className="relative"
          >
            <label className={labelClass}>
              District
            </label>

            <div className="relative">
              <input
                type="text"
                value={districtInput}
                disabled={
                  !stateInput.trim()
                }
                placeholder={
                  !stateInput.trim()
                    ? "Enter state first"
                    : stateId
                      ? "Select or enter district"
                      : "Enter new district"
                }
                onFocus={() => {
                  if (stateId) {
                    setDistrictOpen(
                      true,
                    );
                  }
                }}
                onChange={(e) =>
                  handleDistrictInputChange(
                    e.target.value,
                  )
                }
                className={`${inputClass} ${
                  stateId
                    ? "pr-10"
                    : ""
                }`}
              />

              {/* Show dropdown only for existing state */}

              {stateId > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    setDistrictOpen(
                      (prev) =>
                        !prev,
                    )
                  }
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-400"
                >
                  {districtLoading ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <ChevronDown
                      size={17}
                    />
                  )}
                </button>
              )}
            </div>

            {/* DISTRICT DROPDOWN */}

            {districtOpen &&
              stateId > 0 && (
                <div className={dropdownClass}>
                  {districtLoading ? (
                    <div className="flex items-center gap-2 px-3 py-3 text-sm text-gray-500">
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />

                      Searching...
                    </div>
                  ) : districts.length >
                    0 ? (
                    districts.map(
                      (district) => (
                        <button
                          type="button"
                          key={
                            district._id
                          }
                          onClick={() =>
                            handleSelectDistrict(
                              district,
                            )
                          }
                          className={optionClass}
                        >
                          <span>
                            {
                              district.district_name
                            }
                          </span>

                          {districtId ===
                            district.district_id && (
                            <Check
                              size={
                                16
                              }
                              className="text-blue-600"
                            />
                          )}
                        </button>
                      ),
                    )
                  ) : districtInput.trim() ? (
                    <div className="px-3 py-3">
                      <p className="text-sm text-gray-700">
                        No district
                        found
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        "
                        {
                          districtInput
                        }
                        " will be
                        created as a
                        new district.
                      </p>
                    </div>
                  ) : (
                    <div className="px-3 py-3 text-sm text-gray-500">
                      No districts
                      found
                    </div>
                  )}
                </div>
              )}

            {/* NEW DISTRICT MESSAGE */}

            {!districtId &&
              districtInput.trim() && (
                <p className="mt-1.5 text-xs text-gray-500">
                  New district will
                  be created:{" "}
                  <span className="font-medium text-gray-700">
                    {districtInput.trim()}
                  </span>
                </p>
              )}
          </div>

          {/* =================================================
              CITY
          ================================================= */}

          <div>
            <label className={labelClass}>
              City
            </label>

            <input
              type="text"
              value={cityName}
              disabled={
                !districtInput.trim()
              }
              placeholder={
                districtInput.trim()
                  ? "Enter city name"
                  : "Enter district first"
              }
              onChange={(e) =>
                setCityName(
                  e.target.value,
                )
              }
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={
            saving ||
            stateLoading
          }
          className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0B2854] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving && (
            <Loader2
              size={17}
              className="animate-spin"
            />
          )}

          {saving
            ? "Saving..."
            : "Save Location"}
        </button>
      </div>
    </form>
  );
}

/* =========================================================
   STYLES
========================================================= */

const labelClass =
  "mb-1.5 block text-sm font-medium text-gray-700";

const inputClass =
  "h-[42px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100";

const dropdownClass =
  "absolute left-0 right-0 top-[70px] z-50 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg";

const optionClass =
  "flex w-full items-center justify-between px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50";