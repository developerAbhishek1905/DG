// export type DealerStatus = "active" | "inactive" | "suspended";

// export interface DealerAddress {
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state: string;
//   pincode: string;
// }

// export interface DealerCapacity {
//   totalCapacity: number;
//   usedCapacity: number;
//   availableCapacity: number;
// }

// export interface DealerPerformance {
//   totalOrders: number;
//   completedOrders: number;
//   pendingOrders: number;
//   cancelledOrders: number;
//   completionRate: number;
//   rating: number;
// }

// export interface Dealer {
//   _id: string;

//   dealerCode: string;

//   name: string;

//   email: string;

//   phone: string;

//   gstNumber?: string;

//   status: DealerStatus;

//   address: DealerAddress;

//   capacity: DealerCapacity;

//   performance: DealerPerformance;

//   createdAt: string;

//   updatedAt: string;
// }

// export interface DealerFormData {
//   name: string;
//   email: string;
//   phone: string;
//   gstNumber?: string;

//   status: DealerStatus;

//   address: DealerAddress;

//   totalCapacity: number;
// }

// export interface DealerFilters {
//   search?: string;
//   status?: DealerStatus | "";
//   city?: string;
//   state?: string;
//   page?: number;
//   limit?: number;
// }

// export interface DealerListResponse {
//   dealers: Dealer[];

//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }

// export interface DealerStats {
//   total: number;
//   active: number;
//   inactive: number;
//   suspended: number;
// }

export type DealerStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface DealerCapacity {
  total: number;
  used: number;
}

export interface DealerPerformance {
  totalComplaints: number;
  completedComplaints: number;
  pendingComplaints: number;
  cancelledComplaints: number;
  cancellationRate: number;
  slaCompliance: number;
  averageResponseTime: number;
  feedbackScore: number;
  performanceScore: number;
}

export interface DealerRates {
  visit: number;
  service: number;
  installation: number;
  uninstallation: number;
  other: number;
}

export interface Dealer {
  id: string;
  dealerCode: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;

  city: string;
  state: string;
  address: string;
  pincode: string;

  supportedProducts: string[];

  capacity: DealerCapacity;

  status: DealerStatus;

  performance: DealerPerformance;

  rates: DealerRates;

  createdAt: string;
  updatedAt: string;
}

export interface DealerFormData {
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  address: string;
  pincode: string;
  supportedProducts: string[];
  totalCapacity: number;
  status: DealerStatus;
}