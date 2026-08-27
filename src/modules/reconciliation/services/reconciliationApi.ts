import type {
  Reconciliation,
  ReconciliationSummaryData,
  ReconcilePayload,
} from "../types/reconciliation.types";

const delay = (ms = 300) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

const dealers = [
  {
    id: "DLR-001",
    name: "ABC Service Center",
    dealerCode: "DLR-001",
    phone: "9876500000",
    city: "Indore",
  },

  {
    id: "DLR-002",
    name: "FastFix Appliances",
    dealerCode: "DLR-002",
    phone: "9876500001",
    city: "Indore",
  },

  {
    id: "DLR-003",
    name: "Reliable Electronics",
    dealerCode: "DLR-003",
    phone: "9876500002",
    city: "Bhopal",
  },

  {
    id: "DLR-004",
    name: "Smart Care Services",
    dealerCode: "DLR-004",
    phone: "9876500003",
    city: "Ujjain",
  },
];

let reconciliations: Reconciliation[] = [
  {
    id: "REC-001",

    reconciliationNumber:
      "REC-2026-0001",

    dealerId: "DLR-001",

    dealer: dealers[0],

    periodFrom:
      "2026-08-01",

    periodTo:
      "2026-08-25",

    openingBalance: 5000,

    totalBillAmount: 15000,

    totalLedgerCredits: 15000,

    totalPayments: 10000,

    totalLedgerDebits: 10000,

    expectedClosingBalance:
      10000,

    actualClosingBalance:
      10000,

    difference: 0,

    differenceType: "NONE",

    status: "MATCHED",

    createdBy: "System",

    createdAt:
      "2026-08-25T22:00:00",

    updatedAt:
      "2026-08-25T22:00:00",
  },

  {
    id: "REC-002",

    reconciliationNumber:
      "REC-2026-0002",

    dealerId: "DLR-002",

    dealer: dealers[1],

    periodFrom:
      "2026-08-01",

    periodTo:
      "2026-08-25",

    openingBalance: 3000,

    totalBillAmount: 22000,

    totalLedgerCredits: 23000,

    totalPayments: 12000,

    totalLedgerDebits: 12000,

    expectedClosingBalance:
      13000,

    actualClosingBalance:
      14000,

    difference: 1000,

    differenceType:
      "LEDGER_HIGH",

    status: "MISMATCH",

    remarks:
      "Ledger contains additional credit entry.",

    createdBy: "System",

    createdAt:
      "2026-08-25T22:10:00",

    updatedAt:
      "2026-08-25T22:10:00",
  },

  {
    id: "REC-003",

    reconciliationNumber:
      "REC-2026-0003",

    dealerId: "DLR-003",

    dealer: dealers[2],

    periodFrom:
      "2026-08-01",

    periodTo:
      "2026-08-25",

    openingBalance: 8000,

    totalBillAmount: 30000,

    totalLedgerCredits: 30000,

    totalPayments: 20000,

    totalLedgerDebits: 18000,

    expectedClosingBalance:
      18000,

    actualClosingBalance:
      20000,

    difference: 2000,

    differenceType:
      "PAYMENT_MISSING",

    status: "MISMATCH",

    remarks:
      "Payment recorded but ledger debit missing.",

    createdBy: "System",

    createdAt:
      "2026-08-25T22:20:00",

    updatedAt:
      "2026-08-25T22:20:00",
  },

  {
    id: "REC-004",

    reconciliationNumber:
      "REC-2026-0004",

    dealerId: "DLR-004",

    dealer: dealers[3],

    periodFrom:
      "2026-08-01",

    periodTo:
      "2026-08-25",

    openingBalance: 0,

    totalBillAmount: 8500,

    totalLedgerCredits: 8500,

    totalPayments: 5000,

    totalLedgerDebits: 5000,

    expectedClosingBalance:
      3500,

    actualClosingBalance:
      3500,

    difference: 0,

    differenceType: "NONE",

    status: "PENDING",

    createdBy: "System",

    createdAt:
      "2026-08-25T22:30:00",

    updatedAt:
      "2026-08-25T22:30:00",
  },
];

export async function getReconciliations() {
  await delay();

  return [...reconciliations];
}

export async function getReconciliationById(
  id: string
) {
  await delay();

  return reconciliations.find(
    (item) =>
      item.id === id
  );
}

export async function getReconciliationSummary(): Promise<ReconciliationSummaryData> {
  await delay();

  return {
    totalRecords:
      reconciliations.length,

    matchedRecords:
      reconciliations.filter(
        (item) =>
          item.status ===
          "MATCHED"
      ).length,

    mismatchRecords:
      reconciliations.filter(
        (item) =>
          item.status ===
          "MISMATCH"
      ).length,

    pendingRecords:
      reconciliations.filter(
        (item) =>
          item.status ===
          "PENDING"
      ).length,

    reconciledRecords:
      reconciliations.filter(
        (item) =>
          item.status ===
          "RECONCILED"
      ).length,

    totalExpectedBalance:
      reconciliations.reduce(
        (sum, item) =>
          sum +
          item.expectedClosingBalance,
        0
      ),

    totalActualBalance:
      reconciliations.reduce(
        (sum, item) =>
          sum +
          item.actualClosingBalance,
        0
      ),

    totalDifference:
      reconciliations.reduce(
        (sum, item) =>
          sum +
          Math.abs(
            item.difference
          ),
        0
      ),
  };
}

export async function reconcileDifference(
  payload: ReconcilePayload
) {
  await delay();

  const reconciliation =
    reconciliations.find(
      (item) =>
        item.id ===
        payload.reconciliationId
    );

  if (!reconciliation) {
    throw new Error(
      "Reconciliation record not found"
    );
  }

  reconciliation.status =
    "RECONCILED";

  reconciliation.differenceType =
    payload.differenceType;

  reconciliation.reconciliationNote =
    payload.reconciliationNote;

  reconciliation.reconciledBy =
    "Current Finance User";

  reconciliation.reconciledAt =
    new Date().toISOString();

  reconciliation.updatedAt =
    new Date().toISOString();

  return reconciliation;
}

export async function markAsMatched(
  id: string
) {
  await delay();

  const reconciliation =
    reconciliations.find(
      (item) =>
        item.id === id
    );

  if (!reconciliation) {
    throw new Error(
      "Reconciliation record not found"
    );
  }

  if (
    reconciliation.difference !==
    0
  ) {
    throw new Error(
      "Cannot mark a record with a difference as matched"
    );
  }

  reconciliation.status =
    "MATCHED";

  reconciliation.differenceType =
    "NONE";

  reconciliation.updatedAt =
    new Date().toISOString();

  return reconciliation;
}