export type DealerStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type CapacityType = "COMBINED" | "INDIVIDUAL";

export type LedgerAccountType =
  | "STANDARD"
  | "OTHER_EXPENSE_IN_INVOICE"
  | "BANK"
  | "TAX_CODE"
  | "SALE_PURCHASE_ACCOUNT";

export type OpeningBalanceType = "DR" | "CR";

export interface DealerProductCategory {
  categoryId: string;
  categoryName: string;
}

export interface DealerProductService {
  productId: number | undefined;
  productName: string;

  categories: DealerProductCategory[];
}

export interface DealerCapacityProduct {
  productId: number;
  productName: string;
}

export interface DealerCombinedCapacity {
  products: DealerCapacityProduct[];
  capacity: number;
}

export interface DealerCapacityItem {
  productId?: number;
  productName: string;
  capacity: number;
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

export interface DealerAddress {
  addressLine: string;

  stateId?: number;
  state: string;
  stateCode?: string;

  districtId?: number;
  district: string;

  cityId?: number;
  city: string;
  pincode_name: string;

  pincodeId?: number;
  pinCode: string;
}

export interface DealerFormData {
  technicianCode: string;

  technicianFirmName: string;

  technicianName: string;

  aadhaarNumber: string;

  // aadhaarFile?: FileList;

  aadhaarFrontFile?: FileList;
  aadhaarBackFile?: FileList;
  alternativeNumber: string;

  panNumber?: string;

  // panFile?: FileList;
  panFrontFile?: FileList;
  panBackFile?: FileList;

  drivingLicenceNumber: string;

  // drivingLicenceFile?: FileList;
  drivingLicenceFrontFile?: FileList;
  drivingLicenceBackFile?: FileList;

  documentUpload?: FileList;

  productId: string;

  productServiceType: string;

  technicianStatus: "ACTIVE" | "INACTIVE";

  headCode: string;

  groupHead: string;

  headName: string;

  grade?: string;

  // =========================
  // ADDRESS
  // =========================

  businessAddress: DealerAddress;

  residentialAddress: DealerAddress;

  zone?: string;

  contactPerson?: string;

  phoneNumbers?: string;

  mobileNumber?: string;

  email?: string;

  taxApply?: string;

  gstNumber?: string;

  tinNumber?: string;

  uinNumber?: string;

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

  productServices: DealerProductService[];

  combinedCapacity: DealerCombinedCapacity;

  capacityMaster: DealerCapacityItem[];
}

export interface Dealer extends DealerFormData {
  id: string;

  createdAt: string;

  updatedAt: string;
}
