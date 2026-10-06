export type DealerStatus = "ACTIVE" | "ON_LEAVE" | "BUSY";

export interface DealerActivity {
  id: string;
  dealerCode: string;
  dealerName: string;
  mobile: string;
  products: string[];
  city: string;
  assignedCalls: number;
  appointments: number;
  pending: number;
  rescheduled: number;
  cancelled: number;
  closed: number;
  availableCapacity: number;
  status: DealerStatus;
}

export interface DealerCallActivity {
  id: string;
  complaintNumber: string;
  customerName: string;
  customerMobile: string;
  product: string;
  category: string;
  status: string;
  appointmentTime: string;
  assignedAt: string;
  updatedAt: string;
}

export const dummyDealers: DealerActivity[] = [
  {
    id: "1",
    dealerCode: "DLR00025",
    dealerName: "Rahul Kumar",
    mobile: "9856623623",
    products: ["LED TV", "AC", "Washing Machine"],
    city: "Bhopal",
    assignedCalls: 12,
    appointments: 5,
    pending: 2,
    rescheduled: 1,
    cancelled: 1,
    closed: 8,
    availableCapacity: 3,
    status: "ACTIVE",
  },
  {
    id: "2",
    dealerCode: "DLR00026",
    dealerName: "Amit Sharma",
    mobile: "9876543210",
    products: ["LED TV", "AC"],
    city: "Bhopal",
    assignedCalls: 10,
    appointments: 4,
    pending: 1,
    rescheduled: 1,
    cancelled: 1,
    closed: 7,
    availableCapacity: 4,
    status: "ACTIVE",
  },
];

// export const dummyDealerCalls: Record<string, DealerCallActivity[]> = {
//   "1": [
//     {
//       id: "call-1",
//       complaintNumber: "CMP061026/0001",
//       customerName: "Aman Sharma",
//       customerMobile: "9876543210",
//       product: "AC",
//       category: "AC SERVICE",
//       status: "CLOSED",
//       appointmentTime: "10:30 AM",
//       assignedAt: "09:05 AM",
//       updatedAt: "11:45 AM",
//     },
//     {
//       id: "call-2",
//       complaintNumber: "CMP061026/0002",
//       customerName: "Rohit Verma",
//       customerMobile: "9988776655",
//       product: "LED TV",
//       category: "LED TV REPAIR",
//       status: "PENDING_ON_VISIT",
//       appointmentTime: "12:30 PM",
//       assignedAt: "09:20 AM",
//       updatedAt: "12:10 PM",
//     },
//     {
//       id: "call-3",
//       complaintNumber: "CMP061026/0003",
//       customerName: "Neha Jain",
//       customerMobile: "9123456789",
//       product: "Washing Machine",
//       category: "WM SERVICE",
//       status: "APPOINTMENT_SCHEDULED",
//       appointmentTime: "02:00 PM",
//       assignedAt: "10:15 AM",
//       updatedAt: "10:30 AM",
//     },
//     {
//       id: "call-4",
//       complaintNumber: "CMP061026/0004",
//       customerName: "Vikas Singh",
//       customerMobile: "9012345678",
//       product: "AC",
//       category: "AC INSTALLATION",
//       status: "RESCHEDULED",
//       appointmentTime: "04:00 PM",
//       assignedAt: "10:45 AM",
//       updatedAt: "01:20 PM",
//     },
//     {
//       id: "call-5",
//       complaintNumber: "CMP061026/0005",
//       customerName: "Mohit Kumar",
//       customerMobile: "9898989898",
//       product: "LED TV",
//       category: "LED TV SERVICE",
//       status: "CANCELLED",
//       appointmentTime: "05:00 PM",
//       assignedAt: "11:00 AM",
//       updatedAt: "02:30 PM",
//     },
//   ],

//   "2": [
//     {
//       id: "call-6",
//       complaintNumber: "CMP061026/0006",
//       customerName: "Ankit Gupta",
//       customerMobile: "9876501234",
//       product: "AC",
//       category: "AC SERVICE",
//       status: "CLOSED",
//       appointmentTime: "11:00 AM",
//       assignedAt: "09:30 AM",
//       updatedAt: "12:15 PM",
//     },
//   ],
// };


export interface DealerCallActivity {
  id: string;
  complaintNumber: string;
  customerName: string;
  customerMobile: string;
  product: string;
  category: string;
  status: string;
  appointmentTime: string;
  assignedAt: string;
  updatedAt: string;
}

export const dummyDealerCalls: Record<
  string,
  Record<string, DealerCallActivity[]>
