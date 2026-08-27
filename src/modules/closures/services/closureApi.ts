import type {
  ClosureRecord,
  SubmitClosurePayload,
} from "../types/closure.types";

const delay = (ms = 300) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

let closures: ClosureRecord[] = [
  {
    id: "CLO-001",

    complaintId: "CMP-001",

    complaintNumber:
      "CMP-2026-0001",

    customer: {
      id: "CUS-001",
      name: "Rahul Sharma",
      phone: "9876543210",
      city: "Indore",
    },

    dealer: {
      id: "DLR-002",
      name:
        "FastFix Appliances",
      dealerCode:
        "DLR-002",
    },

    closureType:
      "SERVICE",

    status:
      "SUBMITTED",

    remarks:
      "Cooling issue resolved.",

    serviceData: {
      workPerformed:
        "Cleaned filters and checked refrigerant pressure.",

      issueResolved:
        true,

      testingCompleted:
        true,

      customerSatisfied:
        true,

      serviceCharge:
        850,
    },

    proofs: [
      {
        id: "PRF-001",
        name:
          "service-proof.jpg",
        type:
          "image/jpeg",
        size:
          240000,
      },
    ],

    closedBy:
      "FastFix Technician",

    closedAt:
      "2026-08-25T15:30:00",

    createdAt:
      "2026-08-25T15:30:00",

    updatedAt:
      "2026-08-25T15:30:00",
  },

  {
    id: "CLO-002",

    complaintId:
      "CMP-002",

    complaintNumber:
      "CMP-2026-0002",

    customer: {
      id: "CUS-002",
      name: "Priya Verma",
      phone: "9988776655",
      city: "Indore",
    },

    dealer: {
      id: "DLR-001",
      name:
        "ABC Service Center",
      dealerCode:
        "DLR-001",
    },

    closureType:
      "PART",

    status:
      "VERIFIED",

    remarks:
      "Drain motor replaced.",

    partData: {
      partName:
        "Drain Motor",

      partCode:
        "WM-DM-101",

      quantity: 1,

      oldPartReturned:
        true,

      replacementSuccessful:
        true,

      serialNumber:
        "SN-123456",
    },

    proofs: [],

    closedBy:
      "ABC Technician",

    closedAt:
      "2026-08-24T16:00:00",

    createdAt:
      "2026-08-24T16:00:00",

    updatedAt:
      "2026-08-24T18:00:00",
  },
];

export async function getClosures() {
  await delay();

  return [...closures];
}

export async function getClosureById(
  id: string
) {
  await delay();

  return closures.find(
    (closure) =>
      closure.id === id
  );
}

export async function getComplaintClosureContext(
  complaintId: string
) {
  await delay();

  return {
    complaintId,

    complaintNumber:
      complaintId,

    customer: {
      id: "CUS-MOCK",
      name:
        "Mock Customer",
      phone:
        "9999999999",
      city:
        "Indore",
    },

    dealer: {
      id: "DLR-MOCK",
      name:
        "Mock Dealer",
      dealerCode:
        "DLR-MOCK",
    },
  };
}

export async function submitClosure(
  payload: SubmitClosurePayload
) {
  await delay();

  const context =
    await getComplaintClosureContext(
      payload.complaintId
    );

  const now =
    new Date().toISOString();

  const closure: ClosureRecord =
    {
      id: `CLO-${String(
        closures.length + 1
      ).padStart(3, "0")}`,

      complaintId:
        payload.complaintId,

      complaintNumber:
        context.complaintNumber,

      customer:
        context.customer,

      dealer:
        context.dealer,

      closureType:
        payload.closureType,

      status:
        "SUBMITTED",

      remarks:
        payload.remarks,

      proofs:
        payload.proofs,

      visitData:
        payload.visitData,

      partData:
        payload.partData,

      serviceData:
        payload.serviceData,

      installationData:
        payload.installationData,

      uninstallationData:
        payload.uninstallationData,

      closedBy:
        "Current User",

      closedAt:
        now,

      createdAt:
        now,

      updatedAt:
        now,
    };

  closures = [
    closure,
    ...closures,
  ];

  return closure;
}