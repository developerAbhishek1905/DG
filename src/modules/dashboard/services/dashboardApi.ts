export interface DashboardKPI {
  totalComplaints: number;
  openComplaints: number;
  pendingComplaints: number;
  slaBreached: number;
  verifiedClosures: number;
  outstandingAmount: number;
  paymentsToday: number;
  paymentAmountToday: number;
}

export interface ComplaintTrendItem {
  date: string;
  created: number;
  closed: number;
}

export interface ComplaintStatusItem {
  status: string;
  count: number;
}

export interface DealerPerformanceItem {
  dealerId: string;
  dealerName: string;
  assigned: number;
  completed: number;
  cancelled: number;
  slaCompliance: number;
  completionRate: number;
}

export interface SLAPerformanceItem {
  label: string;
  count: number;
}

export interface RecentComplaint {
  id: string;
  complaintNumber: string;
  customerName: string;
  productName: string;
  dealerName?: string;
  status: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  createdAt: string;
}

export interface DashboardData {
  kpis: DashboardKPI;

  complaintTrend: ComplaintTrendItem[];

  complaintStatus: ComplaintStatusItem[];

  dealerPerformance: DealerPerformanceItem[];

  slaPerformance: SLAPerformanceItem[];

  recentComplaints: RecentComplaint[];
}

const delay = (ms = 300) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

const dashboardData: DashboardData = {
  kpis: {
    totalComplaints: 1248,

    openComplaints: 318,

    pendingComplaints: 74,

    slaBreached: 21,

    verifiedClosures: 692,

    outstandingAmount: 425680,

    paymentsToday: 18,

    paymentAmountToday: 86450,
  },

  complaintTrend: [
    {
      date: "20 Aug",
      created: 42,
      closed: 31,
    },

    {
      date: "21 Aug",
      created: 48,
      closed: 39,
    },

    {
      date: "22 Aug",
      created: 51,
      closed: 44,
    },

    {
      date: "23 Aug",
      created: 39,
      closed: 35,
    },

    {
      date: "24 Aug",
      created: 63,
      closed: 46,
    },

    {
      date: "25 Aug",
      created: 57,
      closed: 52,
    },

    {
      date: "26 Aug",
      created: 34,
      closed: 29,
    },
  ],

  complaintStatus: [
    {
      status: "Open",
      count: 182,
    },

    {
      status: "Allocated",
      count: 136,
    },

    {
      status: "Appointment",
      count: 96,
    },

    {
      status: "Pending",
      count: 74,
    },

    {
      status: "Closure Submitted",
      count: 42,
    },

    {
      status: "Verification",
      count: 26,
    },

    {
      status: "Closed",
      count: 692,
    },
  ],

  dealerPerformance: [
    {
      dealerId: "DLR-001",
      dealerName: "ABC Service Center",
      assigned: 128,
      completed: 112,
      cancelled: 5,
      slaCompliance: 94,
      completionRate: 87.5,
    },

    {
      dealerId: "DLR-002",
      dealerName: "FastFix Appliances",
      assigned: 143,
      completed: 132,
      cancelled: 3,
      slaCompliance: 97,
      completionRate: 92.3,
    },

    {
      dealerId: "DLR-003",
      dealerName: "Reliable Electronics",
      assigned: 98,
      completed: 84,
      cancelled: 8,
      slaCompliance: 89,
      completionRate: 85.7,
    },

    {
      dealerId: "DLR-004",
      dealerName: "Smart Care Services",
      assigned: 115,
      completed: 101,
      cancelled: 4,
      slaCompliance: 92,
      completionRate: 87.8,
    },

    {
      dealerId: "DLR-005",
      dealerName: "Prime Services",
      assigned: 89,
      completed: 78,
      cancelled: 6,
      slaCompliance: 86,
      completionRate: 87.6,
    },
  ],

  slaPerformance: [
    {
      label: "Within SLA",
      count: 238,
    },

    {
      label: "Warning",
      count: 59,
    },

    {
      label: "Breached",
      count: 21,
    },
  ],

  recentComplaints: [
    {
      id: "CMP-001",

      complaintNumber:
        "CMP-2026-1248",

      customerName:
        "Rahul Sharma",

      productName:
        "Air Conditioner",

      dealerName:
        "FastFix Appliances",

      status:
        "APPOINTMENT",

      priority:
        "HIGH",

      createdAt:
        "2026-08-26T08:45:00",
    },

    {
      id: "CMP-002",

      complaintNumber:
        "CMP-2026-1247",

      customerName:
        "Priya Verma",

      productName:
        "Washing Machine",

      dealerName:
        "ABC Service Center",

      status:
        "PENDING",

      priority:
        "MEDIUM",

      createdAt:
        "2026-08-26T08:20:00",
    },

    {
      id: "CMP-003",

      complaintNumber:
        "CMP-2026-1246",

      customerName:
        "Amit Jain",

      productName:
        "Refrigerator",

      status:
        "UNASSIGNED",

      priority:
        "CRITICAL",

      createdAt:
        "2026-08-26T07:55:00",
    },

    {
      id: "CMP-004",

      complaintNumber:
        "CMP-2026-1245",

      customerName:
        "Sneha Patel",

      productName:
        "Television",

      dealerName:
        "Smart Care Services",

      status:
        "VERIFICATION",

      priority:
        "LOW",

      createdAt:
        "2026-08-26T07:30:00",
    },

    {
      id: "CMP-005",

      complaintNumber:
        "CMP-2026-1244",

      customerName:
        "Rohit Mehta",

      productName:
        "Microwave",

      dealerName:
        "Prime Services",

      status:
        "CLOSED",

      priority:
        "MEDIUM",

      createdAt:
        "2026-08-26T07:00:00",
    },
  ],
};

export async function getDashboardData() {
  await delay();

  return dashboardData;
}