export type AllocationStatus =
  | "PENDING"
  | "ASSIGNED"
  | "REASSIGNED"
  | "FAILED";

export interface ComplaintAllocationInfo {
  id: string;
  complaintNumber: string;

  customerName: string;
  customerPhone: string;

  city: string;

  productId: string;
  productName: string;

  category: string;

  priority: string;

  currentDealerId?: string;
  currentDealerName?: string;

  createdAt: string;
}

export interface EligibleDealer {
  id: string;

  dealerCode: string;

  name: string;

  city: string;

  phone: string;

  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";

  supportedProducts: string[];

  totalCapacity: number;

  usedCapacity: number;

  availableCapacity: number;

  cancellationRate: number;

  slaCompliance: number;

  performanceScore: number;

  completedComplaints: number;

  cityMatched: boolean;

  productMatched: boolean;

  capacityAvailable: boolean;

  eligible: boolean;

  recommendationScore: number;

  recommendationReasons: string[];
}

export interface AllocationResult {
  complaintId: string;

  dealerId: string;

  dealerName: string;

  status: AllocationStatus;

  assignedAt: string;

  assignedBy: string;

  allocationType:
    | "AUTO"
    | "MANUAL"
    | "REASSIGNMENT";
}

export interface AllocationHistoryItem {
  id: string;

  complaintId: string;

  complaintNumber: string;

  previousDealerId?: string;

  previousDealerName?: string;

  newDealerId: string;

  newDealerName: string;

  allocationType:
    | "AUTO"
    | "MANUAL"
    | "REASSIGNMENT";

  reason: string;

  performedBy: string;

  performedAt: string;
}

export interface ReassignDealerPayload {
  complaintId: string;

  dealerId: string;

  reason: string;

  remarks?: string;
}