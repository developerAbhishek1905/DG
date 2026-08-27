import type {
  Area,
  AreaFormData,
} from "../types/area.types";

export let mockAreas: Area[] = [
  {
    id: "AREA-001",

    areaCode: "IND-VIJ-001",

    areaName: "Vijay Nagar",

    city: "Indore",

    district: "Indore",

    state: "Madhya Pradesh",

    pincode: "452010",

    zone: "East",

    latitude: 22.7533,

    longitude: 75.8937,

    status: "ACTIVE",

    createdAt:
      "2026-08-01T10:00:00",

    updatedAt:
      "2026-08-01T10:00:00",
  },

  {
    id: "AREA-002",

    areaCode: "IND-PAL-002",

    areaName: "Palasia",

    city: "Indore",

    district: "Indore",

    state: "Madhya Pradesh",

    pincode: "452001",

    zone: "Central",

    latitude: 22.7246,

    longitude: 75.8839,

    status: "ACTIVE",

    createdAt:
      "2026-08-02T10:00:00",

    updatedAt:
      "2026-08-02T10:00:00",
  },

  {
    id: "AREA-003",

    areaCode: "BPL-MPN-001",

    areaName: "MP Nagar",

    city: "Bhopal",

    district: "Bhopal",

    state: "Madhya Pradesh",

    pincode: "462011",

    zone: "Central",

    latitude: 23.233,

    longitude: 77.434,

    status: "ACTIVE",

    createdAt:
      "2026-08-03T10:00:00",

    updatedAt:
      "2026-08-03T10:00:00",
  },

  {
    id: "AREA-004",

    areaCode: "IND-RAU-004",

    areaName: "Rau",

    city: "Indore",

    district: "Indore",

    state: "Madhya Pradesh",

    pincode: "453331",

    zone: "West",

    latitude: 22.6406,

    longitude: 75.8109,

    status: "INACTIVE",

    createdAt:
      "2026-08-04T10:00:00",

    updatedAt:
      "2026-08-04T10:00:00",
  },
];

function delay(
  milliseconds = 400
) {
  return new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        milliseconds
      )
  );
}

export const getAreas =
  async (): Promise<
    Area[]
  > => {
    await delay();

    return [
      ...mockAreas,
    ];
  };

export const getAreaById =
  async (
    id: string
  ): Promise<
    Area | undefined
  > => {
    await delay();

    return mockAreas.find(
      (area) =>
        area.id === id
    );
  };

export const createArea =
  async (
    data: AreaFormData
  ): Promise<Area> => {
    await delay();

    const duplicateCode =
      mockAreas.some(
        (area) =>
          area.areaCode
            .toLowerCase() ===
          data.areaCode
            .toLowerCase()
      );

    if (duplicateCode) {
      throw new Error(
        "Area code already exists"
      );
    }

    const now =
      new Date().toISOString();

    const newArea: Area = {
      id: `AREA-${String(
        mockAreas.length + 1
      ).padStart(
        3,
        "0"
      )}`,

      ...data,

      createdAt:
        now,

      updatedAt:
        now,
    };

    mockAreas = [
      newArea,
      ...mockAreas,
    ];

    return newArea;
  };

export const updateArea =
  async (
    id: string,
    data: AreaFormData
  ): Promise<Area> => {
    await delay();

    const index =
      mockAreas.findIndex(
        (area) =>
          area.id === id
      );

    if (index === -1) {
      throw new Error(
        "Area not found"
      );
    }

    const duplicateCode =
      mockAreas.some(
        (area) =>
          area.id !== id &&
          area.areaCode
            .toLowerCase() ===
            data.areaCode
              .toLowerCase()
      );

    if (duplicateCode) {
      throw new Error(
        "Area code already exists"
      );
    }

    const updatedArea: Area = {
      ...mockAreas[index],

      ...data,

      updatedAt:
        new Date().toISOString(),
    };

    mockAreas[index] =
      updatedArea;

    return updatedArea;
  };

export const toggleAreaStatus =
  async (
    id: string
  ): Promise<Area> => {
    await delay(250);

    const area =
      mockAreas.find(
        (item) =>
          item.id === id
      );

    if (!area) {
      throw new Error(
        "Area not found"
      );
    }

    area.status =
      area.status ===
      "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    area.updatedAt =
      new Date().toISOString();

    return {
      ...area,
    };
  };