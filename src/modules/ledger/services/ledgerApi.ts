import type {
  CreateAdjustmentPayload,
  DealerLedgerSummary,
  LedgerOverviewStats,
  LedgerTransaction,
} from "../types/ledger.types";

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
];

let transactions: LedgerTransaction[] =
  [
    {
      id: "LED-001",

      transactionNumber:
        "TXN-2026-0001",

      dealerId: "DLR-002",

      dealer: dealers[1],

      transactionType:
        "OPENING_BALANCE",

      referenceType:
        "OPENING",

      description:
        "Opening ledger balance",

      credit: 5000,

      debit: 0,

      balance: 5000,

      status: "POSTED",

      transactionDate:
        "2026-08-01T09:00:00",

      createdBy: "System",

      createdAt:
        "2026-08-01T09:00:00",

      updatedAt:
        "2026-08-01T09:00:00",
    },

    {
      id: "LED-002",

      transactionNumber:
        "TXN-2026-0002",

      dealerId: "DLR-002",

      dealer: dealers[1],

      transactionType:
        "BILL_CREDIT",

      referenceType:
        "BILL",

      referenceId:
        "BILL-001",

      referenceNumber:
        "INV-2026-0001",

      complaintId:
        "CMP-001",

      complaintNumber:
        "CMP-2026-0001",

      description:
        "Approved service bill",

      credit: 1003,

      debit: 0,

      balance: 6003,

      status: "POSTED",

      transactionDate:
        "2026-08-25T17:30:00",

      createdBy: "System",

      createdAt:
        "2026-08-25T17:30:00",

      updatedAt:
        "2026-08-25T17:30:00",
    },

    {
      id: "LED-003",

      transactionNumber:
        "TXN-2026-0003",

      dealerId: "DLR-002",

      dealer: dealers[1],

      transactionType:
        "PAYMENT_DEBIT",

      referenceType:
        "PAYMENT",

      referenceId:
        "PAY-001",

      referenceNumber:
        "PAY-2026-0001",

      description:
        "Dealer payment settlement",

      credit: 0,

      debit: 3000,

      balance: 3003,

      status: "POSTED",

      transactionDate:
        "2026-08-25T19:00:00",

      createdBy:
        "Accounts Manager",

      createdAt:
        "2026-08-25T19:00:00",

      updatedAt:
        "2026-08-25T19:00:00",
    },

    {
      id: "LED-004",

      transactionNumber:
        "TXN-2026-0004",

      dealerId: "DLR-001",

      dealer: dealers[0],

      transactionType:
        "BILL_CREDIT",

      referenceType:
        "BILL",

      referenceId:
        "BILL-002",

      referenceNumber:
        "INV-2026-0002",

      complaintId:
        "CMP-002",

      complaintNumber:
        "CMP-2026-0002",

      description:
        "Approved part replacement bill",

      credit: 1416,

      debit: 0,

      balance: 1416,

      status: "POSTED",

      transactionDate:
        "2026-08-24T18:30:00",

      createdBy: "System",

      createdAt:
        "2026-08-24T18:30:00",

      updatedAt:
        "2026-08-24T18:30:00",
    },
  ];

function getDealerTransactions(
  dealerId: string
) {
  return transactions
    .filter(
      (item) =>
        item.dealerId === dealerId
    )
    .sort(
      (a, b) =>
        new Date(
          a.transactionDate
        ).getTime() -
        new Date(
          b.transactionDate
        ).getTime()
    );
}

function recalculateDealerBalance(
  dealerId: string
) {
  const dealerTransactions =
    getDealerTransactions(
      dealerId
    );

  let balance = 0;

  dealerTransactions.forEach(
    (item) => {
      balance +=
        item.credit -
        item.debit;

      item.balance =
        balance;
    }
  );
}

export async function getLedgerTransactions() {
  await delay();

  return [...transactions].sort(
    (a, b) =>
      new Date(
        b.transactionDate
      ).getTime() -
      new Date(
        a.transactionDate
      ).getTime()
  );
}

export async function getLedgerTransactionById(
  id: string
) {
  await delay();

  return transactions.find(
    (item) =>
      item.id === id
  );
}

export async function getDealerLedger(
  dealerId: string
) {
  await delay();

  return getDealerTransactions(
    dealerId
  ).reverse();
}

export async function getDealerLedgerSummary(
  dealerId: string
): Promise<
  DealerLedgerSummary | undefined
