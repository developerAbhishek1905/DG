import { useEffect, useState } from "react";

import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import SearchSelect from "../../../components/ui/SearchSelect";

import {
  searchCities,
  searchDistricts,
  // searchPincodes,
  searchStates,
  type CityOption,
  type DistrictOption,
  // type PincodeOption,
  type StateOption,
} from "../services/addressApi";

import type { DealerFormData } from "../types/dealer.types";
import { useDebounce } from "../../../hooks/useDebounce";

interface Props {
  type: "businessAddress" | "residentialAddress";
  title: string;
  register: UseFormRegister<DealerFormData>;
  setValue: UseFormSetValue<DealerFormData>;
  watch: UseFormWatch<DealerFormData>;
  errors: FieldErrors<DealerFormData>;
}

export default function AddressFields({
  type,
  title,
  register,
  setValue,
  watch,
  errors,
}: Props) {
  /* ===================================================== */
  /* OPTIONS */
  /* ===================================================== */

  const [states, setStates] = useState<StateOption[]>([]);
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  // const [pincodes, setPincodes] = useState<PincodeOption[]>([]);
  const [stateSearch, setStateSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  // const [pincodeSearch, setPincodeSearch] = useState("");

  const debouncedStateSearch = useDebounce(stateSearch, 500);
  const debouncedDistrictSearch = useDebounce(districtSearch, 500);
  const debouncedCitySearch = useDebounce(citySearch, 500);
  // const debouncedPincodeSearch = useDebounce(pincodeSearch, 500);

  /* ===================================================== */
  /* LOADING */
  /* ===================================================== */

  const [stateLoading, setStateLoading] = useState(false);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  // const [pincodeLoading, setPincodeLoading] = useState(false);

  /* ===================================================== */
  /* VALUES */
  /* ===================================================== */

  const stateId = watch(`${type}.stateId`);
  const districtId = watch(`${type}.districtId`);
  const cityId = watch(`${type}.cityId`);
  const stateName = watch(`${type}.state`);
  const districtName = watch(`${type}.district`);
  const cityName = watch(`${type}.city`);
  // const pinCode = watch(`${type}.pinCode`);
  const addressErrors = errors[type];

  /* ===================================================== */
  /* INITIAL LOAD */
  /* ===================================================== */

  useEffect(() => {
    loadStates(debouncedStateSearch);
  }, [debouncedStateSearch]);

  useEffect(() => {
    loadDistricts(debouncedDistrictSearch);
  }, [debouncedDistrictSearch, stateId]);

  useEffect(() => {
    loadCities(debouncedCitySearch);
  }, [debouncedCitySearch, stateId, districtId]);

  // useEffect(() => {
  //   loadPincodes(debouncedPincodeSearch);
  // }, [debouncedPincodeSearch, cityId]);

  // useEffect(() => {
  //   register(`${type}.pinCode`, {
  //     required: "PIN code is required",
  //   });
  // }, [register, type]);
  /* ===================================================== */
  /* STATE SEARCH */
  /* ===================================================== */

  const loadStates = async (search: string) => {
    try {
      setStateLoading(true);
      const data = await searchStates(search);
      setStates(data);
    } catch (error) {
      console.error("Failed to load states:", error);
      setStates([]);
    } finally {
      setStateLoading(false);
    }
  };

  /* ===================================================== */
  /* DISTRICT SEARCH */
  /* ===================================================== */

  const loadDistricts = async (search: string) => {
    try {
      setDistrictLoading(true);
      const data = await searchDistricts({
        stateId: stateId ? Number(stateId) : undefined,
        search,
      });

      setDistricts(data);
    } catch (error) {
      console.error("Failed to load districts:", error);
      setDistricts([]);
    } finally {
      setDistrictLoading(false);
    }
  };

  /* ===================================================== */
  /* CITY SEARCH */
  /* ===================================================== */

  const loadCities = async (search: string) => {
    try {
      setCityLoading(true);
      const data = await searchCities({
        stateId: stateId ? Number(stateId) : undefined,
        districtId: districtId ? Number(districtId) : undefined,
        search,
      });

      setCities(data);
    } catch (error) {
      console.error("Failed to load cities:", error);
      setCities([]);
    } finally {
      setCityLoading(false);
    }
  };

  /* ===================================================== */
  /* PINCODE SEARCH */
  /* ===================================================== */

  // const loadPincodes = async (search: string) => {
  //   try {
  //     setPincodeLoading(true);

  //     const data = await searchPincodes({
  //       cityId: cityId ? Number(cityId) : undefined,
  //       search,
  //     });

  //     setPincodes(data);
  //   } catch (error) {
  //     console.error("Failed to load pincodes:", error);
  //     setPincodes([]);
  //   } finally {
  //     setPincodeLoading(false);
  //   }
  // };

  /* ===================================================== */
  /* RESET HELPERS */
  /* ===================================================== */

  // const resetPincode = () => {
  //   setValue(`${type}.pincodeId`, undefined);
  //   setValue(`${type}.pinCode`, "");
  //   setPincodeSearch("");
  // };

  const resetCity = () => {
    setValue(`${type}.cityId`, undefined);
    setValue(`${type}.city`, "");
    setCitySearch("");
    // resetPincode();
  };

  const resetDistrict = () => {
    setValue(`${type}.districtId`, undefined);
    setValue(`${type}.district`, "");
    setDistrictSearch("");
    resetCity();
  };

  /* ===================================================== */
  /* STATE SELECT */
  /* ===================================================== */

  const handleStateSelect = (state: StateOption) => {
    setValue(`${type}.stateId`, state.state_id, {
      shouldValidate: true,
    });

    setValue(`${type}.state`, state.state_name, {
      shouldValidate: true,
    });

    setValue(`${type}.stateCode`, state.state_code ?? "");

    // Reset district
    setValue(`${type}.districtId`, undefined);
    setValue(`${type}.district`, "");

    // Reset city
    setValue(`${type}.cityId`, undefined);
    setValue(`${type}.city`, "");

    // Reset pincode
    setValue(`${type}.pincodeId`, undefined);
    setValue(`${type}.pinCode`, "");

    setDistrictSearch("");
    setCitySearch("");
    // setPincodeSearch("");
  };
  /* ===================================================== */
  /* DISTRICT SELECT */
  /* ===================================================== */

  const handleDistrictSelect = (district: DistrictOption) => {
    /* STATE */

    setValue(`${type}.stateId`, district.state_id, {
      shouldValidate: true,
    });

    setValue(`${type}.state`, district.state_name ?? "", {
      shouldValidate: true,
    });

    if (district.state_code) {
      setValue(`${type}.stateCode`, district.state_code);
    }

    /* DISTRICT */

    setValue(`${type}.districtId`, district.district_id, {
      shouldValidate: true,
    });

    setValue(`${type}.district`, district.district_name, {
      shouldValidate: true,
    });

    /* RESET CITY */

    setValue(`${type}.cityId`, undefined);
    setValue(`${type}.city`, "");

    /* RESET PINCODE */

    setValue(`${type}.pincodeId`, undefined);
    setValue(`${type}.pinCode`, "");

    setCitySearch("");
    // setPincodeSearch("");
  };
  /* ===================================================== */
  /* CITY SELECT */
  /* ===================================================== */

  const handleCitySelect = async (city: CityOption) => {
    /* ============================= */
    /* AUTO FILL STATE */
    /* ============================= */

    setValue(`${type}.stateId`, city.state_id, {
      shouldValidate: true,
    });

    setValue(`${type}.state`, city.state_name ?? "", {
      shouldValidate: true,
    });

    if (city.state_code) {
      setValue(`${type}.stateCode`, city.state_code);
    }

    /* ============================= */
    /* AUTO FILL DISTRICT */
    /* ============================= */

    setValue(`${type}.districtId`, city.district_id, {
      shouldValidate: true,
    });

    setValue(`${type}.district`, city.district_name ?? "", {
      shouldValidate: true,
    });

    /* ============================= */
    /* SET CITY */
    /* ============================= */

    setValue(`${type}.cityId`, city.city_id, {
      shouldValidate: true,
    });

    setValue(`${type}.city`, city.city_name, {
      shouldValidate: true,
    });

    /* ============================= */
    /* RESET PINCODE */
    /* ============================= */

    // setValue(`${type}.pincodeId`, undefined);
    // setValue(`${type}.pinCode`, "");

    /* ============================= */
    /* LOAD PINCODES OF CITY */
    /* ============================= */

    // try {
    //   setPincodeLoading(true);

    //   const data = await searchPincodes({
    //     cityId: city.city_id,
    //     search: "",
    //   });

    //   setPincodes(data);
    // } catch (error) {
    //   console.error("Failed to load pincodes:", error);
    //   setPincodes([]);
    // } finally {
    //   setPincodeLoading(false);
    // }
  };
  /* ===================================================== */
  /* PINCODE SELECT */
  /* ===================================================== */

  // const handlePincodeSelect = (pincode: PincodeOption) => {
  //   const selectedPinCode = pincode.pincode_name || pincode.pincode || "";

  //   console.log("SELECTED PINCODE:", pincode);
  //   console.log("PINCODE VALUE:", selectedPinCode);
  //   /*
  //    * Auto-fill State
  //    */

  //   console.log(pincode);

  //   if (pincode.state_id) {
  //     setValue(`${type}.stateId`, pincode.state_id, {
  //       shouldValidate: true,
  //     });
  //   }

  //   if (pincode.state_name) {
  //     setValue(`${type}.state`, pincode.state_name, {
  //       shouldValidate: true,
  //     });
  //   }

  //   if (pincode.state_code) {
  //     setValue(`${type}.stateCode`, pincode.state_code);
  //   }

  //   /*
  //    * Auto-fill District
  //    */

  //   if (pincode.district_id) {
  //     setValue(`${type}.districtId`, pincode.district_id, {
  //       shouldValidate: true,
  //     });
  //   }

  //   if (pincode.district_name) {
  //     setValue(`${type}.district`, pincode.district_name, {
  //       shouldValidate: true,
  //     });
  //   }

  //   /*
  //    * Auto-fill City
  //    */

  //   setValue(`${type}.cityId`, pincode.city_id, {
  //     shouldValidate: true,
  //   });

  //   if (pincode.city_name) {
  //     setValue(`${type}.city`, pincode.city_name, {
  //       shouldValidate: true,
  //     });
  //   }

  //   /*
  //    * Set Pincode
  //    */

  //   if (pincode.pincode_id) {
  //     setValue(`${type}.pincodeId`, pincode.pincode_id);
  //   }

  //   // setValue(`${type}.pinCode`, String(pincode.pincode_name), {
  //   //   shouldValidate: true,
  //   //   shouldDirty: true,
  //   // });

  //   setValue(`${type}.pinCode`, String(selectedPinCode), {
  //     shouldValidate: true,
  //     shouldDirty: true,
  //     shouldTouch: true,
  //   });
  // };

  /* ===================================================== */
  /* JSX */
  /* ===================================================== */

  return (
    <div className="h-full">
      {/* Hidden fields */}
      <input
        type="hidden"
        {...register(`${type}.stateId`, {
          // required: "State is required",
        })}
      />

      <input
        type="hidden"
        {...register(`${type}.districtId`, {
          // required: "District is required",
        })}
      />

      <input
        type="hidden"
        {...register(`${type}.cityId`, {
          // required: "City is required",
        })}
      />

      {/* <input
      type="hidden"
      {...register(`${type}.pinCode`, {
        required: "PIN code is required",
      })}
    /> */}

      {/* Address title */}
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-700">
        {title}
      </h4>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        {/* ================= ADDRESS LINE ================= */}

        <div className="col-span-2">
          <label className="mb-0.5 block text-[11px] font-medium text-gray-600">
            Address Line
            {/* {type === "businessAddress" && (
              <span className="ml-0.5 text-red-500">*</span>
            )} */}
          </label>

          <input
            type="text"
            placeholder="Enter address"
            {...register(`${type}.addressLine`, {
              required:
                type === "businessAddress"
                  ? "Business Address is required"
                  : false,
            })}
            className="h-8 w-full rounded-md border border-gray-300 bg-white px-2 text-xs outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
          />

          {addressErrors?.addressLine && (
            <p className="mt-0.5 text-[10px] text-red-600">
              {addressErrors.addressLine.message}
            </p>
          )}
        </div>

        {/* ================= CITY ================= */}

        <SearchSelect
          label="City"
          value={cityName}
          placeholder="Search city..."
          loading={cityLoading}
          options={cities.map((city) => ({
            value: city.city_id,
            label: [city.city_name, city.district_name, city.state_name]
              .filter(Boolean)
              .join(" - "),
            data: city,
          }))}
          onSearch={setCitySearch}
          onSelect={(option) => handleCitySelect(option.data as CityOption)}
          onClear={() => {
            setValue(`${type}.cityId`, undefined);
            setValue(`${type}.city`, "");
            setCitySearch("");
            resetPincode();
          }}
          error={addressErrors?.city?.message}
        />

        {/* ================= DISTRICT ================= */}

        <SearchSelect
          label="District"
          value={districtName}
          placeholder="Search district..."
          loading={districtLoading}
          options={districts.map((district) => ({
            value: district.district_id,
            label: district.state_name
              ? `${district.district_name} - ${district.state_name}`
              : district.district_name,
            data: district,
          }))}
          onSearch={setDistrictSearch}
          onSelect={(option) =>
            handleDistrictSelect(option.data as DistrictOption)
          }
          onClear={() => {
            setValue(`${type}.districtId`, undefined);
            setValue(`${type}.district`, "");
            setDistrictSearch("");
            resetCity();
          }}
          error={addressErrors?.district?.message}
        />

        {/* ================= STATE ================= */}

        <SearchSelect
          label="State"
          value={stateName}
          placeholder="Search state..."
          loading={stateLoading}
          options={states.map((state) => ({
            value: state.state_id,
            label: state.state_name,
            data: state,
          }))}
          onSearch={setStateSearch}
          onSelect={(option) => handleStateSelect(option.data as StateOption)}
          onClear={() => {
            setValue(`${type}.stateId`, undefined);
            setValue(`${type}.state`, "");
            setValue(`${type}.stateCode`, "");
            setStateSearch("");
            resetDistrict();
          }}
          error={addressErrors?.state?.message}
        />

        {/* ================= PINCODE ================= */}

        {/* <SearchSelect
        label="Pincode"
        value={pinCode ?? ""}
        placeholder="Search pincode..."
        loading={pincodeLoading}
        options={pincodes.map((pincode) => {
          const optionValue =
            pincode.pincode_id ??
            pincode.pincode_name ??
            pincode.pincode ??
            "";
          return {
            value: optionValue,
            label: [
              pincode.pincode_name,
              pincode.city_name,
              pincode.district_name,
              pincode.state_name,
            ]
              .filter(Boolean)
              .join(" - "),
            data: pincode,
          };
        })}
        // onSearch={setPincodeSearch}
        onSelect={(option) =>
          handlePincodeSelect(option.data as PincodeOption)
        }
        onClear={resetPincode}
        error={addressErrors?.pinCode?.message}
      /> */}

        <div>
          <label className="mb-0.5 block text-[11px] font-medium text-gray-600">
            Pincode
            {/* {type === "businessAddress" && (
              <span className="ml-0.5 text-red-500">*</span>
            )} */}
          </label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter pincode"
            autoComplete="off"
            {...register(`${type}.pinCode`, {
              // required:
              //   type === "businessAddress"
              //     ? "PIN code is required"
              //     : false,
              pattern: {
                value: /^[0-9]{6}$/,
                message: "Enter a valid 6 digit PIN code",
              },
            })}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value
                .replace(/\D/g, "")
                .slice(0, 6);
            }}
            className="h-8 w-full rounded-md border border-gray-300 bg-white px-2 text-xs outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
          />

          {addressErrors?.pinCode && (
            <p className="mt-0.5 text-[10px] text-red-600">
              {addressErrors.pinCode.message}
            </p>
          )}
        </div>

        {/* ================= STATE CODE ================= */}

        {/* <div className="col-span-2">
          <label className="mb-0.5 block text-[11px] font-medium text-gray-600">
            State Code
          </label>

          <input
            {...register(`${type}.stateCode`)}
            placeholder="State code"
            className="h-8 w-full rounded-md border border-gray-300  px-2 text-xs text-gray-600 outline-none"
          />
        </div> */}
      </div>
    </div>
  );
}
