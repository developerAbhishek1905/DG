import type {
  Complaint,
  ComplaintCategory,
  ComplaintPriority,
  ComplaintType,
  CreateComplaintPayload,
  CustomerLookupResponse,
} from "../types/complaint.types";

/* =====================================================
   MOCK COMPLAINT DATA
===================================================== */

export const mockComplaints: Complaint[] = [
  {
    id: "1",

    complaintNumber: "CMP-2026-0001",

    customer: {
      id: "CUS-001",

      customerCode: "170217",

      name: "Rahul Sharma",

      phone: "9876543210",

      alternatePhone: "9876501234",

      email: "rahul@example.com",

      address: "MG Road",

      city: "Indore",

      district: "Indore",

      state: "Madhya Pradesh",

      pincode: "452001",

      contactInfo: "Preferred contact through phone",
    },

    product: {
      id: "PRD-001",

      name: "Air Conditioner",

      model: "AC-1.5T-2026",

      serialNumber: "AC123456",

      warrantyStatus: "ACTIVE",
    },

    dealer: {
      id: "DLR-001",

      name: "ABC Electronics",

      code: "DLR-001",

      phone: "9876500000",

      city: "Indore",
    },

    category: "SERVICE",

    complaintType: "REGULAR",

    subject: "AC not cooling",

    description:
      "Customer reported that the AC is running but not providing sufficient cooling.",

    faultReported: "AC not cooling properly",

    units: 1,

    quoteAmount: 400,

    status: "REGISTERED",

    priority: "HIGH",

    createdAt: "2026-08-24T10:30:00",

    updatedAt: "2026-08-24T10:30:00",

    slaDueAt: "2026-08-26T10:30:00",

    timeline: [
      {
        id: "TL-001",

        status: "REGISTERED",

        title: "Complaint Registered",

        description:
          "Complaint has been successfully registered.",

        timestamp: "2026-08-24T10:30:00",

        user: "Admin",
      },
    ],
  },

  {
    id: "2",

    complaintNumber: "CMP-2026-0002",

    customer: {
      id: "CUS-002",

      customerCode: "170218",

      name: "Priya Verma",

      phone: "9988776655",

      alternatePhone: "9988776644",

      address: "Vijay Nagar",

      city: "Indore",

      district: "Indore",

      state: "Madhya Pradesh",

      pincode: "452010",
    },

    product: {
      id: "PRD-002",

      name: "Washing Machine",

      model: "WM-8KG",

      serialNumber: "WM778899",

      warrantyStatus: "ACTIVE",
    },

    dealer: {
      id: "DLR-002",

      name: "XYZ Appliances",

      code: "DLR-002",

      phone: "9123456789",

      city: "Indore",
    },

    category: "REPAIR",

    complaintType: "REGULAR",

    subject: "Washing machine making noise",

    description:
      "Customer reported unusual noise during the spin cycle.",

    faultReported: "Unusual noise during spin cycle",

    units: 1,

    quoteAmount: 700,

    status: "ALLOCATED",

    priority: "MEDIUM",

    createdAt: "2026-08-23T09:00:00",

    updatedAt: "2026-08-23T12:00:00",

    appointmentDate: "2026-08-25T15:00:00",

    slaDueAt: "2026-08-26T09:00:00",

    timeline: [
      {
        id: "TL-002",

        status: "REGISTERED",

        title: "Complaint Registered",

        timestamp: "2026-08-23T09:00:00",
      },

      {
        id: "TL-003",

        status: "ALLOCATED",

        title: "Dealer Allocated",

        description: "XYZ Appliances assigned.",

        timestamp: "2026-08-23T12:00:00",

        user: "Admin",
      },
    ],
  },

  /*
   * Second complaint for Rahul.
   *
   * This is useful for testing Complaint History.
   */
  {
    id: "3",

    complaintNumber: "CMP-2026-0003",

    customer: {
      id: "CUS-001",

      customerCode: "170217",

      name: "Rahul Sharma",

      phone: "9876543210",

      alternatePhone: "9876501234",

      email: "rahul@example.com",

      address: "MG Road",

      city: "Indore",

      district: "Indore",

      state: "Madhya Pradesh",

      pincode: "452001",

      contactInfo: "Preferred contact through phone",
    },

    product: {
      id: "PRD-003",

      name: "LED TV",

      model: "LED-43",

      serialNumber: "TV432126",

      warrantyStatus: "EXPIRED",
    },

    category: "REPAIR",

    complaintType: "REPEAT",

    subject: "TV display issue",

    description:
      "Customer reported display flickering issue.",

    faultReported: "Screen flickering",

    units: 1,

    quoteAmount: 1200,

    repeatComplaintNumber: "CMP-2025-0095",

    status: "CLOSED",

    priority: "MEDIUM",

    createdAt: "2026-07-15T11:00:00",

    updatedAt: "2026-07-17T16:30:00",

    timeline: [
      {
        id: "TL-004",

        status: "REGISTERED",

        title: "Complaint Registered",

        timestamp: "2026-07-15T11:00:00",
      },

      {
        id: "TL-005",

        status: "CLOSED",

        title: "Complaint Closed",

        timestamp: "2026-07-17T16:30:00",

        user: "Admin",
      },
    ],
  },
];

