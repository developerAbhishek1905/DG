import type {
  AllocationHistoryItem,
  AllocationResult,
  ComplaintAllocationInfo,
  EligibleDealer,
  ReassignDealerPayload,
} from "../types/allocation.types";

const delay = (ms = 350) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

const complaint: ComplaintAllocationInfo = {
  id: "CMP-001",

  complaintNumber: "CMP-2026-0001",

  customerName: "Rahul Sharma",

  customerPhone: "9876543210",

  city: "Indore",

  productId: "PRD-001",

  productName: "Air Conditioner",

  category: "SERVICE",

  priority: "HIGH",

  currentDealerId: "DLR-001",

  currentDealerName: "ABC Service Center",

  createdAt: "2026-08-25T09:30:00",
};

let eligibleDealers: EligibleDealer[] = [
  {
    id: "DLR-001",

    dealerCode: "DLR-001",

    name: "ABC Service Center",

    city: "Indore",

    phone: "9876500000",

    status: "ACTIVE",

    supportedProducts: [
      "Air Conditioner",
      "Washing Machine",
    ],

    totalCapacity: 30,

    usedCapacity: 18,

    availableCapacity: 12,

    cancellationRate: 5.9,

    slaCompliance: 94,

    performanceScore: 92,

    completedComplaints: 370,

    cityMatched: true,

    productMatched: true,

    capacityAvailable: true,

    eligible: true,

    recommendationScore: 92,

    recommendationReasons: [
      "City matched",
      "Product supported",
      "12 complaint slots available",
      "Cancellation rate is below average",
      "SLA compliance is 94%",
    ],
  },

  {
    id: "DLR-002",

    dealerCode: "DLR-002",

    name: "FastFix Appliances",

    city: "Indore",

    phone: "9876500001",

    status: "ACTIVE",

    supportedProducts: [
      "Air Conditioner",
      "Refrigerator",
    ],

    totalCapacity: 20,

    usedCapacity: 8,

    availableCapacity: 12,

    cancellationRate: 4.3,

    slaCompliance: 97,

    performanceScore: 95,

    completedComplaints: 280,

    cityMatched: true,

    productMatched: true,

    capacityAvailable: true,

    eligible: true,

    recommendationScore: 98,

    recommendationReasons: [
      "City matched",
      "Product supported",
      "12 complaint slots available",
      "Lowest cancellation rate among eligible dealers",
      "Highest SLA compliance",
    ],
  },

  {
    id: "DLR-003",

    dealerCode: "DLR-003",

    name: "Reliable Electronics",

    city: "Indore",

    phone: "9876500002",

    status: "ACTIVE",

    supportedProducts: [
      "Television",
      "Refrigerator",
    ],

    totalCapacity: 25,

    usedCapacity: 11,

    availableCapacity: 14,

    cancellationRate: 3.8,

    slaCompliance: 93,

    performanceScore: 89,

    completedComplaints: 215,

    cityMatched: true,

    productMatched: false,

    capacityAvailable: true,

    eligible: false,

    recommendationScore: 55,

    recommendationReasons: [
      "City matched",
      "Capacity available",
      "Product is not supported",
    ],
  },

  {
    id: "DLR-004",

    dealerCode: "DLR-004",

    name: "Prime Service Solutions",

    city: "Indore",

    phone: "9876500003",

    status: "ACTIVE",

    supportedProducts: [
      "Air Conditioner",
      "Washing Machine",
    ],

    totalCapacity: 15,

    usedCapacity: 15,

    availableCapacity: 0,

    cancellationRate: 2.9,

    slaCompliance: 96,

    performanceScore: 91,

    completedComplaints: 180,

    cityMatched: true,

    productMatched: true,

    capacityAvailable: false,

    eligible: false,

    recommendationScore: 60,

    recommendationReasons: [
      "City matched",
      "Product supported",
      "No available capacity",
    ],
  },

  {
    id: "DLR-005",

    dealerCode: "DLR-005",

    name: "Smart Care Services",

    city: "Bhopal",

    phone: "9876500004",

    status: "ACTIVE",

    supportedProducts: [
      "Air Conditioner",
    ],

    totalCapacity: 20,

    usedCapacity: 5,

    availableCapacity: 15,

    cancellationRate: 2.4,

    slaCompliance: 98,

    performanceScore: 96,

    completedComplaints: 320,

    cityMatched: false,

    productMatched: true,

    capacityAvailable: true,

    eligible: false,

    recommendationScore: 58,

    recommendationReasons: [
      "Product supported",
      "Capacity available",
      "Dealer city does not match complaint city",
    ],
  },
];