> = {
  "1": {
    "2026-10-06": [
      {
        id: "call-1",
        complaintNumber: "CMP061026/0001",
        customerName: "Aman Sharma",
        customerMobile: "9876543210",
        product: "AC",
        category: "AC SERVICE",
        status: "CLOSED",
        appointmentTime: "10:30 AM",
        assignedAt: "09:05 AM",
        updatedAt: "11:45 AM",
      },
      {
        id: "call-2",
        complaintNumber: "CMP061026/0002",
        customerName: "Rohit Verma",
        customerMobile: "9988776655",
        product: "LED TV",
        category: "LED TV REPAIR",
        status: "PENDING_ON_VISIT",
        appointmentTime: "12:30 PM",
        assignedAt: "09:20 AM",
        updatedAt: "12:10 PM",
      },
      {
        id: "call-3",
        complaintNumber: "CMP061026/0003",
        customerName: "Neha Jain",
        customerMobile: "9123456789",
        product: "Washing Machine",
        category: "WM SERVICE",
        status: "APPOINTMENT_SCHEDULED",
        appointmentTime: "02:00 PM",
        assignedAt: "10:15 AM",
        updatedAt: "10:30 AM",
      },
      {
        id: "call-4",
        complaintNumber: "CMP061026/0004",
        customerName: "Vikas Singh",
        customerMobile: "9012345678",
        product: "AC",
        category: "AC INSTALLATION",
        status: "RESCHEDULED",
        appointmentTime: "04:00 PM",
        assignedAt: "10:45 AM",
        updatedAt: "01:20 PM",
      },
      {
        id: "call-5",
        complaintNumber: "CMP061026/0005",
        customerName: "Mohit Kumar",
        customerMobile: "9898989898",
        product: "LED TV",
        category: "LED TV SERVICE",
        status: "CANCELLED",
        appointmentTime: "05:00 PM",
        assignedAt: "11:00 AM",
        updatedAt: "02:30 PM",
      },
    ],

    "2026-10-05": [
      {
        id: "call-6",
        complaintNumber: "CMP051026/0012",
        customerName: "Akash Verma",
        customerMobile: "9876500001",
        product: "AC",
        category: "AC SERVICE",
        status: "CLOSED",
        appointmentTime: "10:00 AM",
        assignedAt: "08:45 AM",
        updatedAt: "11:20 AM",
      },
      {
        id: "call-7",
        complaintNumber: "CMP051026/0013",
        customerName: "Pankaj Sharma",
        customerMobile: "9876500002",
        product: "Washing Machine",
        category: "WM REPAIR",
        status: "CLOSED",
        appointmentTime: "01:00 PM",
        assignedAt: "09:30 AM",
        updatedAt: "02:15 PM",
      },
      {
        id: "call-8",
        complaintNumber: "CMP051026/0014",
        customerName: "Rahul Jain",
        customerMobile: "9876500003",
        product: "LED TV",
        category: "LED TV REPAIR",
        status: "PENDING_ON_VISIT",
        appointmentTime: "04:00 PM",
        assignedAt: "10:00 AM",
        updatedAt: "03:30 PM",
      },
    ],

    "2026-10-04": [
      {
        id: "call-9",
        complaintNumber: "CMP041026/0007",
        customerName: "Ravi Kumar",
        customerMobile: "9898000001",
        product: "AC",
        category: "AC INSTALLATION",
        status: "CLOSED",
        appointmentTime: "11:30 AM",
        assignedAt: "09:00 AM",
        updatedAt: "01:00 PM",
      },
      {
        id: "call-10",
        complaintNumber: "CMP041026/0008",
        customerName: "Suresh Singh",
        customerMobile: "9898000002",
        product: "LED TV",
        category: "LED TV SERVICE",
        status: "CANCELLED",
        appointmentTime: "03:30 PM",
        assignedAt: "10:15 AM",
        updatedAt: "02:40 PM",
      },
    ],
  },

  "2": {
    "2026-10-06": [
      {
        id: "call-11",
        complaintNumber: "CMP061026/0010",
        customerName: "Ankit Gupta",
        customerMobile: "9876501234",
        product: "AC",
        category: "AC SERVICE",
        status: "CLOSED",
        appointmentTime: "11:00 AM",
        assignedAt: "09:30 AM",
        updatedAt: "12:15 PM",
      },
    ],

    "2026-10-05": [
      {
        id: "call-12",
        complaintNumber: "CMP051026/0021",
        customerName: "Deepak Jain",
        customerMobile: "9999900001",
        product: "LED TV",
        category: "LED TV SERVICE",
        status: "CLOSED",
        appointmentTime: "02:00 PM",
        assignedAt: "10:00 AM",
        updatedAt: "03:15 PM",
      },
    ],
  },
};