import type {
  ApproveCancellationPayload,
  CancellationReasonType,
  CancellationRequest,
  CreateCancellationPayload,
  ReassignCancellationPayload,
  RejectCancellationPayload,
  VerifyCustomerPayload,
} from "../types/cancellation.types";

const delay = (ms = 300) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export const CANCELLATION_REASON_LABELS: Record<
  CancellationReasonType,
  string
> = {
  CUSTOMER_REQUEST:
    "Customer Requested Cancellation",

  CUSTOMER_UNAVAILABLE:
    "Customer Unavailable",

  WRONG_COMPLAINT:
    "Wrong Complaint",

  DUPLICATE_COMPLAINT:
    "Duplicate Complaint",

  DEALER_UNAVAILABLE:
    "Dealer Unavailable",

  OUT_OF_SERVICE_AREA:
    "Out of Service Area",

  PRODUCT_NOT_SUPPORTED:
    "Product Not Supported",

  SERVICE_NOT_REQUIRED:
    "Service No Longer Required",

  OTHER:
    "Other",
};

let cancellations: CancellationRequest[] =
  [
    {
      id: "CAN-001",

      complaintId:
        "CMP-001",

      complaintNumber:
        "CMP-2026-0001",

      customer: {
        id: "CUS-001",

        name:
          "Rahul Sharma",

        phone:
          "9876543210",

        city:
          "Indore",
      },

      dealer: {
        id:
          "DLR-002",

        name:
          "FastFix Appliances",

        dealerCode:
          "DLR-002",

        phone:
          "9876500001",
      },

      productName:
        "Air Conditioner",

      reason:
        "CUSTOMER_REQUEST",

      reasonLabel:
        "Customer Requested Cancellation",

      description:
        "Customer informed dealer that service is no longer required.",

      requestedBy:
        "FastFix Appliances",

      requestedByRole:
        "DEALER",

      requestedAt:
        "2026-08-25T10:00:00",

      status:
        "PENDING",

      verification: {
        status:
          "NOT_VERIFIED",
      },

      createdAt:
        "2026-08-25T10:00:00",

      updatedAt:
        "2026-08-25T10:00:00",
    },

    {
      id: "CAN-002",

      complaintId:
        "CMP-002",

      complaintNumber:
        "CMP-2026-0002",

      customer: {
        id: "CUS-002",

        name:
          "Priya Verma",

        phone:
          "9988776655",

        city:
          "Indore",
      },

      dealer: {
        id:
          "DLR-001",

        name:
          "ABC Service Center",

        dealerCode:
          "DLR-001",

        phone:
          "9876500000",
      },

      productName:
        "Washing Machine",

      reason:
        "DEALER_UNAVAILABLE",

      reasonLabel:
        "Dealer Unavailable",

      description:
        "Dealer cannot support the request within SLA.",

      requestedBy:
        "ABC Service Center",

      requestedByRole:
        "DEALER",

      requestedAt:
        "2026-08-24T12:30:00",

      status:
        "VERIFIED",

      verification: {
        status:
          "VERIFIED",

        verifiedBy:
          "DG Agent",

        verifiedAt:
          "2026-08-24T13:00:00",

        customerConfirmedCancellation:
          false,

        verificationMethod:
          "CALL",

        remarks:
          "Customer still requires service and agreed to dealer reassignment.",
      },

      createdAt:
        "2026-08-24T12:30:00",

      updatedAt:
        "2026-08-24T13:00:00",
    },

    {
      id: "CAN-003",

      complaintId:
        "CMP-003",

      complaintNumber:
        "CMP-2026-0003",

      customer: {
        id: "CUS-003",

        name:
          "Amit Jain",

        phone:
          "9898989898",

        city:
          "Bhopal",
      },

      dealer: {
        id:
          "DLR-003",

        name:
          "Reliable Electronics",

        dealerCode:
          "DLR-003",
      },

      productName:
        "Refrigerator",

      reason:
        "DUPLICATE_COMPLAINT",

      reasonLabel:
        "Duplicate Complaint",

      requestedBy:
        "DG Team",

      requestedByRole:
        "DG_TEAM",

      requestedAt:
        "2026-08-23T09:00:00",

      status:
        "APPROVED",

      verification: {
        status:
          "VERIFIED",

        verifiedBy:
          "DG Agent",

        verifiedAt:
          "2026-08-23T09:30:00",

        customerConfirmedCancellation:
          true,

        verificationMethod:
          "CALL",
      },

      approvalRemarks:
        "Duplicate complaint confirmed.",

      approvedBy:
        "DG Manager",

      approvedAt:
        "2026-08-23T10:00:00",

      createdAt:
        "2026-08-23T09:00:00",

      updatedAt:
        "2026-08-23T10:00:00",
    },
  ];

