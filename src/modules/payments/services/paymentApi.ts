import type {
  Payment,
  PaymentSummaryData,
  RecordPaymentPayload,
} from "../types/payment.types";

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

let payments: Payment[] = [
  {
    id: "PAY-001",

    paymentNumber:
      "PAY-2026-0001",

    dealerId: "DLR-002",

    dealer: dealers[1],

    amount: 3000,

    paymentMethod:
      "BANK_TRANSFER",

    status: "SUCCESS",

    transactionReference:
      "TXN987654321",

    bankReference:
      "UTR123456789",

    paymentDate:
      "2026-08-25",

    ledgerTransactionId:
      "LED-003",

    recordedBy:
      "Accounts Manager",

    approvedBy:
      "Finance Manager",

    approvedAt:
      "2026-08-25T19:00:00",

    remarks:
      "Weekly dealer settlement",

    createdAt:
      "2026-08-25T18:30:00",

    updatedAt:
      "2026-08-25T19:00:00",
  },

  {
    id: "PAY-002",

    paymentNumber:
      "PAY-2026-0002",

    dealerId: "DLR-001",

    dealer: dealers[0],

    amount: 1416,

    paymentMethod:
      "NEFT",

    status: "PENDING",

    transactionReference:
      "NEFT-223344",

    paymentDate:
      "2026-08-26",

    recordedBy:
      "Accounts User",

    remarks:
      "Bill settlement",

    createdAt:
      "2026-08-26T08:00:00",

    updatedAt:
      "2026-08-26T08:00:00",
  },

  {
    id: "PAY-003",

    paymentNumber:
      "PAY-2026-0003",

    dealerId: "DLR-003",

    dealer: dealers[2],

    amount: 4500,

    paymentMethod:
      "RTGS",

    status: "FAILED",

    transactionReference:
      "RTGS-998877",

    paymentDate:
      "2026-08-24",

    recordedBy:
      "Accounts User",

    failureReason:
      "Bank transaction failed",

    createdAt:
      "2026-08-24T15:00:00",

    updatedAt:
      "2026-08-24T15:10:00",
  },
];

export async function getPayments() {
  await delay();

  return [...payments].sort(
    (a, b) =>
      new Date(
        b.createdAt
      ).getTime() -
      new Date(
        a.createdAt
      ).getTime()
  );
}

export async function getPaymentById(
  id: string
) {
  await delay();

  return payments.find(
    (payment) =>
      payment.id === id
  );
}

export async function getDealerPayments(
  dealerId: string
) {
  await delay();

  return payments.filter(
    (payment) =>
      payment.dealerId ===
      dealerId
  );
}

export async function recordPayment(
  payload: RecordPaymentPayload
) {
  await delay();

  const dealer =
    dealers.find(
      (dealer) =>
        dealer.id ===
        payload.dealerId
    );

  if (!dealer) {
    throw new Error(
      "Dealer not found"
    );
  }

  if (
    !payload.amount ||
    payload.amount <= 0
  ) {
    throw new Error(
      "Payment amount must be greater than zero"
    );
  }

  const now =
    new Date().toISOString();

  const payment: Payment = {
    id: `PAY-${Date.now()}`,

    paymentNumber:
      `PAY-2026-${String(
        payments.length + 1
      ).padStart(4, "0")}`,

    dealerId:
      dealer.id,

    dealer,

    amount:
      payload.amount,

    paymentMethod:
      payload.paymentMethod,

    status: "PENDING",

    transactionReference:
      payload.transactionReference,

    bankReference:
      payload.bankReference,

    chequeNumber:
      payload.chequeNumber,

    paymentDate:
      payload.paymentDate,

    remarks:
      payload.remarks,

    recordedBy:
      "Current Accounts User",

    createdAt: now,

    updatedAt: now,
  };

  payments = [
    payment,
    ...payments,
  ];

  return payment;
}

export async function markPaymentSuccessful(
  paymentId: string
) {
  await delay();

  const payment =
    payments.find(
      (item) =>
        item.id === paymentId
    );

  if (!payment) {
    throw new Error(
      "Payment not found"
    );
  }

  payment.status =
    "SUCCESS";

  payment.approvedBy =
    "Finance Manager";

  payment.approvedAt =
    new Date().toISOString();

  payment.updatedAt =
    new Date().toISOString();

  return payment;
}

export async function markPaymentFailed(
  paymentId: string,
  reason: string
) {
  await delay();

  const payment =
    payments.find(
      (item) =>
        item.id === paymentId
    );

  if (!payment) {
    throw new Error(
      "Payment not found"
    );
  }

  payment.status =
    "FAILED";

  payment.failureReason =
    reason;

  payment.updatedAt =
    new Date().toISOString();

  return payment;
}

export async function getPaymentSummary(): Promise<PaymentSummaryData> {
  await delay();

  const successful =
    payments.filter(
      (payment) =>
        payment.status ===
        "SUCCESS"
    );

  const pending =
    payments.filter(
      (payment) =>
        payment.status ===
          "PENDING" ||
        payment.status ===
          "PROCESSING"
    );

  const failed =
    payments.filter(
      (payment) =>
        payment.status ===
        "FAILED"
    );

  return {
    totalPayments:
      payments.length,

    successfulPayments:
      successful.length,

    pendingPayments:
      pending.length,

    failedPayments:
      failed.length,

    totalPaidAmount:
      successful.reduce(
        (sum, payment) =>
          sum +
          payment.amount,
        0
      ),

    pendingAmount:
      pending.reduce(
        (sum, payment) =>
          sum +
          payment.amount,
        0
      ),
  };
}

export async function searchPaymentDealers(
  query: string
) {
  await delay(150);

  const search =
    query
      .trim()
      .toLowerCase();

  if (!search) {
    return [];
  }

  return dealers
    .filter(
      (dealer) =>
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
    )
    .slice(0, 10);
}