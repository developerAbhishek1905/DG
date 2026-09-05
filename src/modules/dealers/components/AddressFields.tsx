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

  const [pincodes, setPincodes] = useState<PincodeOption[]>([]);

  const [stateSearch, setStateSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [pincodeSearch, setPincodeSearch] = useState("");

  const debouncedStateSearch = useDebounce(stateSearch, 500);
  const debouncedDistrictSearch = useDebounce(districtSearch, 500);
  const debouncedCitySearch = useDebounce(citySearch, 500);
  const debouncedPincodeSearch = useDebounce(pincodeSearch, 500);

  /* ===================================================== */
  /* LOADING */
  /* ===================================================== */

  const [stateLoading, setStateLoading] = useState(false);

  const [districtLoading, setDistrictLoading] = useState(false);

  const [cityLoading, setCityLoading] = useState(false);

  const [pincodeLoading, setPincodeLoading] = useState(false);

  /* ===================================================== */
  /* VALUES */
  /* ===================================================== */

  const stateId = watch(`${type}.stateId`);

  const districtId = watch(`${type}.districtId`);

  const cityId = watch(`${type}.cityId`);

  const stateName = watch(`${type}.state`);

  const districtName = watch(`${type}.district`);

  const cityName = watch(`${type}.city`);

  const pinCode = watch(`${type}.pinCode`);

  const addressErrors = errors[type];

  /* ===================================================== */
  /* INITIAL LOAD */
  /* ===================================================== */

  // const loadInitialAddressData = async () => {
  //   await Promise.all([
  //     loadStates(""),
  //     loadDistricts(""),
  //     loadCities(""),
  //     loadPincodes(""),
  //   ]);
  // };

  // useEffect(() => {
  //   loadInitialAddressData();
  // }, []);

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

  /* ===================================================== */
  /* RESET HELPERS */
  /* ===================================================== */

  //   const resetPincode = () => {
  //   setValue(`${type}.pincodeId`, undefined);
  //   setValue(`${type}.pinCode`, "");

  //   setPincodeSearch("");
  //   loadPincodes("");
  // };

  // const resetCity = () => {
  //   setValue(`${type}.cityId`, undefined);
  //   setValue(`${type}.city`, "");

  //   setCitySearch("");
  //   loadCities("");

  //   resetPincode();
  // };

  // const resetDistrict = () => {
  //   setValue(`${type}.districtId`, undefined);
  //   setValue(`${type}.district`, "");

  //   setDistrictSearch("");
  //   loadDistricts("");

  //   resetCity();
  // };

  const resetPincode = () => {
    setValue(`${type}.pincodeId`, undefined);
    setValue(`${type}.pinCode`, "");

    setPincodeSearch("");
  };

  const resetCity = () => {
    setValue(`${type}.cityId`, undefined);
    setValue(`${type}.city`, "");

    setCitySearch("");

    resetPincode();
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

  // const handleStateSelect = async (state: StateOption) => {
  //   setValue(`${type}.stateId`, state.state_id, {
  //     shouldValidate: true,
  //   });

  //   setValue(`${type}.state`, state.state_name, {
  //     shouldValidate: true,
  //   });

  //   setValue(`${type}.stateCode`, state.state_code ?? "");

  //   // reset district
  //   setValue(`${type}.districtId`, undefined);

  //   setValue(`${type}.district`, "");

  //   // reset city
  //   setValue(`${type}.cityId`, undefined);

  //   setValue(`${type}.city`, "");

  //   // reset pincode
  //   setValue(`${type}.pincodeId`, undefined);

  //   setValue(`${type}.pincode_name`, "");

  //   setCities([]);
  //   setPincodes([]);

  //   /*
  //    * Immediately load districts
  //    * of selected state
  //    */

  //   try {
  //     setDistrictLoading(true);

  //     const data = await searchDistricts({
  //       stateId: state.state_id,
  //       search: "",
  //     });

  //     setDistricts(data);
  //   } finally {
  //     setDistrictLoading(false);
  //   }

  //   /*
  //    * You can also immediately load
  //    * all cities of selected state
  //    */

  //   try {
  //     setCityLoading(true);

  //     const data = await searchCities({
  //       stateId: state.state_id,
  //       search: "",
  //     });

  //     setCities(data);
  //   } finally {
  //     setCityLoading(false);
  //   }
  // };

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
    setPincodeSearch("");
  };
  /* ===================================================== */
  /* DISTRICT SELECT */
  /* ===================================================== */

  // const handleDistrictSelect = async (district: DistrictOption) => {
  //   /*
  //    * Auto fill State
  //    */

  //   setValue(`${type}.stateId`, district.state_id, {
  //     shouldValidate: true,
  //   });

  //   if (district.state_name) {
  //     setValue(`${type}.state`, district.state_name, {
  //       shouldValidate: true,
  //     });
  //   }

  //   if (district.state_code) {
  //     setValue(`${type}.stateCode`, district.state_code);
  //   }

  //   /*
  //    * Set District
  //    */

  //   setValue(`${type}.districtId`, district.district_id, {
  //     shouldValidate: true,
  //   });

  //   setValue(`${type}.district`, district.district_name, {
  //     shouldValidate: true,
  //   });

  //   /*
  //    * Reset City
  //    */

  //   setValue(`${type}.cityId`, undefined);

  //   setValue(`${type}.city`, "");

  //   /*
  //    * Reset Pincode
  //    */

  //   setValue(`${type}.pincodeId`, undefined);

  //   setValue(`${type}.pincode_name`, "");

  //   setPincodes([]);

  //   /*
  //    * Load cities for selected district
  //    */

  //   try {
  //     setCityLoading(true);

  //     const data = await searchCities({
  //       stateId: district.state_id,

  //       districtId: district.district_id,

  //       search: "",
  //     });

  //     setCities(data);
  //   } finally {
  //     setCityLoading(false);
  //   }
  // };

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
    setPincodeSearch("");
  };
  /* ===================================================== */
  /* CITY SELECT */
  /* ===================================================== */

  // const handleCitySelect = (city: CityOption) => {
  //   /*
  //    * Auto-fill state
  //    */

  //   setValue(`${type}.stateId`, city.state_id, {
  //     shouldValidate: true,
  //   });

  //   if (city.state_name) {
  //     setValue(`${type}.state`, city.state_name, {
  //       shouldValidate: true,
  //     });
  //   }

  //   if (city.state_code) {
  //     setValue(`${type}.stateCode`, city.state_code);
  //   }

  //   /*
  //    * Auto-fill district
  //    */

  //   setValue(`${type}.districtId`, city.district_id, {
  //     shouldValidate: true,
  //   });

  //   if (city.district_name) {
  //     setValue(`${type}.district`, city.district_name, {
  //       shouldValidate: true,
  //     });
  //   }

  //   /*
  //    * Set city
  //    */

  //   setValue(`${type}.cityId`, city.city_id, {
  //     shouldValidate: true,
  //   });

  //   setValue(`${type}.city`, city.city_name, {
  //     shouldValidate: true,
  //   });

  //   /*
  //    * reset only pincode
  //    */

  //   setValue(`${type}.pincodeId`, undefined);

  //   setValue(`${type}.pincode_name`, "");

  //   setPincodes([]);
  // };

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

    setValue(`${type}.pincodeId`, undefined);
    setValue(`${type}.pinCode`, "");

    /* ============================= */
    /* LOAD PINCODES OF CITY */
    /* ============================= */

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
  /* ===================================================== */
  /* PINCODE SELECT */
  /* ===================================================== */

  const handlePincodeSelect = (pincode: PincodeOption) => {
    /*
     * Auto-fill State
     */

    console.log(pincode);

    if (pincode.state_id) {
      setValue(`${type}.stateId`, pincode.state_id, {
        shouldValidate: true,
      });
    }

    if (pincode.state_name) {
      setValue(`${type}.state`, pincode.state_name, {
        shouldValidate: true,
      });
    }

    if (pincode.state_code) {
      setValue(`${type}.stateCode`, pincode.state_code);
    }

    /*
     * Auto-fill District
     */

    if (pincode.district_id) {
      setValue(`${type}.districtId`, pincode.district_id, {
        shouldValidate: true,
      });
    }

    if (pincode.district_name) {
      setValue(`${type}.district`, pincode.district_name, {
        shouldValidate: true,
      });
    }

    /*
     * Auto-fill City
     */

    setValue(`${type}.cityId`, pincode.city_id, {
      shouldValidate: true,
    });

    if (pincode.city_name) {
      setValue(`${type}.city`, pincode.city_name, {
        shouldValidate: true,
      });
    }

    /*
     * Set Pincode
     */

    if (pincode.pincode_id) {
      setValue(`${type}.pincodeId`, pincode.pincode_id);
    }

    setValue(`${type}.pincode_name`, String(pincode.pincode_name), {
      shouldValidate: true,
    });
  };

  /* ===================================================== */
  /* JSX */
  /* ===================================================== */

  return (
    <div>
      {/* Hidden validation fields */}

      <input
        type="hidden"
        {...register(`${type}.stateId`, {
          required: "State is required",
        })}
      />

      <input
        type="hidden"
        {...register(`${type}.districtId`, {
          required: "District is required",
        })}
      />

      <input
        type="hidden"
        {...register(`${type}.cityId`, {
          required: "City is required",
        })}
      />

      <input
        type="hidden"
        {...register(`${type}.pinCode`, {
          required: "PIN code is required",
        })}
      />

      <h4 className="mb-4 text-sm font-semibold text-gray-900">{title}</h4>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* ================================================= */}
        {/* ADDRESS */}
        {/* ================================================= */}

        <div className="md:col-span-2 lg:col-span-3">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Address
          </label>

          <textarea
            rows={3}
            placeholder={`Enter complete ${title.toLowerCase()}`}
            {...register(`${type}.addressLine`, {
              required: `${title} is required`,
            })}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {addressErrors?.addressLine && (
            <p className="mt-1 text-xs text-red-600">
              {addressErrors.addressLine.message}
            </p>
          )}
        </div>

        {/* ================================================= */}
        {/* STATE */}
        {/* ================================================= */}

        {/* <SearchSelect
          label="State"
          value={stateName}
          placeholder="Search state..."
          loading={stateLoading}
          options={states.map((state) => ({
            value: state.state_id,
            label: state.state_name,
            data: state,
          }))}
          onSearch={loadStates}
          onSelect={(option) => handleStateSelect(option.data as StateOption)}
          onClear={() => {
            setValue(`${type}.stateId`, undefined);

            setValue(`${type}.state`, "");

            setValue(`${type}.stateCode`, "");

            resetDistrict();
          }}
          error={addressErrors?.state?.message}
        /> */}

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
        {/* ================================================= */}
        {/* DISTRICT */}
        {/* ================================================= */}

        {/* <SearchSelect
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
          onSearch={loadDistricts}
          onSelect={(option) =>
            handleDistrictSelect(option.data as DistrictOption)
          }
          onClear={() => {
            setValue(`${type}.districtId`, undefined);

            setValue(`${type}.district`, "");

            resetCity();
          }}
          error={addressErrors?.district?.message}
        /> */}

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
        {/* ================================================= */}
        {/* CITY */}
        {/* ================================================= */}

        {/* <SearchSelect
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
          onSearch={loadCities}
          onSelect={(option) => handleCitySelect(option.data as CityOption)}
          onClear={() => {
            setValue(`${type}.cityId`, undefined);

            setValue(`${type}.city`, "");

            resetPincode();
          }}
          error={addressErrors?.city?.message}
        /> */}

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

        {/* ================================================= */}
        {/* PINCODE */}
        {/* ================================================= */}

        {/* <SearchSelect
          label="PIN Code"
          value={pinCode}
          placeholder="Search pincode..."
          loading={pincodeLoading}
          options={pincodes.map((pincode) => ({
            value: pincode.pincode_id ?? pincode.pincode,

            label: [
              pincode.pincode,
              pincode.city_name,
              pincode.district_name,
              pincode.state_name,
            ]
              .filter(Boolean)
              .join(" - "),

            data: pincode,
          }))}
          onSearch={loadPincodes}
          onSelect={(option) =>
            handlePincodeSelect(option.data as PincodeOption)
          }
          onClear={() => {
            resetPincode();
          }}
          error={addressErrors?.pinCode?.message}
        /> */}

        <SearchSelect
          label="PIN Code"
          value={pinCode ?? ""}
          placeholder="Search pincode..."
          loading={pincodeLoading}
          options={pincodes.map((pincode) => {
            const optionValue =
              pincode.pincode_id ?? pincode.pincode_name ?? pincode.pincode ?? "";

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
          onSearch={setPincodeSearch}
          onSelect={(option) =>
            handlePincodeSelect(option.data as PincodeOption)
          }
          onClear={resetPincode}
          error={addressErrors?.pinCode?.message}
        />

        {/* ================================================= */}
        {/* STATE CODE */}
        {/* ================================================= */}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            State Code
          </label>

          <input
            {...register(`${type}.stateCode`)}
            placeholder="State code"
            className="w-full rounded-lg border border-gray-300  px-3 py-2.5 text-sm text-gray-600 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
