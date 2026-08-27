// import axios from "axios";

// import type {
//   Dealer,
//   DealerFilters,
//   DealerFormData,
//   DealerListResponse,
//   DealerStats,
// } from "../types/dealer.types";

// const API_URL = "/api/dealers";

// export const dealerApi = {
//   getDealers: async (
//     filters?: DealerFilters
//   ): Promise<DealerListResponse> => {
//     const response = await axios.get(API_URL, {
//       params: filters,
//     });

//     return response.data;
//   },

//   getDealerById: async (id: string): Promise<Dealer> => {
//     const response = await axios.get(`${API_URL}/${id}`);

//     return response.data;
//   },

//   createDealer: async (
//     data: DealerFormData
//   ): Promise<Dealer> => {
//     const response = await axios.post(API_URL, data);

//     return response.data;
//   },

//   updateDealer: async (
//     id: string,
//     data: DealerFormData
//   ): Promise<Dealer> => {
//     const response = await axios.put(
//       `${API_URL}/${id}`,
//       data
//     );

//     return response.data;
//   },

//   deleteDealer: async (id: string): Promise<void> => {
//     await axios.delete(`${API_URL}/${id}`);
//   },

//   getDealerStats: async (): Promise<DealerStats> => {
//     const response = await axios.get(`${API_URL}/stats`);

//     return response.data;
//   },

//   getDealerPerformance: async (
//     id: string
//   ): Promise<Dealer> => {
//     const response = await axios.get(
//       `${API_URL}/${id}/performance`
//     );

//     return response.data;
//   },
// };

import type {
  Dealer,
  DealerFormData,
} from "../types/dealer.types";

export const mockDealers: Dealer[] = [
  {
    id: "1",
    dealerCode: "DLR-001",
    name: "ABC Service Center",
    ownerName: "Amit Sharma",
    email: "abcservice@example.com",
    phone: "9876543210",

    city: "Indore",
    state: "Madhya Pradesh",
    address: "Vijay Nagar, Indore",
    pincode: "452010",

    supportedProducts: [
      "Air Conditioner",
      "Washing Machine",
      "Refrigerator",
    ],

    capacity: {
      total: 30,
      used: 18,
    },

    status: "ACTIVE",

    performance: {
      totalComplaints: 420,
      completedComplaints: 370,
      pendingComplaints: 25,
      cancelledComplaints: 25,
      cancellationRate: 5.95,
      slaCompliance: 94,
      averageResponseTime: 18,
      feedbackScore: 4.6,
      performanceScore: 92,
    },

    rates: {
      visit: 300,
      service: 700,
      installation: 900,
      uninstallation: 600,
      other: 400,
    },

    createdAt: "2026-05-01T10:00:00",
    updatedAt: "2026-08-20T10:00:00",
  },

  {
    id: "2",
    dealerCode: "DLR-002",
    name: "Reliable Electronics",
    ownerName: "Suresh Verma",
    email: "reliable@example.com",
    phone: "9898989898",

    city: "Bhopal",
    state: "Madhya Pradesh",
    address: "MP Nagar, Bhopal",
    pincode: "462011",

    supportedProducts: [
      "Television",
      "Air Conditioner",
      "Refrigerator",
    ],

    capacity: {
      total: 25,
      used: 23,
    },

    status: "ACTIVE",

    performance: {
      totalComplaints: 310,
      completedComplaints: 260,
      pendingComplaints: 30,
      cancelledComplaints: 20,
      cancellationRate: 6.45,
      slaCompliance: 89,
      averageResponseTime: 26,
      feedbackScore: 4.2,
      performanceScore: 84,
    },

    rates: {
      visit: 250,
      service: 650,
      installation: 850,
      uninstallation: 550,
      other: 350,
    },

    createdAt: "2026-04-15T09:00:00",
    updatedAt: "2026-08-18T13:00:00",
  },

  {
    id: "3",
    dealerCode: "DLR-003",
    name: "FastFix Appliances",
    ownerName: "Rakesh Jain",
    email: "fastfix@example.com",
    phone: "9112233445",

    city: "Indore",
    state: "Madhya Pradesh",
    address: "Palasia, Indore",
    pincode: "452001",

    supportedProducts: [
      "Washing Machine",
      "Microwave",
      "Air Conditioner",
    ],

    capacity: {
      total: 20,
      used: 8,
    },

    status: "ACTIVE",

    performance: {
      totalComplaints: 215,
      completedComplaints: 190,
      pendingComplaints: 15,
      cancelledComplaints: 10,
      cancellationRate: 4.65,
      slaCompliance: 97,
      averageResponseTime: 14,
      feedbackScore: 4.8,
      performanceScore: 95,
    },

    rates: {
      visit: 320,
      service: 720,
      installation: 950,
      uninstallation: 650,
      other: 420,
    },

    createdAt: "2026-03-12T09:00:00",
    updatedAt: "2026-08-22T14:00:00",
  },

  {
    id: "4",
    dealerCode: "DLR-004",
    name: "Smart Care Services",
    ownerName: "Deepak Mehta",
    email: "smartcare@example.com",
    phone: "9000011111",

    city: "Ujjain",
    state: "Madhya Pradesh",
    address: "Freeganj, Ujjain",
    pincode: "456010",

    supportedProducts: [
      "Air Conditioner",
      "Refrigerator",
    ],

    capacity: {
      total: 15,
      used: 6,
    },

    status: "INACTIVE",

    performance: {
      totalComplaints: 180,
      completedComplaints: 145,
      pendingComplaints: 15,
      cancelledComplaints: 20,
      cancellationRate: 11.11,
      slaCompliance: 78,
      averageResponseTime: 35,
      feedbackScore: 3.8,
      performanceScore: 67,
    },

    rates: {
      visit: 280,
      service: 600,
      installation: 800,
      uninstallation: 500,
      other: 300,
    },

    createdAt: "2026-01-20T09:00:00",
    updatedAt: "2026-07-10T10:00:00",
  },
];