> {
  await delay();

  const dealer =
    dealers.find(
      (item) =>
        item.id === dealerId
    );

  if (!dealer) {
    return undefined;
  }

  const dealerTransactions =
    getDealerTransactions(
      dealerId
    );

  const openingBalance =
    dealerTransactions
      .filter(
        (item) =>
          item.transactionType ===
          "OPENING_BALANCE"
      )
      .reduce(
        (sum, item) =>
          sum +
          item.credit -
          item.debit,
        0
      );

  const totalCredits =
    dealerTransactions.reduce(
      (sum, item) =>
        sum + item.credit,
      0
    );

  const totalDebits =
    dealerTransactions.reduce(
      (sum, item) =>
        sum + item.debit,
      0
    );

  const totalPaid =
    dealerTransactions
      .filter(
        (item) =>
          item.transactionType ===
          "PAYMENT_DEBIT"
      )
      .reduce(
        (sum, item) =>
          sum + item.debit,
        0
      );

  const outstandingAmount =
    totalCredits -
    totalDebits;

  return {
    dealer,

    openingBalance,

    totalCredits,

    totalDebits,

    totalPaid,

    outstandingAmount,

    pendingPaymentAmount:
      Math.max(
        outstandingAmount,
        0
      ),

    lastTransactionAt:
      dealerTransactions.at(-1)
        ?.transactionDate,
  };
}

export async function getAllDealerLedgerSummaries() {
  await delay();

  const summaries =
    await Promise.all(
      dealers.map(
        (dealer) =>
          getDealerLedgerSummary(
            dealer.id
          )
      )
    );

  return summaries.filter(
    (
      item
    ): item is DealerLedgerSummary =>
      Boolean(item)
  );
}

export async function getLedgerOverviewStats(): Promise<LedgerOverviewStats> {
  await delay();

  const summaries =
    await getAllDealerLedgerSummaries();

  return {
    totalDealers:
      summaries.length,

    totalOutstanding:
      summaries.reduce(
        (sum, item) =>
          sum +
          item.outstandingAmount,
        0
      ),

    totalCredits:
      transactions.reduce(
        (sum, item) =>
          sum + item.credit,
        0
      ),

    totalPayments:
      transactions
        .filter(
          (item) =>
            item.transactionType ===
            "PAYMENT_DEBIT"
        )
        .reduce(
          (sum, item) =>
            sum + item.debit,
          0
        ),

    overdueOutstanding:
      summaries
        .filter(
          (item) =>
            item.outstandingAmount >
            2000
        )
        .reduce(
          (sum, item) =>
            sum +
            item.outstandingAmount,
          0
        ),
  };
}

export async function createLedgerAdjustment(
  payload: CreateAdjustmentPayload
) {
  await delay();

  const dealer =
    dealers.find(
      (item) =>
        item.id ===
        payload.dealerId
    );

  if (!dealer) {
    throw new Error(
      "Dealer not found"
    );
  }

  const now =
    new Date().toISOString();

  const transaction: LedgerTransaction =
    {
      id: `LED-${Date.now()}`,

      transactionNumber:
        `TXN-${Date.now()}`,

      dealerId:
        dealer.id,

      dealer,

      transactionType:
        payload.adjustmentType ===
        "CREDIT"
          ? "ADJUSTMENT_CREDIT"
          : "ADJUSTMENT_DEBIT",

      referenceType:
        "ADJUSTMENT",

      description:
        payload.reason,

      credit:
        payload.adjustmentType ===
        "CREDIT"
          ? payload.amount
          : 0,

      debit:
        payload.adjustmentType ===
        "DEBIT"
          ? payload.amount
          : 0,

      balance: 0,

      status: "POSTED",

      transactionDate:
        now,

      createdBy:
        "Current Accounts User",

      remarks:
        payload.remarks,

      createdAt:
        now,

      updatedAt:
        now,
    };

  transactions.push(
    transaction
  );

  recalculateDealerBalance(
    dealer.id
  );

  return transaction;
}

export async function searchLedgerDealers(
  query: string
) {
  // Real implementation:
  //
  // GET /api/ledger/dealers/search?q=abc

  const summaries =
    await getAllDealerLedgerSummaries();

  const search =
    query.trim().toLowerCase();

  return summaries
    .filter((item) => {
      const dealer = item.dealer;

      return (
        dealer.name
          .toLowerCase()
          .includes(search) ||
        dealer.dealerCode
          .toLowerCase()
          .includes(search) ||
        dealer.phone
          ?.toLowerCase()
          .includes(search) ||
        dealer.city
          ?.toLowerCase()
          .includes(search)
      );
    })
    .slice(0, 10);
}