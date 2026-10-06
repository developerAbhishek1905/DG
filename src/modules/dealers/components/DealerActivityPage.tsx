import { useMemo, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Clock3,
  PhoneCall,
  RefreshCcw,
  Search,
  UserCheck,
  Users,
  UserX,
  XCircle,
  Eye,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

/* =====================================================
   TYPES
===================================================== */

type DealerStatus = "ACTIVE" | "ON_LEAVE" | "BUSY";

interface DealerActivity {
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

/* =====================================================
   DUMMY DATA
===================================================== */

const dummyDealers: DealerActivity[] = [
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
  {
    id: "3",
    dealerCode: "DLR00027",
    dealerName: "Sandeep Yadav",
    mobile: "9123456780",
    products: ["AC", "Refrigerator"],
    city: "Indore",
    assignedCalls: 8,
    appointments: 3,
    pending: 2,
    rescheduled: 1,
    cancelled: 1,
    closed: 5,
    availableCapacity: 2,
    status: "ACTIVE",
  },
  {
    id: "4",
    dealerCode: "DLR00028",
    dealerName: "Pooja Singh",
    mobile: "8765432109",
    products: ["LED TV", "Washing Machine"],
    city: "Agra",
    assignedCalls: 9,
    appointments: 4,
    pending: 1,
    rescheduled: 0,
    cancelled: 1,
    closed: 6,
    availableCapacity: 3,
    status: "ACTIVE",
  },
  {
    id: "5",
    dealerCode: "DLR00029",
    dealerName: "Deepak Joshi",
    mobile: "9899889898",
    products: ["Microwave", "AC"],
    city: "Bhopal",
    assignedCalls: 7,
    appointments: 3,
    pending: 1,
    rescheduled: 1,
    cancelled: 1,
    closed: 4,
    availableCapacity: 5,
    status: "ACTIVE",
  },
  {
    id: "6",
    dealerCode: "DLR00030",
    dealerName: "Kavita Rani",
    mobile: "9012345678",
    products: ["LED TV", "Home Appliances"],
    city: "Gwalior",
    assignedCalls: 6,
    appointments: 2,
    pending: 1,
    rescheduled: 1,
    cancelled: 1,
    closed: 3,
    availableCapacity: 0,
    status: "ON_LEAVE",
  },
  {
    id: "7",
    dealerCode: "DLR00031",
    dealerName: "Simran Kaur",
    mobile: "9777112233",
    products: ["AC", "Refrigerator"],
    city: "Bhopal",
    assignedCalls: 8,
    appointments: 3,
    pending: 2,
    rescheduled: 1,
    cancelled: 0,
    closed: 4,
    availableCapacity: 2,
    status: "ACTIVE",
  },
  {
    id: "8",
    dealerCode: "DLR00032",
    dealerName: "Rakesh Kumar",
    mobile: "9988774411",
    products: ["Washing Machine", "LED TV"],
    city: "Indore",
    assignedCalls: 10,
    appointments: 5,
    pending: 2,
    rescheduled: 2,
    cancelled: 0,
    closed: 6,
    availableCapacity: 0,
    status: "BUSY",
  },
  {
    id: "9",
    dealerCode: "DLR00033",
    dealerName: "Vikash Jain",
    mobile: "9090909090",
    products: ["AC", "Microwave"],
    city: "Ujjain",
    assignedCalls: 5,
    appointments: 2,
    pending: 1,
    rescheduled: 0,
    cancelled: 1,
    closed: 2,
    availableCapacity: 4,
    status: "ACTIVE",
  },
  {
    id: "10",
    dealerCode: "DLR00034",
    dealerName: "Neha Tomar",
    mobile: "9321654987",
    products: ["LED TV", "Home Appliances"],
    city: "Bhopal",
    assignedCalls: 6,
    appointments: 2,
    pending: 0,
    rescheduled: 1,
    cancelled: 1,
    closed: 4,
    availableCapacity: 3,
    status: "ACTIVE",
  },
];

/* =====================================================
   PAGE
===================================================== */

export default function DealerActivityPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [product, setProduct] = useState("ALL");

  const navigate = useNavigate();

  /* =====================================================
     SUMMARY
  ===================================================== */

  const summary = useMemo(() => {
    return {
      totalDealers: dummyDealers.length,

      activeDealers: dummyDealers.filter((dealer) => dealer.status === "ACTIVE")
        .length,

      onLeave: dummyDealers.filter((dealer) => dealer.status === "ON_LEAVE")
        .length,

      availableCapacity: dummyDealers.reduce(
        (total, dealer) => total + dealer.availableCapacity,
        0,
      ),

      todaysCalls: dummyDealers.reduce(
        (total, dealer) => total + dealer.assignedCalls,
        0,
      ),

      appointments: dummyDealers.reduce(
        (total, dealer) => total + dealer.appointments,
        0,
      ),

      pending: dummyDealers.reduce(
        (total, dealer) => total + dealer.pending,
        0,
      ),

      rescheduled: dummyDealers.reduce(
        (total, dealer) => total + dealer.rescheduled,
        0,
      ),

      cancelled: dummyDealers.reduce(
        (total, dealer) => total + dealer.cancelled,
        0,
      ),

      closed: dummyDealers.reduce((total, dealer) => total + dealer.closed, 0),
    };
  }, []);

  /* =====================================================
     PRODUCTS
  ===================================================== */

  const products = useMemo(() => {
    return Array.from(
      new Set(dummyDealers.flatMap((dealer) => dealer.products)),
    );
  }, []);

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredDealers = useMemo(() => {
    return dummyDealers.filter((dealer) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        dealer.dealerName.toLowerCase().includes(query) ||
        dealer.dealerCode.toLowerCase().includes(query) ||
        dealer.mobile.includes(query);

      const matchesStatus = status === "ALL" || dealer.status === status;

      const matchesProduct =
        product === "ALL" || dealer.products.includes(product);

      return matchesSearch && matchesStatus && matchesProduct;
    });
  }, [search, status, product]);

const handleViewDealer = (dealer: DealerActivity) => {
  navigate(`/dealer-activity/${dealer.id}`);
};

  return (
    <div className="space-y-4">
      {/* =================================================
          PAGE HEADER
      ================================================== */}

      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dealer Activity</h1>

        <p className="mt-1 text-sm text-gray-500">
          Today's dealer activity and call overview
        </p>
      </div>

      {/* =================================================
          OVERVIEW
      ================================================== */}

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-800">
          Dealer & Call Overview
        </h2>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-10">
          <OverviewCard
            title="Total Dealers"
            value={summary.totalDealers}
            icon={Users}
            type="blue"
          />

          <OverviewCard
            title="Active Dealers"
            value={summary.activeDealers}
            icon={UserCheck}
            type="green"
          />

          <OverviewCard
            title="On Leave"
            value={summary.onLeave}
            icon={UserX}
            type="purple"
          />

          <OverviewCard
            title="Available Capacity"
            value={summary.availableCapacity}
            icon={Clock3}
            type="orange"
          />

          <OverviewCard
            title="Today's Calls"
            value={summary.todaysCalls}
            icon={PhoneCall}
            type="red"
          />

          <OverviewCard
            title="Appointments"
            value={summary.appointments}
            icon={CalendarCheck}
            type="blue"
          />

          <OverviewCard
            title="Pending Calls"
            value={summary.pending}
            icon={Clock3}
            type="orange"
          />

          <OverviewCard
            title="Rescheduled"
            value={summary.rescheduled}
            icon={RefreshCcw}
            type="cyan"
          />

          <OverviewCard
            title="Cancelled"
            value={summary.cancelled}
            icon={XCircle}
            type="red"
          />

          <OverviewCard
            title="Closed"
            value={summary.closed}
            icon={CheckCircle2}
            type="green"
          />
        </div>
      </div>

      {/* =================================================
          TABLE SECTION
      ================================================== */}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* ===============================================
            TOOLBAR
        ================================================ */}

        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 xl:flex-row xl:items-center xl:justify-between">
          {/* Tabs */}

          {/* <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              className="rounded-md bg-[#123B7A] px-5 py-2 text-sm font-medium text-white shadow-sm"
            >
              Dealers ({filteredDealers.length})
            </button>

            <button
              type="button"
              className="rounded-md px-5 py-2 text-sm font-medium text-gray-600 transition hover:bg-white"
            >
              Dealer Performance
            </button>
          </div> */}

          {/* Filters */}

          <div className="flex flex-col gap-2 sm:flex-row">
            {/* Search */}

            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search dealer name / ID / mobile..."
                className="
                  h-10 w-full rounded-lg border border-gray-300
                  bg-white pl-9 pr-3 text-sm outline-none
                  transition
                  focus:border-[#123B7A]
                  sm:w-72
                "
              />
            </div>

            {/* Status */}

            {/* <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="BUSY">Busy</option>
            </select> */}

            {/* Product */}
{/* 
            <select
              value={product}
              onChange={(event) => setProduct(event.target.value)}
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none"
            >
              <option value="ALL">All Products</option>

              {products.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select> */}
          </div>
        </div>

        {/* ===============================================
            TABLE
        ================================================ */}

        <div className="w-full overflow-x-auto lg:overflow-x-visible">
  <table className="w-full min-w-[1100px] table-auto lg:min-w-0 lg:table-fixed">
<thead>
  <tr className="border-b border-gray-200 bg-gray-50">
    <TableHead className="lg:w-[3%]">#</TableHead>
    <TableHead className="lg:w-[13%]">Dealer</TableHead>
    <TableHead className="lg:w-[8%]">ID</TableHead>
    <TableHead className="lg:w-[9%]">Mobile</TableHead>
    <TableHead className="lg:w-[16%]">Products</TableHead>
    <TableHead className="lg:w-[8%]">City</TableHead>
    <TableHead center className="lg:w-[7%]">
      Assigned
    </TableHead>
    <TableHead center className="lg:w-[8%]">
      Appointments
    </TableHead>
    <TableHead center className="lg:w-[6%]">
      Pending
    </TableHead>
    <TableHead center className="lg:w-[6%]">
      Closed
    </TableHead>
    <TableHead className="lg:w-[9%]">Status</TableHead>
    <TableHead center className="lg:w-[7%]">
      Action
    </TableHead>
  </tr>
</thead>

            <tbody>
              {filteredDealers.map((dealer, index) => (
                <tr
                  key={dealer.id}
                  className="border-b border-gray-100 transition hover:bg-gray-50/70"
                >
                  <TableCell>{index + 1}</TableCell>

                  {/* Dealer */}
<TableCell>
  <div className="flex min-w-0 items-center gap-2">
    {/* <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[11px] font-semibold text-white">
      {getInitials(dealer.dealerName)}
    </div> */}

    <span
      className="min-w-0 truncate font-medium text-[#123B7A]"
      title={dealer.dealerName}
    >
      {dealer.dealerName}
    </span>
  </div>
</TableCell>

                  <TableCell>
                    <span className="text-xs font-medium text-gray-600">
                      {dealer.dealerCode}
                    </span>
                  </TableCell>

                  <TableCell>{dealer.mobile}</TableCell>

<TableCell>
  <div
    className="max-w-[220px] truncate lg:max-w-full"
    title={dealer.products.join(", ")}
  >
    {dealer.products.join(", ")}
  </div>
</TableCell>

                  <TableCell>{dealer.city}</TableCell>

                  <TableCell center>
                    <CountBadge value={dealer.assignedCalls} type="blue" />
                  </TableCell>

                  <TableCell center>
                    <CountBadge value={dealer.appointments} type="purple" />
                  </TableCell>

                  <TableCell center>
                    <CountBadge value={dealer.pending} type="orange" />
                  </TableCell>

                  <TableCell center>
                    <CountBadge value={dealer.closed} type="green" />
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={dealer.status} />
                  </TableCell>

                  <TableCell center>
                    <button
                      type="button"
                      onClick={() => handleViewDealer(dealer)}
                      className="
                        inline-flex items-center gap-1.5
                        rounded-lg bg-[#123B7A]
                        px-3 py-2 text-xs font-medium text-white
                        transition hover:bg-[#0f3268]
                      "
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </TableCell>
                </tr>
              ))}

              {filteredDealers.length === 0 && (
                <tr>
                  <td
                    colSpan={12}
                    className="py-12 text-center text-sm text-gray-500"
                  >
                    No dealers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   OVERVIEW CARD
===================================================== */

function OverviewCard({
  title,
  value,
  icon: Icon,
  type,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  type: "blue" | "green" | "purple" | "orange" | "red" | "cyan";
}) {
  const styles = {
    blue: {
      card: "bg-blue-50",
      icon: "bg-blue-100 text-blue-600",
      value: "text-blue-700",
    },

    green: {
      card: "bg-emerald-50",
      icon: "bg-emerald-100 text-emerald-600",
      value: "text-emerald-700",
    },

    purple: {
      card: "bg-violet-50",
      icon: "bg-violet-100 text-violet-600",
      value: "text-violet-700",
    },

    orange: {
      card: "bg-amber-50",
      icon: "bg-amber-100 text-amber-600",
      value: "text-amber-700",
    },

    red: {
      card: "bg-rose-50",
      icon: "bg-rose-100 text-rose-600",
      value: "text-rose-700",
    },

    cyan: {
      card: "bg-cyan-50",
      icon: "bg-cyan-100 text-cyan-600",
      value: "text-cyan-700",
    },
  };

  const style = styles[type];

  return (
    <div className={`rounded-xl p-3 ${style.card}`}>
      <div
        className={`mb-3 flex h-8 w-8 items-center justify-center rounded-full ${style.icon}`}
      >
        <Icon size={17} />
      </div>

      <p className="whitespace-nowrap text-xs font-medium text-gray-500">
        {title}
      </p>

      <p className={`mt-1 text-xl font-bold ${style.value}`}>{value}</p>
    </div>
  );
}

/* =====================================================
   TABLE COMPONENTS
===================================================== */

function TableHead({
  children,
  center = false,
  className = "",
}: {
  children: React.ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <th
      className={`
        whitespace-nowrap
        px-2 py-3
        text-xs font-semibold text-gray-600
        xl:px-3
        ${center ? "text-center" : "text-left"}
        ${className}
      `}
    >
      {children}
    </th>
  );
}

function TableCell({
  children,
  center = false,
  className = "",
}: {
  children: React.ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <td
      className={`
        px-2 py-3
        text-sm text-gray-600
        xl:px-3
        ${center ? "text-center" : "text-left"}
        ${className}
      `}
    >
      {children}
    </td>
  );
}

/* =====================================================
   COUNT BADGE
===================================================== */

function CountBadge({
  value,
  type,
}: {
  value: number;
  type: "blue" | "purple" | "orange" | "green";
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-violet-50 text-violet-700",
    orange: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`
        inline-flex min-w-9 items-center justify-center
        rounded-full px-2 py-1
        text-xs font-semibold
        ${styles[type]}
      `}
    >
      {value}
    </span>
  );
}

/* =====================================================
   STATUS
===================================================== */

function StatusBadge({ status }: { status: DealerStatus }) {
  const config = {
    ACTIVE: {
      label: "Active",
      className: "bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
    },

    ON_LEAVE: {
      label: "On Leave",
      className: "bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    },

    BUSY: {
      label: "Busy",
      className: "bg-blue-50 text-blue-700",
      dot: "bg-blue-500",
    },
  };

  const current = config[status];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        whitespace-nowrap rounded-full
        px-2.5 py-1
        text-xs font-medium
        ${current.className}
      `}
    >
      <span className={`h-2 w-2 rounded-full ${current.dot}`} />

      {current.label}
    </span>
  );
}

/* =====================================================
   HELPERS
===================================================== */

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