let dealers = [...mockDealers];

export const getDealers = async (): Promise<Dealer[]> => {
  return Promise.resolve(dealers);
};

export const getDealerById = async (
  id: string
): Promise<Dealer | undefined> => {
  return Promise.resolve(
    dealers.find((dealer) => dealer.id === id)
  );
};

// export const createDealer = async (
//   data: DealerFormData
// ): Promise<Dealer> => {
//   const dealer: Dealer = {
//     id: String(Date.now()),
//     dealerCode: `DLR-${String(dealers.length + 1).padStart(3, "0")}`,

//     ...data,

//     capacity: {
//       total: Number(data.totalCapacity),
//       used: 0,
//     },

//     performance: {
//       totalComplaints: 0,
//       completedComplaints: 0,
//       pendingComplaints: 0,
//       cancelledComplaints: 0,
//       cancellationRate: 0,
//       slaCompliance: 100,
//       averageResponseTime: 0,
//       feedbackScore: 0,
//       performanceScore: 100,
//     },

//     rates: {
//       visit: 0,
//       service: 0,
//       installation: 0,
//       uninstallation: 0,
//       other: 0,
//     },

//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   };

//   dealers = [...dealers, dealer];

//   return Promise.resolve(dealer);
// };

export const createDealer = async (
  data: DealerFormData
): Promise<Dealer> => {
  const {
    totalCapacity,
    ...dealerData
  } = data;

  const dealer: Dealer = {
    id: String(Date.now()),

    dealerCode: `DLR-${String(
      dealers.length + 1
    ).padStart(3, "0")}`,

    ...dealerData,

    capacity: {
      total: Number(totalCapacity),
      used: 0,
    },

    performance: {
      totalComplaints: 0,
      completedComplaints: 0,
      pendingComplaints: 0,
      cancelledComplaints: 0,
      cancellationRate: 0,
      slaCompliance: 100,
      averageResponseTime: 0,
      feedbackScore: 0,
      performanceScore: 100,
    },

    rates: {
      visit: 0,
      service: 0,
      installation: 0,
      uninstallation: 0,
      other: 0,
    },

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dealers = [...dealers, dealer];

  return dealer;
};

export const updateDealer = async (
  id: string,
  data: DealerFormData
): Promise<Dealer | undefined> => {
  const index = dealers.findIndex(
    (dealer) => dealer.id === id
  );

  if (index === -1) return undefined;

  dealers[index] = {
    ...dealers[index],
    ...data,

    capacity: {
      ...dealers[index].capacity,
      total: Number(data.totalCapacity),
    },

    updatedAt: new Date().toISOString(),
  };

  return Promise.resolve(dealers[index]);
};


export const deleteDealer = async (
  id: string
): Promise<boolean> => {
  const dealerExists = dealers.some(
    (dealer) => dealer.id === id
  );

  if (!dealerExists) {
    return false;
  }

  dealers = dealers.filter(
    (dealer) => dealer.id !== id
  );

  return true;
};