export async function getCancellationRequests() {
  await delay();

  return [...cancellations];
}

export async function getCancellationById(
  id: string
) {
  await delay();

  return cancellations.find(
    (item) =>
      item.id === id
  );
}

export async function createCancellationRequest(
  payload: CreateCancellationPayload
) {
  await delay();

  const now =
    new Date().toISOString();

  const request: CancellationRequest =
    {
      id: `CAN-${String(
        cancellations.length +
          1
      ).padStart(3, "0")}`,

      complaintId:
        payload.complaintId,

      complaintNumber:
        payload.complaintId,

      customer: {
        id:
          "CUS-MOCK",

        name:
          "Mock Customer",

        phone:
          "9999999999",

        city:
          "Indore",
      },

      dealer: {
        id:
          "DLR-MOCK",

        name:
          "Mock Dealer",

        dealerCode:
          "DLR-MOCK",
      },

      productName:
        "Mock Product",

      reason:
        payload.reason,

      reasonLabel:
        CANCELLATION_REASON_LABELS[
          payload.reason
        ],

      description:
        payload.description,

      requestedBy:
        "Current User",

      requestedByRole:
        "DG_TEAM",

      requestedAt:
        now,

      status:
        "PENDING",

      verification: {
        status:
          "NOT_VERIFIED",
      },

      createdAt:
        now,

      updatedAt:
        now,
    };

  cancellations = [
    request,
    ...cancellations,
  ];

  return request;
}

export async function verifyCancellationCustomer(
  payload: VerifyCustomerPayload
) {
  await delay();

  const request =
    cancellations.find(
      (item) =>
        item.id ===
        payload.cancellationId
    );

  if (!request) {
    throw new Error(
      "Cancellation request not found"
    );
  }

  request.verification = {
    status:
      "VERIFIED",

    verifiedBy:
      "DG Agent",

    verifiedAt:
      new Date().toISOString(),

    customerConfirmedCancellation:
      payload.customerConfirmedCancellation,

    verificationMethod:
      payload.verificationMethod,

    remarks:
      payload.remarks,
  };

  request.status =
    "VERIFIED";

  request.updatedAt =
    new Date().toISOString();

  return request;
}

export async function approveCancellation(
  payload: ApproveCancellationPayload
) {
  await delay();

  const request =
    cancellations.find(
      (item) =>
        item.id ===
        payload.cancellationId
    );

  if (!request) {
    throw new Error(
      "Cancellation request not found"
    );
  }

  if (
    request.verification.status !==
    "VERIFIED"
  ) {
    throw new Error(
      "Customer verification is required before approval"
    );
  }

  request.status =
    "APPROVED";

  request.approvalRemarks =
    payload.remarks;

  request.approvedBy =
    "DG Manager";

  request.approvedAt =
    new Date().toISOString();

  request.updatedAt =
    new Date().toISOString();

  return request;
}

export async function rejectCancellation(
  payload: RejectCancellationPayload
) {
  await delay();

  const request =
    cancellations.find(
      (item) =>
        item.id ===
        payload.cancellationId
    );

  if (!request) {
    throw new Error(
      "Cancellation request not found"
    );
  }

  request.status =
    "REJECTED";

  request.rejectionReason =
    payload.reason;

  request.rejectedBy =
    "DG Manager";

  request.rejectedAt =
    new Date().toISOString();

  request.updatedAt =
    new Date().toISOString();

  return request;
}

export async function reassignAfterCancellation(
  payload: ReassignCancellationPayload
) {
  await delay();

  const request =
    cancellations.find(
      (item) =>
        item.id ===
        payload.cancellationId
    );

  if (!request) {
    throw new Error(
      "Cancellation request not found"
    );
  }

  request.status =
    "REASSIGNED";

  request.reassignedDealer =
    {
      id:
        payload.dealerId,

      name:
        "Selected Dealer",

      dealerCode:
        payload.dealerId,
    };

  request.updatedAt =
    new Date().toISOString();

  return request;
}