import type {
  ApproveBillPayload,
  Bill,
  GenerateBillPayload,
  RateFormData,
  RateMaster,
  RejectBillPayload,
} from "../types/billing.types";

const delay = (ms = 300) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

let rates: RateMaster[] = [
  {
    id: "RATE-001",

    code: "SERVICE-AC",

    closureType:
      "SERVICE",

    serviceName:
      "AC General Service",

    productCategory:
      "Air Conditioner",

    city: "Indore",

    baseRate: 850,

    taxPercentage: 18,

    effectiveFrom:
      "2026-01-01",

    active: true,

    createdAt:
      "2026-01-01T10:00:00",

    updatedAt:
      "2026-01-01T10:00:00",
  },

  {
    id: "RATE-002",

    code:
      "INSTALL-AC",

    closureType:
      "INSTALLATION",

    serviceName:
      "AC Installation",

    productCategory:
      "Air Conditioner",

    city: "Indore",

    baseRate: 1200,

    taxPercentage: 18,

    effectiveFrom:
      "2026-01-01",

    active: true,

    createdAt:
      "2026-01-01T10:00:00",

    updatedAt:
      "2026-01-01T10:00:00",
  },

  {
    id: "RATE-003",

    code:
      "VISIT-GENERAL",

    closureType:
      "VISIT",

    serviceName:
      "Inspection Visit",

    baseRate: 350,

    taxPercentage: 18,

    effectiveFrom:
      "2026-01-01",

    active: true,

    createdAt:
      "2026-01-01T10:00:00",

    updatedAt:
      "2026-01-01T10:00:00",
  },
];

let bills: Bill[] = [
  {
    id: "BILL-001",

    billNumber:
      "INV-2026-0001",

    complaintId:
      "CMP-001",

    complaintNumber:
      "CMP-2026-0001",

    closureId:
      "CLO-001",

    verificationId:
      "VER-001",

    dealer: {
      id: "DLR-002",

      name:
        "FastFix Appliances",

      dealerCode:
        "DLR-002",
    },

    customer: {
      id: "CUS-001",

      name:
        "Rahul Sharma",

      city:
        "Indore",
    },

    closureType:
      "SERVICE",

    lineItems: [
      {
        id: "LINE-001",

        description:
          "AC General Service",

        quantity: 1,

        rate: 850,

        amount: 850,

        taxPercentage: 18,

        taxAmount: 153,

        totalAmount: 1003,
      },
    ],

    subtotal: 850,

    taxAmount: 153,

    totalAmount: 1003,

    status:
      "GENERATED",

    generatedAt:
      "2026-08-25T17:00:00",

    generatedBy:
      "System",

    createdAt:
      "2026-08-25T17:00:00",

    updatedAt:
      "2026-08-25T17:00:00",
  },

  {
    id: "BILL-002",

    billNumber:
      "INV-2026-0002",

    complaintId:
      "CMP-002",

    complaintNumber:
      "CMP-2026-0002",

    closureId:
      "CLO-002",

    verificationId:
      "VER-002",

    dealer: {
      id:
        "DLR-001",

      name:
        "ABC Service Center",

      dealerCode:
        "DLR-001",
    },

    customer: {
      id:
        "CUS-002",

      name:
        "Priya Verma",

      city:
        "Indore",
    },

    closureType:
      "PART",

    lineItems: [
      {
        id: "LINE-002",

        description:
          "Drain Motor Replacement",

        quantity: 1,

        rate: 1200,

        amount: 1200,

        taxPercentage: 18,

        taxAmount: 216,

        totalAmount: 1416,
      },
    ],

    subtotal: 1200,

    taxAmount: 216,

    totalAmount: 1416,

    status:
      "APPROVED",

    generatedAt:
      "2026-08-24T17:00:00",

    generatedBy:
      "System",

    approvedAt:
      "2026-08-24T18:00:00",

    approvedBy:
      "Accounts Manager",

    createdAt:
      "2026-08-24T17:00:00",

    updatedAt:
      "2026-08-24T18:00:00",
  },
];