/* =====================================================
   GET ALL COMPLAINTS
===================================================== */

export const getComplaints = async (): Promise<
  Complaint[]
> => {
  return Promise.resolve([...mockComplaints]);
};

/* =====================================================
   GET COMPLAINT BY ID
===================================================== */

export const getComplaintById = async (
  id: string
): Promise<Complaint | undefined> => {
  return Promise.resolve(
    mockComplaints.find(
      (complaint) =>
        complaint.id === id
    )
  );
};

/* =====================================================
   CUSTOMER LOOKUP BY MOBILE
===================================================== */

export const lookupCustomerByPhone = async (
  phone: string
): Promise<CustomerLookupResponse> => {
  /*
   * Small delay so loader can be tested.
   */
  await delay(500);

  const cleanedPhone =
    phone.trim();

  /*
   * Find any complaint where:
   *
   * customer.phone === phone
   *
   * OR
   *
   * customer.alternatePhone === phone
   */
  const matchedComplaint =
    mockComplaints.find(
      (complaint) =>
        complaint.customer.phone ===
          cleanedPhone ||
        complaint.customer
          .alternatePhone ===
          cleanedPhone
    );

  /*
   * Customer does not exist
   */
  if (!matchedComplaint) {
    return {
      customer: null,

      complaintHistory: [],
    };
  }

  const customer =
    matchedComplaint.customer;

  /*
   * Get ALL complaints belonging
   * to this same customer.
   */
  const customerComplaints =
    mockComplaints
      .filter(
        (complaint) =>
          complaint.customer.id ===
          customer.id
      )
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
      );

  return {
    customer,

    complaintHistory:
      customerComplaints.map(
        (complaint) => ({
          id:
            complaint.id,

          complaintNumber:
            complaint.complaintNumber,

          createdAt:
            complaint.createdAt,

          category:
            complaint.category,

          complaintType:
            complaint.complaintType,

          productName:
            complaint.product?.name,

          faultReported:
            complaint.faultReported,

          status:
            complaint.status,

          priority:
            complaint.priority,

          dealerName:
            complaint.dealer?.name,

          technicianName:
            getTechnicianName(
              complaint
            ),
        })
      ),
  };
};

/* =====================================================
   CREATE COMPLAINT
===================================================== */

