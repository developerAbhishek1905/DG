import type {
  CorrectionRequestPayload,
  RejectVerificationPayload,
  VerificationRecord,
  VerificationSLAStatus,
  VerifyComplaintPayload,
} from "../types/verification.types";

const delay = (ms = 300) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

function calculateSLAStatus(
  deadline: string
): VerificationSLAStatus {
  const now =
    Date.now();

  const end =
    new Date(
      deadline
    ).getTime();

  const remaining =
    end - now;

  if (remaining <= 0) {
    return "BREACHED";
  }

  const warningLimit =
    2 * 60 * 60 * 1000;

  if (
    remaining <=
    warningLimit
  ) {
    return "WARNING";
  }

  return "SAFE";
}

let verificationRecords: VerificationRecord[] =
  [
    {
      id: "VER-001",

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

      closure: {
        closureId:
          "CLO-001",

        closureType:
          "SERVICE",

        submittedAt:
          "2026-08-25T15:30:00",

        submittedBy:
          "FastFix Technician",

        remarks:
          "Cooling issue resolved successfully.",

        workSummary:
          "Cleaned filters and checked refrigerant pressure.",

        amount: 850,

        proofs: [
          {
            id:
              "PRF-001",

            name:
              "service-proof.jpg",

            type:
              "image/jpeg",

            size:
              240000,
          },
        ],
      },

      status:
        "PENDING",

      priority:
        "HIGH",

      submittedAt:
        "2026-08-25T15:30:00",

      verificationDeadline:
        "2026-08-25T23:30:00",

      slaStatus:
        "SAFE",

      correctionCount: 0,

      createdAt:
        "2026-08-25T15:30:00",

      updatedAt:
        "2026-08-25T15:30:00",
    },

    {
      id: "VER-002",

      complaintId:
        "CMP-002",

      complaintNumber:
        "CMP-2026-0002",

      customer: {
        id:
          "CUS-002",

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
      },

      productName:
        "Washing Machine",

      closure: {
        closureId:
          "CLO-002",

        closureType:
          "PART",

        submittedAt:
          "2026-08-25T13:00:00",

        submittedBy:
          "ABC Technician",

        remarks:
          "Drain motor replaced.",

        workSummary:
          "Old drain motor replaced and tested.",

        proofs: [
          {
            id:
              "PRF-002",

            name:
              "old-part.jpg",

            type:
              "image/jpeg",

            size:
              180000,
          },
        ],
      },

      status:
        "IN_REVIEW",

      priority:
        "MEDIUM",

      submittedAt:
        "2026-08-25T13:00:00",

      verificationDeadline:
        "2026-08-25T22:00:00",

      slaStatus:
        "WARNING",

      assignedVerifier:
        "DG Agent",

      correctionCount: 0,

      createdAt:
        "2026-08-25T13:00:00",

      updatedAt:
        "2026-08-25T19:00:00",
    },

    {
      id: "VER-003",

      complaintId:
        "CMP-003",

      complaintNumber:
        "CMP-2026-0003",

      customer: {
        id:
          "CUS-003",

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

      closure: {
        closureId:
          "CLO-003",

        closureType:
          "SERVICE",

        submittedAt:
          "2026-08-24T14:00:00",

        submittedBy:
          "Reliable Technician",

        workSummary:
          "Cooling system checked and thermostat replaced.",

        proofs: [],
      },

      status:
        "CORRECTION_REQUIRED",

      priority:
        "HIGH",

      submittedAt:
        "2026-08-24T14:00:00",

      verificationDeadline:
        "2026-08-25T17:00:00",

      slaStatus:
        "BREACHED",

      correctionRequestedBy:
        "DG Manager",

      correctionRequestedAt:
        "2026-08-25T12:00:00",

      correctionReason:
        "Proof image of replaced thermostat is missing.",

      correctionCount: 1,

      createdAt:
        "2026-08-24T14:00:00",

      updatedAt:
        "2026-08-25T12:00:00",
    },
  ];

export async function getVerificationQueue() {
  await delay();

  verificationRecords =
    verificationRecords.map(
      (record) => ({
        ...record,

        slaStatus: [
          "VERIFIED",
          "REJECTED",
        ].includes(
          record.status
        )
          ? "COMPLETED"
          : calculateSLAStatus(
              record.verificationDeadline
            ),
      })
    );

  return [
    ...verificationRecords,
  ];
}

export async function getVerificationById(
  id: string
) {
  await delay();

  return verificationRecords.find(
    (record) =>
      record.id === id
  );
}

export async function startVerification(
  id: string
) {
  await delay();

  const record =
    verificationRecords.find(
      (item) =>
        item.id === id
    );

  if (!record) {
    throw new Error(
      "Verification record not found"
    );
  }

  if (
    record.status !==
    "PENDING"
  ) {
    return record;
  }

  record.status =
    "IN_REVIEW";

  record.assignedVerifier =
    "Current DG User";

  record.updatedAt =
    new Date().toISOString();

  return record;
}

export async function verifyComplaint(
  payload: VerifyComplaintPayload
) {
  await delay();

  const record =
    verificationRecords.find(
      (item) =>
        item.id ===
        payload.verificationId
    );

  if (!record) {
    throw new Error(
      "Verification record not found"
    );
  }

  if (
    !payload.proofVerified
  ) {
    throw new Error(
      "Proof verification is required"
    );
  }

  if (
    !payload.workVerified
  ) {
    throw new Error(
      "Work verification is required"
    );
  }

  record.status =
    "VERIFIED";

  record.slaStatus =
    "COMPLETED";

  record.verifiedBy =
    "Current DG User";

  record.verifiedAt =
    new Date().toISOString();

  record.verificationRemarks =
    payload.remarks;

  record.updatedAt =
    new Date().toISOString();

  return record;
}

export async function rejectVerification(
  payload: RejectVerificationPayload
) {
  await delay();

  const record =
    verificationRecords.find(
      (item) =>
        item.id ===
        payload.verificationId
    );

  if (!record) {
    throw new Error(
      "Verification record not found"
    );
  }

  record.status =
    "REJECTED";

  record.slaStatus =
    "COMPLETED";

  record.rejectionReason =
    payload.reason;

  record.verificationRemarks =
    payload.remarks;

  record.rejectedBy =
    "Current DG User";

  record.rejectedAt =
    new Date().toISOString();

  record.updatedAt =
    new Date().toISOString();

  return record;
}

export async function requestCorrection(
  payload: CorrectionRequestPayload
) {
  await delay();

  const record =
    verificationRecords.find(
      (item) =>
        item.id ===
        payload.verificationId
    );

  if (!record) {
    throw new Error(
      "Verification record not found"
    );
  }

  record.status =
    "CORRECTION_REQUIRED";

  record.correctionReason =
    [
      payload.reason,

      ...payload.requiredCorrections,
    ].join(" - ");

  record.correctionRequestedBy =
    "Current DG User";

  record.correctionRequestedAt =
    new Date().toISOString();

  record.correctionCount +=
    1;

  record.updatedAt =
    new Date().toISOString();

  return record;
}