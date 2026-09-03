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

export type CapacityType = "COMBINED" | "INDIVIDUAL";

export type LedgerAccountType =
  | "STANDARD"
  | "OTHER_EXPENSE_IN_INVOICE"
  | "BANK"
  | "TAX_CODE"
  | "SALE_PURCHASE_ACCOUNT";

export type OpeningBalanceType =
  | "DR"
  | "CR";


export interface DealerCapacityItem {
  categoryId: string;
  rate: number;
  capacity: number;
  serviceType?: string;
}

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

// export interface Dealer {
//   id: string;
//   dealerCode: string;
//   name: string;
//   ownerName: string;
//   email: string;
//   phone: string;

//   city: string;
//   state: string;
//   address: string;
//   pincode: string;

//   supportedProducts: string[];

//   capacity: DealerCapacity;

//   status: DealerStatus;

//   performance: DealerPerformance;

//   rates: DealerRates;

//   createdAt: string;
//   updatedAt: string;
// }

export interface DealerFormData {

  technicianCode: string;
  technicianFirmName: string;
  technicianName: string;

  aadhaarNumber: string;
  aadhaarFile?: FileList;

  alternativeNumber: string;
  panFile?: FileList;

  drivingLicenceNumber: string;
  drivingLicenceFile?: FileList;

  documentUpload?: FileList;

  productId: string;
  productServiceType: string;

  technicianStatus: "ACTIVE" | "INACTIVE";


  headCode: string;
  groupHead: string;
  headName: string;
  grade?: string;

  address: {
  addressLine: string;
}[];
  city?: string;
  district?: string;
  state?: string;
  stateCode?: string;
  pinCode?: string;
  zone?: string;

  contactPerson?: string;
  phoneNumbers?: string;
  mobileNumber?: string;
  email?: string;

  taxApply?: string;
  gstNumber?: string;
  tinNumber?: string;
  uinNumber?: string;
  panNumber?: string;

  gstApplicable?: string;
  gstRate?: number;
  hsnCode?: string;

  reverseChargeLimit?: number;
  taxInputPayable?: string;
  vat15Column?: string;

  segment?: string;

  creditDays?: number;
  creditLimit?: number;

  accountType: LedgerAccountType;

  isDealer: boolean;
  disableChallan: boolean;
  ledgerSummaryOnly: boolean;
  accountDeactivated: boolean;

  otherInfo?: string;
  rating?: number;

  openingBalance?: number;
  openingBalanceType: OpeningBalanceType;
    capacityType: CapacityType;

  capacityMaster: DealerCapacityItem[];
}

export interface Dealer
  extends DealerFormData {
  id: string;

  createdAt: string;
  updatedAt: string;
}