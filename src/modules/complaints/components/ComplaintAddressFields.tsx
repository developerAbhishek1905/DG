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
  searchPincodes,
  searchStates,
  type CityOption,
  type DistrictOption,
  type PincodeOption,
  type StateOption,
} from "../../dealers/services/addressApi";

import { useDebounce } from "../../../hooks/useDebounce";
// import {ComplaintFormData} from "../types/complaint.types.js"

interface Props {
  register: UseFormRegister<ComplaintFormData>;

  setValue: UseFormSetValue<ComplaintFormData>;

  watch: UseFormWatch<ComplaintFormData>;

  errors: FieldErrors<ComplaintFormData>;
}

export default function ComplaintAddressFields({
  register,
  setValue,
  watch,
  errors,
}: Props) {
  /* =========================
     OPTIONS
  ========================= */

  const [states, setStates] = useState<StateOption[]>([]);

  const [districts, setDistricts] = useState<DistrictOption[]>([]);

  const [cities, setCities] = useState<CityOption[]>([]);

  const [pincodes, setPincodes] = useState<PincodeOption[]>([]);

  /* =========================
     SEARCH
  ========================= */

  const [stateSearch, setStateSearch] = useState("");

  const [districtSearch, setDistrictSearch] = useState("");

  const [citySearch, setCitySearch] = useState("");

  const [pincodeSearch, setPincodeSearch] = useState("");

  const debouncedStateSearch = useDebounce(stateSearch, 500);

  const debouncedDistrictSearch = useDebounce(districtSearch, 500);

  const debouncedCitySearch = useDebounce(citySearch, 500);

  const debouncedPincodeSearch = useDebounce(pincodeSearch, 500);

  /* =========================
     LOADING
  ========================= */

  const [stateLoading, setStateLoading] = useState(false);

  const [districtLoading, setDistrictLoading] = useState(false);

  const [cityLoading, setCityLoading] = useState(false);

  const [pincodeLoading, setPincodeLoading] = useState(false);

  /* =========================
     FORM VALUES
  ========================= */

  const stateId = watch("address.stateId");

  const districtId = watch("address.districtId");

  const cityId = watch("address.cityId");

  const stateName = watch("address.state");

  const districtName = watch("address.district");

  const cityName = watch("address.city");

  const pinCode = watch("address.pinCode");

  const addressErrors = errors.address;

  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {
    loadStates(debouncedStateSearch);
  }, [debouncedStateSearch]);

  useEffect(() => {
    loadDistricts(debouncedDistrictSearch);
  }, [debouncedDistrictSearch, stateId]);

  useEffect(() => {
    loadCities(debouncedCitySearch);
  }, [debouncedCitySearch, stateId, districtId]);

  useEffect(() => {
    loadPincodes(debouncedPincodeSearch);
  }, [debouncedPincodeSearch, cityId]);

  /* =========================
     STATE API
  ========================= */

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

  /* =========================
     DISTRICT API
  ========================= */

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

  /* =========================
     CITY API
  ========================= */

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

  /* =========================
     PINCODE API
  ========================= */

  const loadPincodes = async (search: string) => {
    try {
      setPincodeLoading(true);

      const data = await searchPincodes({
        cityId: cityId ? Number(cityId) : undefined,

        search,
      });

      setPincodes(data);
    } catch (error) {
      console.error("Failed to load pincodes:", error);

      setPincodes([]);
    } finally {
      setPincodeLoading(false);
    }
  };

  /* =========================
     RESET HELPERS
  ========================= */

  const resetPincode = () => {
    setValue("address.pincodeId", undefined);

    setValue("address.pinCode", "");

    setPincodeSearch("");
  };

  const resetCity = () => {
    setValue("address.cityId", undefined);

    setValue("address.city", "");

    setCitySearch("");

    resetPincode();
  };

  const resetDistrict = () => {
    setValue("address.districtId", undefined);

    setValue("address.district", "");

    setDistrictSearch("");

    resetCity();
  };

  /* =========================
     STATE SELECT
  ========================= */

  const handleStateSelect = (state: StateOption) => {
    setValue("address.stateId", state.state_id, {
      shouldValidate: true,
    });

    setValue("address.state", state.state_name, {
      shouldValidate: true,
    });

    resetDistrict();
  };

  /* =========================
     DISTRICT SELECT
  ========================= */

  const handleDistrictSelect = (district: DistrictOption) => {
    setValue("address.stateId", district.state_id, {
      shouldValidate: true,
    });

    setValue("address.state", district.state_name ?? "", {
      shouldValidate: true,
    });

    setValue("address.districtId", district.district_id, {
      shouldValidate: true,
    });

    setValue("address.district", district.district_name, {
      shouldValidate: true,
    });

    resetCity();
  };

  /* =========================
     CITY SELECT
  ========================= */

  const handleCitySelect = async (city: CityOption) => {
    setValue("address.stateId", city.state_id, {
      shouldValidate: true,
    });

    setValue("address.state", city.state_name ?? "", {
      shouldValidate: true,
    });

    setValue("address.districtId", city.district_id, {
      shouldValidate: true,
    });

    setValue("address.district", city.district_name ?? "", {
      shouldValidate: true,
    });

    setValue("address.cityId", city.city_id, {
      shouldValidate: true,
    });

    setValue("address.city", city.city_name, {
      shouldValidate: true,
    });

    resetPincode();

    try {
      setPincodeLoading(true);

      const data = await searchPincodes({
        cityId: city.city_id,

        search: "",
      });

      setPincodes(data);
    } catch (error) {
      console.error("Failed to load pincodes:", error);

      setPincodes([]);
    } finally {
      setPincodeLoading(false);
    }
  };

  /* =========================
     PINCODE SELECT
  ========================= */

  const handlePincodeSelect = (pincode: PincodeOption) => {
    const selectedPinCode = pincode.pincode_name || pincode.pincode || "";

    if (pincode.state_id) {
      setValue("address.stateId", pincode.state_id, {
        shouldValidate: true,
      });
    }

    if (pincode.state_name) {
      setValue("address.state", pincode.state_name, {
        shouldValidate: true,
      });
    }

    if (pincode.district_id) {
      setValue("address.districtId", pincode.district_id, {
        shouldValidate: true,
      });
    }

    if (pincode.district_name) {
      setValue("address.district", pincode.district_name, {
        shouldValidate: true,
      });
    }

    if (pincode.city_id) {
      setValue("address.cityId", pincode.city_id, {
        shouldValidate: true,
      });
    }

    if (pincode.city_name) {
      setValue("address.city", pincode.city_name, {
        shouldValidate: true,
      });
    }

    if (pincode.pincode_id) {
      setValue("address.pincodeId", pincode.pincode_id);
    }

    setValue("address.pinCode", String(selectedPinCode), {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <div className="space-y-4">
      {/* Hidden IDs */}

      <input
        type="hidden"
        {...register("address.stateId", {
          required: "State is required",
        })}
      />

      <input
        type="hidden"
        {...register("address.districtId", {
          required: "District is required",
        })}
      />

      <input
        type="hidden"
        {...register("address.cityId", {
          required: "City is required",
        })}
      />

      <input
        type="hidden"
        {...register("address.pinCode", {
          required: "PIN code is required",
        })}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* ADDRESS */}

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Customer Address
            {/* <span className="ml-1 text-red-500">*</span> */}
          </label>

          <input
            placeholder="Enter complete customer address"
            {...register("address.addressLine", {
              required: "Customer address is required",
            })}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {addressErrors?.addressLine && (
            <p className="mt-1 text-xs text-red-600">
              {addressErrors.addressLine.message}
            </p>
          )}
        </div>

        {/* STATE */}

        <SearchSelect
          label="State"
          value={stateName || ""}
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
            setValue("address.stateId", undefined);

            setValue("address.state", "");

            setStateSearch("");

            resetDistrict();
          }}
          error={addressErrors?.state?.message}
        />

        {/* DISTRICT */}

        <SearchSelect
          label="District"
          value={districtName || ""}
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
            setValue("address.districtId", undefined);

            setValue("address.district", "");

            setDistrictSearch("");

            resetCity();
          }}
          error={addressErrors?.district?.message}
        />

        {/* CITY */}

        <SearchSelect
          label="City"
          value={cityName || ""}
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
            setValue("address.cityId", undefined);

            setValue("address.city", "");

            setCitySearch("");

            resetPincode();
          }}
          error={addressErrors?.city?.message}
        />

        {/* PINCODE */}

        <SearchSelect
          label="PIN Code"
          value={pinCode || ""}
          placeholder="Search pincode..."
          loading={pincodeLoading}
          options={pincodes.map((pincode) => {
            const value =
              pincode.pincode_id ??
              pincode.pincode_name ??
              pincode.pincode ??
              "";

            return {
              value,

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
          onSearch={setPincodeSearch}
          onSelect={(option) =>
            handlePincodeSelect(option.data as PincodeOption)
          }
          onClear={resetPincode}
          error={addressErrors?.pinCode?.message}
        />
      </div>
    </div>
  );
}
