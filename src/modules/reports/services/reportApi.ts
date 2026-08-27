import type {
  ReportData,
  ReportRequest,
  ReportType,
} from "../types/report.types";

const delay = (ms = 300) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

const reports: Record<ReportType, ReportData> = {
  COMPLAINT: {
    title: "Complaint Report",

    description:
      "Analyze complaint volume, status and closure performance.",

    summary: [
      {
        label: "Total Complaints",
        value: 1248,
      },
      {
        label: "Open",
        value: 318,
      },
      {
        label: "Closed",
        value: 692,
      },
      {
        label: "Pending",
        value: 74,
      },
    ],

    columns: [
      {
        key: "complaintNumber",
        label: "Complaint",
      },
      {
        key: "customer",
        label: "Customer",
      },
      {
        key: "product",
        label: "Product",
      },
      {
        key: "dealer",
        label: "Dealer",
      },
      {
        key: "status",
        label: "Status",
      },
      {
        key: "createdDate",
        label: "Created",
      },
    ],

    rows: [
      {
        id: "CMP-001",
        complaintNumber: "CMP-2026-1248",
        customer: "Rahul Sharma",
        product: "Air Conditioner",
        dealer: "FastFix Appliances",
        status: "APPOINTMENT",
        createdDate: "26 Aug 2026",
      },
      {
        id: "CMP-002",
        complaintNumber: "CMP-2026-1247",
        customer: "Priya Verma",
        product: "Washing Machine",
        dealer: "ABC Service Center",
        status: "PENDING",
        createdDate: "26 Aug 2026",
      },
      {
        id: "CMP-003",
        complaintNumber: "CMP-2026-1246",
        customer: "Amit Jain",
        product: "Refrigerator",
        dealer: "Unassigned",
        status: "OPEN",
        createdDate: "26 Aug 2026",
      },
    ],

    chart: [
      {
        label: "Open",
        value: 318,
      },
      {
        label: "Pending",
        value: 74,
      },
      {
        label: "Verification",
        value: 164,
      },
      {
        label: "Closed",
        value: 692,
      },
    ],
  },

  DEALER: {
    title: "Dealer Performance Report",

    description:
      "Compare dealer workload, completion and SLA performance.",

    summary: [
      {
        label: "Total Dealers",
        value: 48,
      },
      {
        label: "Active Dealers",
        value: 43,
      },
      {
        label: "Avg Completion",
        value: "89.4%",
      },
      {
        label: "Avg SLA",
        value: "92.1%",
      },
    ],

    columns: [
      {
        key: "dealerCode",
        label: "Dealer Code",
      },
      {
        key: "dealer",
        label: "Dealer",
      },
      {
        key: "assigned",
        label: "Assigned",
      },
      {
        key: "completed",
        label: "Completed",
      },
      {
        key: "cancelled",
        label: "Cancelled",
      },
      {
        key: "completionRate",
        label: "Completion %",
      },
      {
        key: "sla",
        label: "SLA %",
      },
    ],

    rows: [
      {
        id: "DLR-001",
        dealerCode: "DLR-001",
        dealer: "ABC Service Center",
        assigned: 128,
        completed: 112,
        cancelled: 5,
        completionRate: "87.5%",
        sla: "94%",
      },
      {
        id: "DLR-002",
        dealerCode: "DLR-002",
        dealer: "FastFix Appliances",
        assigned: 143,
        completed: 132,
        cancelled: 3,
        completionRate: "92.3%",
        sla: "97%",
      },
      {
        id: "DLR-003",
        dealerCode: "DLR-003",
        dealer: "Reliable Electronics",
        assigned: 98,
        completed: 84,
        cancelled: 8,
        completionRate: "85.7%",
        sla: "89%",
      },
    ],

    chart: [
      {
        label: "ABC Service",
        value: 87.5,
      },
      {
        label: "FastFix",
        value: 92.3,
      },
      {
        label: "Reliable",
        value: 85.7,
      },
      {
        label: "Smart Care",
        value: 87.8,
      },
    ],
  },

  SLA: {
    title: "SLA Performance Report",

    description:
      "Monitor SLA compliance, warnings and breaches.",

    summary: [
      {
        label: "Total Active",
        value: 318,
      },
      {
        label: "Within SLA",
        value: 238,
      },
      {
        label: "SLA Warning",
        value: 59,
      },
      {
        label: "Breached",
        value: 21,
      },
    ],

    columns: [
      {
        key: "complaint",
        label: "Complaint",
      },
      {
        key: "dealer",
        label: "Dealer",
      },
      {
        key: "slaTarget",
        label: "SLA Target",
      },
      {
        key: "elapsed",
        label: "Elapsed",
      },
      {
        key: "remaining",
        label: "Remaining",
      },
      {
        key: "status",
        label: "SLA Status",
      },
    ],

    rows: [
      {
        id: "SLA-001",
        complaint: "CMP-2026-1248",
        dealer: "FastFix Appliances",
        slaTarget: "24 Hours",
        elapsed: "18h 20m",
        remaining: "5h 40m",
        status: "WITHIN SLA",
      },
      {
        id: "SLA-002",
        complaint: "CMP-2026-1247",
        dealer: "ABC Service Center",
        slaTarget: "24 Hours",
        elapsed: "22h 45m",
        remaining: "1h 15m",
        status: "WARNING",
      },
      {
        id: "SLA-003",
        complaint: "CMP-2026-1221",
        dealer: "Reliable Electronics",
        slaTarget: "24 Hours",
        elapsed: "29h",
        remaining: "-5h",
        status: "BREACHED",
      },
    ],

    chart: [
      {
        label: "Within SLA",
        value: 238,
      },
      {
        label: "Warning",
        value: 59,
      },
      {
        label: "Breached",
        value: 21,
      },
    ],
  },

  CANCELLATION: {
    title: "Cancellation Report",

    description:
      "Analyze complaint cancellation requests and reasons.",

    summary: [
      {
        label: "Total Requests",
        value: 92,
      },
      {
        label: "Approved",
        value: 54,
      },
      {
        label: "Rejected",
        value: 21,
      },
      {
        label: "Pending",
        value: 17,
      },
    ],

    columns: [
      {
        key: "requestNumber",
        label: "Request",
      },
      {
        key: "complaint",
        label: "Complaint",
      },
      {
        key: "customer",
        label: "Customer",
      },
      {
        key: "dealer",
        label: "Dealer",
      },
      {
        key: "reason",
        label: "Reason",
      },
      {
        key: "status",
        label: "Status",
      },
    ],

    rows: [
      {
        id: "CAN-001",
        requestNumber: "CAN-2026-0092",
        complaint: "CMP-2026-1188",
        customer: "Rohit Sharma",
        dealer: "ABC Service Center",
        reason: "Customer unavailable",
        status: "APPROVED",
      },
      {
        id: "CAN-002",
        requestNumber: "CAN-2026-0091",
        complaint: "CMP-2026-1181",
        customer: "Sneha Jain",
        dealer: "FastFix Appliances",
        reason: "Wrong complaint",
        status: "REJECTED",
      },
    ],

    chart: [
      {
        label: "Approved",
        value: 54,
      },
      {
        label: "Rejected",
        value: 21,
      },
      {
        label: "Pending",
        value: 17,
      },
    ],
  },

  BILLING: {
    title: "Billing Report",

    description:
      "Analyze generated bills, payable amounts and billing status.",

    summary: [
      {
        label: "Total Bills",
        value: 584,
      },
      {
        label: "Bill Amount",
        value: "₹8,42,500",
      },
      {
        label: "Approved",
        value: "₹7,85,400",
      },
      {
        label: "Pending",
        value: "₹57,100",
      },
    ],

    columns: [
      {
        key: "billNumber",
        label: "Bill",
      },
      {
        key: "dealer",
        label: "Dealer",
      },
      {
        key: "complaint",
        label: "Complaint",
      },
      {
        key: "amount",
        label: "Amount",
      },
      {
        key: "status",
        label: "Status",
      },
      {
        key: "date",
        label: "Bill Date",
      },
    ],

    rows: [
      {
        id: "BILL-001",
        billNumber: "BILL-2026-0584",
        dealer: "ABC Service Center",
        complaint: "CMP-2026-1188",
        amount: "₹1,416",
        status: "APPROVED",
        date: "25 Aug 2026",
      },
      {
        id: "BILL-002",
        billNumber: "BILL-2026-0583",
        dealer: "FastFix Appliances",
        complaint: "CMP-2026-1187",
        amount: "₹3,000",
        status: "PENDING",
        date: "25 Aug 2026",
      },
    ],

    chart: [
      {
        label: "Approved",
        value: 785400,
      },
      {
        label: "Pending",
        value: 57100,
      },
    ],
  },

  PAYMENT: {
    title: "Payment Report",

    description:
      "Track dealer payments, settlement methods and transaction status.",

    summary: [
      {
        label: "Total Payments",
        value: 326,
      },
      {
        label: "Paid Amount",
        value: "₹6,84,200",
      },
      {
        label: "Pending Amount",
        value: "₹48,300",
      },
      {
        label: "Failed",
        value: 14,
      },
    ],

    columns: [
      {
        key: "paymentNumber",
        label: "Payment",
      },
      {
        key: "dealer",
        label: "Dealer",
      },
      {
        key: "amount",
        label: "Amount",
      },
      {
        key: "method",
        label: "Method",
      },
      {
        key: "reference",
        label: "Reference",
      },
      {
        key: "status",
        label: "Status",
      },
      {
        key: "date",
        label: "Date",
      },
    ],

    rows: [
      {
        id: "PAY-001",
        paymentNumber: "PAY-2026-0326",
        dealer: "ABC Service Center",
        amount: "₹10,000",
        method: "NEFT",
        reference: "UTR123456",
        status: "SUCCESS",
        date: "26 Aug 2026",
      },
      {
        id: "PAY-002",
        paymentNumber: "PAY-2026-0325",
        dealer: "FastFix Appliances",
        amount: "₹5,000",
        method: "UPI",
        reference: "UPI889921",
        status: "PENDING",
        date: "26 Aug 2026",
      },
    ],

    chart: [
      {
        label: "Successful",
        value: 684200,
      },
      {
        label: "Pending",
        value: 48300,
      },
      {
        label: "Failed",
        value: 22000,
      },
    ],
  },
};

export async function getReport(
  request: ReportRequest
): Promise<ReportData> {
  await delay();

  // Later:
  //
  // GET /api/reports/complaints
  // GET /api/reports/dealers
  // GET /api/reports/sla
  // GET /api/reports/cancellations
  // GET /api/reports/billing
  // GET /api/reports/payments
  //
  // with request.filters as query params

  return {
    ...reports[request.type],
    summary: [...reports[request.type].summary],
    columns: [...reports[request.type].columns],
    rows: [...reports[request.type].rows],
    chart: [...reports[request.type].chart],
  };
}