export const createComplaint = async (
  data: CreateComplaintPayload
): Promise<Complaint> => {
  await delay(700);

  /*
   * Existing customer
   */
  const existingComplaint =
    mockComplaints.find(
      (complaint) =>
        complaint.customer.phone ===
          data.phone ||
        complaint.customer
          .alternatePhone ===
          data.phone ||
        complaint.customer.phone ===
          data.alternatePhone ||
        complaint.customer
          .alternatePhone ===
          data.alternatePhone
    );

  /*
   * If customer exists,
   * keep the existing ID.
   *
   * Otherwise generate new customer ID.
   */
  const customerId =
    existingComplaint?.customer.id ||
    generateCustomerId();

  const now =
    new Date().toISOString();

  const complaintNumber =
    generateComplaintNumber();

  const newComplaint: Complaint = {
    id: generateComplaintId(),

    complaintNumber,

    customer: {
      id: customerId,

      customerCode:
        data.customerCode ||
        existingComplaint
          ?.customer.customerCode ||
        generateCustomerCode(),

      name:
        data.customerName,

      phone:
        data.phone,

      alternatePhone:
        data.alternatePhone,

      email:
        data.email,

      address:
        data.address,

      city:
        data.city,

      district:
        data.district,

      state:
        data.state,

      pincode:
        data.pincode,

      contactInfo:
        data.contactInfo,
    },

    /*
     * Right now product is being
     * created from the form.
     *
     * Later productId can come from
     * Product Master.
     */
    product:
      data.productName
        ? {
            id:
              data.productId ||
              `PRD-${Date.now()}`,

            name:
              data.productName,

            model:
              data.productDescription ||
              "-",
          }
        : undefined,

    category:
      data.category as ComplaintCategory,

    complaintType:
      data.complaintType as ComplaintType,

    subject:
      data.subject,

    description:
      data.description || "",

    faultReported:
      data.faultReported,

    units:
      Number(
        data.units
      ),

    quoteAmount:
      data.quoteAmount,

    adName:
      data.adName,

    repeatComplaintNumber:
      data.repeatComplaintNumber,

    priority:
      data.priority as ComplaintPriority,

    /*
     * New complaint always starts
     * from REGISTERED.
     */
    status: "REGISTERED",

    createdAt:
      now,

    updatedAt:
      now,

    /*
     * Example SLA:
     * 48 hours after creation.
     */
    slaDueAt:
      addHours(
        now,
        48
      ),

    timeline: [
      {
        id: `TL-${Date.now()}`,

        status:
          "REGISTERED",

        title:
          "Complaint Registered",

        description:
          "Complaint has been successfully registered.",

        timestamp:
          now,

        user:
          "Admin",
      },
    ],
  };

  /*
   * Add newest complaint at
   * beginning of list.
   */
  mockComplaints.unshift(
    newComplaint
  );

  return newComplaint;
};

/* =====================================================
   GENERATE COMPLAINT NUMBER
===================================================== */

function generateComplaintNumber(): string {
  const year =
    new Date().getFullYear();

  const nextNumber =
    mockComplaints.length +
    1;

  return `CMP-${year}-${String(
    nextNumber
  ).padStart(4, "0")}`;
}

/* =====================================================
   GENERATE COMPLAINT ID
===================================================== */

function generateComplaintId(): string {
  return String(
    Date.now()
  );
}

/* =====================================================
   GENERATE CUSTOMER ID
===================================================== */

function generateCustomerId(): string {
  const customerIds =
    new Set(
      mockComplaints.map(
        (complaint) =>
          complaint.customer.id
      )
    );

  return `CUS-${String(
    customerIds.size + 1
  ).padStart(3, "0")}`;
}

/* =====================================================
   GENERATE CUSTOMER CODE
===================================================== */

function generateCustomerCode(): string {
  return String(
    170217 +
      new Set(
        mockComplaints.map(
          (complaint) =>
            complaint.customer.id
        )
      ).size
  );
}

/* =====================================================
   GET TECHNICIAN NAME
===================================================== */

function getTechnicianName(
  complaint: Complaint
): string | undefined {
  /*
   * Currently Complaint does not
   * contain technician directly.
   *
   * For mock testing we can try
   * finding a timeline user.
   */

  const technicianEntry =
    [...complaint.timeline]
      .reverse()
      .find(
        (item) =>
          item.user &&
          item.user !== "Admin"
      );

  return technicianEntry?.user;
}

/* =====================================================
   ADD HOURS
===================================================== */

function addHours(
  date: string,
  hours: number
): string {
  const result =
    new Date(date);

  result.setHours(
    result.getHours() +
      hours
  );

  return result.toISOString();
}

/* =====================================================
   MOCK NETWORK DELAY
===================================================== */

function delay(
  milliseconds: number
) {
  return new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        milliseconds
      )
  );
}