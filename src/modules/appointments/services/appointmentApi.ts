import type {
  Appointment,
  AppointmentFormData,
  AppointmentStatus,
  RescheduleAppointmentPayload,
} from "../types/appointment.types";

const delay = (ms = 300) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

let appointments: Appointment[] = [
  {
    id: "APT-001",

    complaintId: "CMP-001",

    complaintNumber:
      "CMP-2026-0001",

    customer: {
      id: "CUS-001",

      name:
        "Rahul Sharma",

      phone:
        "9876543210",

      address:
        "Vijay Nagar",

      city: "Indore",
    },

    dealer: {
      id: "DLR-002",

      name:
        "FastFix Appliances",

      dealerCode:
        "DLR-002",

      phone:
        "9876500001",
    },

    type: "SERVICE",

    appointmentDate:
      "2026-08-26",

    appointmentTime:
      "10:30",

    status:
      "CONFIRMED",

    notes:
      "Customer requested morning visit.",

    rescheduleCount: 0,

    createdAt:
      "2026-08-25T10:00:00",

    updatedAt:
      "2026-08-25T10:15:00",
  },

  {
    id: "APT-002",

    complaintId: "CMP-002",

    complaintNumber:
      "CMP-2026-0002",

    customer: {
      id: "CUS-002",

      name:
        "Priya Verma",

      phone:
        "9988776655",

      address:
        "Palasia",

      city: "Indore",
    },

    dealer: {
      id: "DLR-001",

      name:
        "ABC Service Center",

      dealerCode:
        "DLR-001",

      phone:
        "9876500000",
    },

    type:
      "INSTALLATION",

    appointmentDate:
      "2026-08-26",

    appointmentTime:
      "14:00",

    status:
      "SCHEDULED",

    notes:
      "New installation.",

    rescheduleCount: 0,

    createdAt:
      "2026-08-25T11:00:00",

    updatedAt:
      "2026-08-25T11:00:00",
  },

  {
    id: "APT-003",

    complaintId: "CMP-003",

    complaintNumber:
      "CMP-2026-0003",

    customer: {
      id: "CUS-003",

      name:
        "Amit Jain",

      phone:
        "9898989898",

      address:
        "MG Road",

      city: "Indore",
    },

    dealer: {
      id: "DLR-003",

      name:
        "Reliable Electronics",

      dealerCode:
        "DLR-003",

      phone:
        "9876500002",
    },

    type:
      "INSPECTION",

    appointmentDate:
      "2026-08-27",

    appointmentTime:
      "12:30",

    status:
      "RESCHEDULED",

    originalAppointmentDate:
      "2026-08-26",

    originalAppointmentTime:
      "11:00",

    rescheduleReason:
      "Customer unavailable.",

    rescheduleCount: 1,

    createdAt:
      "2026-08-24T10:00:00",

    updatedAt:
      "2026-08-25T12:00:00",
  },

  {
    id: "APT-004",

    complaintId: "CMP-004",

    complaintNumber:
      "CMP-2026-0004",

    customer: {
      id: "CUS-004",

      name:
        "Sneha Patel",

      phone:
        "9123456789",

      address:
        "Scheme No. 54",

      city: "Indore",
    },

    dealer: {
      id: "DLR-002",

      name:
        "FastFix Appliances",

      dealerCode:
        "DLR-002",

      phone:
        "9876500001",
    },

    type: "SERVICE",

    appointmentDate:
      "2026-08-25",

    appointmentTime:
      "09:30",

    status:
      "COMPLETED",

    notes:
      "Service completed.",

    rescheduleCount: 0,

    createdAt:
      "2026-08-24T08:00:00",

    updatedAt:
      "2026-08-25T10:30:00",
  },
];

export async function getAppointments() {
  await delay();

  return [...appointments];
}

export async function getAppointmentById(
  id: string
) {
  await delay();

  return appointments.find(
    (appointment) =>
      appointment.id === id
  );
}

export async function createAppointment(
  data: AppointmentFormData
) {
  await delay();

  const appointment: Appointment =
    {
      id: `APT-${String(
        appointments.length +
          1
      ).padStart(3, "0")}`,

      complaintId:
        data.complaintId,

      complaintNumber:
        data.complaintId,

      customer: {
        id: "CUS-MOCK",

        name:
          "Mock Customer",

        phone:
          "9999999999",

        address:
          "Mock Address",

        city: "Indore",
      },

      dealer: {
        id: data.dealerId,

        name:
          "Selected Dealer",

        dealerCode:
          data.dealerId,

        phone:
          "9999999998",
      },

      type: data.type,

      appointmentDate:
        data.appointmentDate,

      appointmentTime:
        data.appointmentTime,

      status: "SCHEDULED",

      notes: data.notes,

      rescheduleCount: 0,

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),
    };

  appointments = [
    appointment,
    ...appointments,
  ];

  return appointment;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
) {
  await delay();

  const appointment =
    appointments.find(
      (item) =>
        item.id === id
    );

  if (!appointment) {
    return undefined;
  }

  appointment.status =
    status;

  appointment.updatedAt =
    new Date().toISOString();

  return appointment;
}

export async function rescheduleAppointment(
  payload: RescheduleAppointmentPayload
) {
  await delay();

  const appointment =
    appointments.find(
      (item) =>
        item.id ===
        payload.appointmentId
    );

  if (!appointment) {
    throw new Error(
      "Appointment not found"
    );
  }

  const oldDate =
    appointment.appointmentDate;

  const oldTime =
    appointment.appointmentTime;

  appointment.originalAppointmentDate =
    appointment.originalAppointmentDate ??
    oldDate;

  appointment.originalAppointmentTime =
    appointment.originalAppointmentTime ??
    oldTime;

  appointment.appointmentDate =
    payload.appointmentDate;

  appointment.appointmentTime =
    payload.appointmentTime;

  appointment.rescheduleReason =
    payload.reason;

  appointment.status =
    "RESCHEDULED";

  appointment.rescheduleCount +=
    1;

  appointment.updatedAt =
    new Date().toISOString();

  return appointment;
}