let allocationHistory: AllocationHistoryItem[] = [
  {
    id: "ALLOC-H-001",

    complaintId: "CMP-001",

    complaintNumber: "CMP-2026-0001",

    newDealerId: "DLR-001",

    newDealerName: "ABC Service Center",

    allocationType: "AUTO",

    reason:
      "Automatically selected using city, product, capacity and cancellation rate.",

    performedBy: "System",

    performedAt: "2026-08-25T09:32:00",
  },

  {
    id: "ALLOC-H-002",

    complaintId: "CMP-002",

    complaintNumber: "CMP-2026-0002",

    previousDealerId: "DLR-004",

    previousDealerName: "Prime Service Solutions",

    newDealerId: "DLR-002",

    newDealerName: "FastFix Appliances",

    allocationType: "REASSIGNMENT",

    reason: "Original dealer did not respond within SLA.",

    performedBy: "DG Admin",

    performedAt: "2026-08-24T15:10:00",
  },
];

export async function getAllocationComplaint() {
  await delay();

  return complaint;
}

export async function getEligibleDealers() {
  await delay();

  return [...eligibleDealers];
}

export async function getRecommendedDealer() {
  await delay();

  const eligible = eligibleDealers.filter(
    (dealer) => dealer.eligible
  );

  if (!eligible.length) {
    return undefined;
  }

  return [...eligible].sort(
    (a, b) => {
      if (
        a.cancellationRate !==
        b.cancellationRate
      ) {
        return (
          a.cancellationRate -
          b.cancellationRate
        );
      }

      return (
        b.recommendationScore -
        a.recommendationScore
      );
    }
  )[0];
}

export async function assignDealer(
  complaintId: string,
  dealerId: string
): Promise<AllocationResult> {
  await delay();

  const dealer =
    eligibleDealers.find(
      (item) => item.id === dealerId
    );

  if (!dealer) {
    throw new Error("Dealer not found");
  }

  if (!dealer.eligible) {
    throw new Error(
      "Selected dealer is not eligible"
    );
  }

  allocationHistory = [
    {
      id: `ALLOC-H-${Date.now()}`,

      complaintId,

      complaintNumber:
        complaint.complaintNumber,

      newDealerId: dealer.id,

      newDealerName: dealer.name,

      allocationType: "MANUAL",

      reason:
        "Dealer manually selected from eligible dealer list.",

      performedBy: "DG Admin",

      performedAt:
        new Date().toISOString(),
    },

    ...allocationHistory,
  ];

  return {
    complaintId,

    dealerId: dealer.id,

    dealerName: dealer.name,

    status: "ASSIGNED",

    assignedAt:
      new Date().toISOString(),

    assignedBy: "DG Admin",

    allocationType: "MANUAL",
  };
}

export async function reassignDealer(
  payload: ReassignDealerPayload
): Promise<AllocationResult> {
  await delay();

  const newDealer =
    eligibleDealers.find(
      (dealer) =>
        dealer.id === payload.dealerId
    );

  if (!newDealer) {
    throw new Error("Dealer not found");
  }

  if (!newDealer.eligible) {
    throw new Error(
      "Dealer is not currently eligible"
    );
  }

  allocationHistory = [
    {
      id: `ALLOC-H-${Date.now()}`,

      complaintId:
        payload.complaintId,

      complaintNumber:
        complaint.complaintNumber,

      previousDealerId:
        complaint.currentDealerId,

      previousDealerName:
        complaint.currentDealerName,

      newDealerId:
        newDealer.id,

      newDealerName:
        newDealer.name,

      allocationType:
        "REASSIGNMENT",

      reason: payload.reason,

      performedBy: "DG Admin",

      performedAt:
        new Date().toISOString(),
    },

    ...allocationHistory,
  ];

  complaint.currentDealerId =
    newDealer.id;

  complaint.currentDealerName =
    newDealer.name;

  return {
    complaintId:
      payload.complaintId,

    dealerId:
      newDealer.id,

    dealerName:
      newDealer.name,

    status: "REASSIGNED",

    assignedAt:
      new Date().toISOString(),

    assignedBy: "DG Admin",

    allocationType:
      "REASSIGNMENT",
  };
}

export async function getAllocationHistory() {
  await delay();

  return [...allocationHistory];
}