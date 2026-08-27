export type ClosureType =
  | "VISIT"
  | "PART"
  | "SERVICE"
  | "INSTALLATION"
  | "UNINSTALLATION";

export type ClosureStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "VERIFIED"
  | "REJECTED";

export interface ClosureCustomer {
  id: string;
  name: string;
  phone: string;
  city: string;
}

export interface ClosureDealer {
  id: string;
  name: string;
  dealerCode: string;
}

export interface ClosureProof {
  id: string;
  name: string;
  type: string;
  size: number;
  previewUrl?: string;
}

export interface BaseClosure {
  id: string;

  complaintId: string;
  complaintNumber: string;

  customer: ClosureCustomer;

  dealer: ClosureDealer;

  closureType: ClosureType;

  status: ClosureStatus;

  remarks?: string;

  proofs: ClosureProof[];

  closedBy: string;

  closedAt: string;

  createdAt: string;
  updatedAt: string;
}

export interface VisitClosureData {
  visitCompleted: boolean;

  customerAvailable: boolean;

  issueObserved?: string;

  recommendation?: string;
}

export interface PartClosureData {
  partName: string;

  partCode?: string;

  quantity: number;

  oldPartReturned: boolean;

  replacementSuccessful: boolean;

  serialNumber?: string;
}

export interface ServiceClosureData {
  workPerformed: string;

  issueResolved: boolean;

  testingCompleted: boolean;

  customerSatisfied: boolean;

  serviceCharge?: number;
}

export interface InstallationClosureData {
  installationCompleted: boolean;

  productSerialNumber: string;

  installationLocation: string;

  demoProvided: boolean;

  customerTrainingProvided: boolean;
}

export interface UninstallationClosureData {
  uninstallationCompleted: boolean;

  productCondition:
    | "GOOD"
    | "DAMAGED"
    | "PARTIALLY_DAMAGED";

  productCollected: boolean;

  collectionReference?: string;
}

export interface ClosureRecord extends BaseClosure {
  visitData?: VisitClosureData;

  partData?: PartClosureData;

  serviceData?: ServiceClosureData;

  installationData?: InstallationClosureData;

  uninstallationData?: UninstallationClosureData;
}

export interface SubmitClosurePayload {
  complaintId: string;

  closureType: ClosureType;

  remarks?: string;

  proofs: ClosureProof[];

  visitData?: VisitClosureData;

  partData?: PartClosureData;

  serviceData?: ServiceClosureData;

  installationData?: InstallationClosureData;

  uninstallationData?: UninstallationClosureData;
}