import api from "../../../services/api/axios";

export interface StateOption {
  id?: string;
  state_id: number;
  state_name: string;
  state_code?: string;
}

export interface DistrictOption {
  id?: string;
  district_id: number;
  district_name: string;
  state_id: number;
  state_name?: string;
  state_code?: string;
}

export interface CityOption {
  id?: string;
  city_id: number;
  city_name: string;
  district_id: number;
  district_name?: string;
  state_id: number;
  state_name?: string;
  state_code?: string;
  pincode_id?: number;
  pincode_name?: string;
}

export interface PincodeOption {
  id?: string;
  pincode_id?: number;
  pincode: string;
  pincode_name?: string;  
  city_id: number;
  city_name?: string;
  district_id?: number;
  district_name?: string;
  state_id?: number;
  state_name?: string;
  state_code?: string;
}

/* STATES */
export const searchStates = async (
  search = "",
): Promise<StateOption[]> => {
  const response = await api.get("/states", {
    params: {
      page: 1,
      limit: 50,
      ...(search ? { search } : {}),
    },
  });

  return response.data?.data?.states ?? response.data?.data ?? [];
};

/* DISTRICTS */

export const searchDistricts = async ({
  stateId,
  search = "",
}: {
  stateId?: number;
  search?: string;
} = {}): Promise<DistrictOption[]> => {
  const response = await api.get("/districts/dropdown", {
    params: {
      ...(stateId ? { state_id: stateId } : {}),
      ...(search ? { search } : {}),
    },
  });

  return response.data?.data?.districts ?? response.data?.data ?? [];
};

/* CITIES */

export const searchCities = async ({
  stateId,
  districtId,
  search = "",
}: {
  stateId?: number;
  districtId?: number;
  search?: string;
} = {}): Promise<CityOption[]> => {
  const response = await api.get("/cities/dropdown", {
    params: {
      ...(stateId ? { state_id: stateId } : {}),
      ...(districtId ? { district_id: districtId } : {}),
      ...(search ? { search } : {}),
    },
  });

  return response.data?.data?.cities ?? response.data?.data ?? [];
};

/* PINCODES */

export const searchPincodes = async ({
  cityId,
  search = "",
}: {
  cityId?: number;
  search?: string;
} = {}): Promise<PincodeOption[]> => {
  const response = await api.get("/pincodes/dropdown", {
    params: {
      ...(cityId ? { city_id: cityId } : {}),
      ...(search ? { search } : {}),
    },
  });

  return response.data?.data?.pincodes ?? response.data?.data ?? [];
};