export async function getBills() {
  await delay();

  return [...bills];
}

export async function getBillById(
  id: string
) {
  await delay();

  return bills.find(
    (bill) =>
      bill.id === id
  );
}

export async function generateBill(
  payload: GenerateBillPayload
) {
  await delay();

  const rate =
    rates.find(
      (item) =>
        item.active
    );

  if (!rate) {
    throw new Error(
      "No active rate found"
    );
  }

  const subtotal =
    rate.baseRate;

  const taxAmount =
    (subtotal *
      rate.taxPercentage) /
    100;

  const totalAmount =
    subtotal +
    taxAmount;

  const now =
    new Date().toISOString();

  const bill: Bill = {
    id: `BILL-${String(
      bills.length + 1
    ).padStart(3, "0")}`,

    billNumber:
      `INV-2026-${String(
        bills.length + 1
      ).padStart(4, "0")}`,

    complaintId:
      payload.complaintId,

    complaintNumber:
      payload.complaintId,

    closureId:
      payload.closureId,

    verificationId:
      payload.verificationId,

    dealer: {
      id: "DLR-MOCK",
      name: "Mock Dealer",
      dealerCode:
        "DLR-MOCK",
    },

    customer: {
      id: "CUS-MOCK",
      name:
        "Mock Customer",
      city: "Indore",
    },

    closureType:
      rate.closureType,

    lineItems: [
      {
        id: `LINE-${Date.now()}`,

        description:
          rate.serviceName,

        quantity: 1,

        rate:
          rate.baseRate,

        amount:
          rate.baseRate,

        taxPercentage:
          rate.taxPercentage,

        taxAmount,

        totalAmount,
      },
    ],

    subtotal,

    taxAmount,

    totalAmount,

    status:
      "GENERATED",

    generatedAt:
      now,

    generatedBy:
      "System",

    createdAt:
      now,

    updatedAt:
      now,
  };

  bills = [
    bill,
    ...bills,
  ];

  return bill;
}

export async function approveBill(
  payload: ApproveBillPayload
) {
  await delay();

  const bill =
    bills.find(
      (item) =>
        item.id ===
        payload.billId
    );

  if (!bill) {
    throw new Error(
      "Bill not found"
    );
  }

  bill.status =
    "APPROVED";

  bill.approvedBy =
    "Current Accounts User";

  bill.approvedAt =
    new Date().toISOString();

  bill.remarks =
    payload.remarks;

  bill.updatedAt =
    new Date().toISOString();

  return bill;
}

export async function rejectBill(
  payload: RejectBillPayload
) {
  await delay();

  const bill =
    bills.find(
      (item) =>
        item.id ===
        payload.billId
    );

  if (!bill) {
    throw new Error(
      "Bill not found"
    );
  }

  bill.status =
    "REJECTED";

  bill.rejectionReason =
    payload.reason;

  bill.rejectedBy =
    "Current Accounts User";

  bill.rejectedAt =
    new Date().toISOString();

  bill.updatedAt =
    new Date().toISOString();

  return bill;
}

export async function getRates() {
  await delay();

  return [...rates];
}

export async function createRate(
  data: RateFormData
) {
  await delay();

  const now =
    new Date().toISOString();

  const rate: RateMaster = {
    id: `RATE-${String(
      rates.length + 1
    ).padStart(3, "0")}`,

    ...data,

    createdAt: now,

    updatedAt: now,
  };

  rates = [
    rate,
    ...rates,
  ];

  return rate;
}

export async function updateRate(
  id: string,
  data: RateFormData
) {
  await delay();

  const index =
    rates.findIndex(
      (rate) =>
        rate.id === id
    );

  if (index === -1) {
    throw new Error(
      "Rate not found"
    );
  }

  rates[index] = {
    ...rates[index],

    ...data,

    updatedAt:
      new Date().toISOString(),
  };

  return rates[index];
}