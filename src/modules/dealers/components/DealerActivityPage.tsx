// import { useMemo, useState } from "react";
// import {
//   CalendarCheck,
//   CheckCircle2,
//   Clock3,
//   PhoneCall,
//   RefreshCcw,
//   Search,
//   UserCheck,
//   Users,
//   UserX,
//   XCircle,
//   Eye,
// } from "lucide-react";

// import { useNavigate } from "react-router-dom";

// /* =====================================================
//    TYPES
// ===================================================== */

// type DealerStatus = "ACTIVE" | "ON_LEAVE" | "BUSY";

// interface DealerActivity {
//   id: string;
//   dealerCode: string;
//   dealerName: string;
//   mobile: string;
//   products: string[];
//   city: string;

//   assignedCalls: number;
//   appointments: number;
//   pending: number;
//   rescheduled: number;
//   cancelled: number;
//   closed: number;

//   availableCapacity: number;

//   status: DealerStatus;
// }

// /* =====================================================
//    DUMMY DATA
// ===================================================== */

// const dummyDealers: DealerActivity[] = [
//   {
//     id: "1",
//     dealerCode: "DLR00025",
//     dealerName: "Rahul Kumar",
//     mobile: "9856623623",
//     products: ["LED TV", "AC", "Washing Machine"],
//     city: "Bhopal",
//     assignedCalls: 12,
//     appointments: 5,
//     pending: 2,
//     rescheduled: 1,
//     cancelled: 1,
//     closed: 8,
//     availableCapacity: 3,
//     status: "ACTIVE",
//   },
//   {
//     id: "2",
//     dealerCode: "DLR00026",
//     dealerName: "Amit Sharma",
//     mobile: "9876543210",
//     products: ["LED TV", "AC"],
//     city: "Bhopal",
//     assignedCalls: 10,
//     appointments: 4,
//     pending: 1,
//     rescheduled: 1,
//     cancelled: 1,
//     closed: 7,
//     availableCapacity: 4,
//     status: "ACTIVE",
//   },
//   {
//     id: "3",
//     dealerCode: "DLR00027",
//     dealerName: "Sandeep Yadav",
//     mobile: "9123456780",
//     products: ["AC", "Refrigerator"],
//     city: "Indore",
//     assignedCalls: 8,
//     appointments: 3,
//     pending: 2,
//     rescheduled: 1,
//     cancelled: 1,
//     closed: 5,
//     availableCapacity: 2,
//     status: "ACTIVE",
//   },
//   {
//     id: "4",
//     dealerCode: "DLR00028",
//     dealerName: "Pooja Singh",
//     mobile: "8765432109",
//     products: ["LED TV", "Washing Machine"],
//     city: "Agra",
//     assignedCalls: 9,
//     appointments: 4,
//     pending: 1,
//     rescheduled: 0,
//     cancelled: 1,
//     closed: 6,
//     availableCapacity: 3,
//     status: "ACTIVE",
//   },
//   {
//     id: "5",
//     dealerCode: "DLR00029",
//     dealerName: "Deepak Joshi",
//     mobile: "9899889898",
//     products: ["Microwave", "AC"],
//     city: "Bhopal",
//     assignedCalls: 7,
//     appointments: 3,
//     pending: 1,
//     rescheduled: 1,
//     cancelled: 1,
//     closed: 4,
//     availableCapacity: 5,
//     status: "ACTIVE",
//   },
//   {
//     id: "6",
//     dealerCode: "DLR00030",
//     dealerName: "Kavita Rani",
//     mobile: "9012345678",
//     products: ["LED TV", "Home Appliances"],
//     city: "Gwalior",
//     assignedCalls: 6,
//     appointments: 2,
//     pending: 1,
//     rescheduled: 1,
//     cancelled: 1,
//     closed: 3,
//     availableCapacity: 0,
//     status: "ON_LEAVE",
//   },
//   {
//     id: "7",
//     dealerCode: "DLR00031",
//     dealerName: "Simran Kaur",
//     mobile: "9777112233",
//     products: ["AC", "Refrigerator"],
//     city: "Bhopal",
//     assignedCalls: 8,
//     appointments: 3,
//     pending: 2,
//     rescheduled: 1,
//     cancelled: 0,
//     closed: 4,
//     availableCapacity: 2,
//     status: "ACTIVE",
//   },
//   {
//     id: "8",
//     dealerCode: "DLR00032",
//     dealerName: "Rakesh Kumar",
//     mobile: "9988774411",
//     products: ["Washing Machine", "LED TV"],
//     city: "Indore",
//     assignedCalls: 10,
//     appointments: 5,
//     pending: 2,
//     rescheduled: 2,
//     cancelled: 0,
//     closed: 6,
//     availableCapacity: 0,
//     status: "BUSY",
//   },
//   {
//     id: "9",
//     dealerCode: "DLR00033",
//     dealerName: "Vikash Jain",
//     mobile: "9090909090",
//     products: ["AC", "Microwave"],
//     city: "Ujjain",
//     assignedCalls: 5,
//     appointments: 2,
//     pending: 1,
//     rescheduled: 0,
//     cancelled: 1,
//     closed: 2,
//     availableCapacity: 4,
//     status: "ACTIVE",
//   },
//   {
//     id: "10",
//     dealerCode: "DLR00034",
//     dealerName: "Neha Tomar",
//     mobile: "9321654987",
//     products: ["LED TV", "Home Appliances"],
//     city: "Bhopal",
//     assignedCalls: 6,
//     appointments: 2,
//     pending: 0,
//     rescheduled: 1,
//     cancelled: 1,
//     closed: 4,
//     availableCapacity: 3,
//     status: "ACTIVE",
//   },
// ];

// /* =====================================================
//    PAGE
// ===================================================== */

// export default function DealerActivityPage() {
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("ALL");
//   const [product, setProduct] = useState("ALL");

//   const navigate = useNavigate();

//   /* =====================================================
//      SUMMARY
//   ===================================================== */

//   const summary = useMemo(() => {
//     return {
//       totalDealers: dummyDealers.length,

//       activeDealers: dummyDealers.filter((dealer) => dealer.status === "ACTIVE")
//         .length,

//       onLeave: dummyDealers.filter((dealer) => dealer.status === "ON_LEAVE")
//         .length,

//       availableCapacity: dummyDealers.reduce(
//         (total, dealer) => total + dealer.availableCapacity,
//         0,
//       ),

//       todaysCalls: dummyDealers.reduce(
//         (total, dealer) => total + dealer.assignedCalls,
//         0,
//       ),

//       appointments: dummyDealers.reduce(
//         (total, dealer) => total + dealer.appointments,
//         0,
//       ),

//       pending: dummyDealers.reduce(
//         (total, dealer) => total + dealer.pending,
//         0,
//       ),

//       rescheduled: dummyDealers.reduce(
//         (total, dealer) => total + dealer.rescheduled,
//         0,
//       ),

//       cancelled: dummyDealers.reduce(
//         (total, dealer) => total + dealer.cancelled,
//         0,
//       ),

//       closed: dummyDealers.reduce((total, dealer) => total + dealer.closed, 0),
//     };
//   }, []);

//   /* =====================================================
//      PRODUCTS
//   ===================================================== */

//   const products = useMemo(() => {
//     return Array.from(
//       new Set(dummyDealers.flatMap((dealer) => dealer.products)),
//     );
//   }, []);

//   /* =====================================================
//      FILTER
//   ===================================================== */

//   const filteredDealers = useMemo(() => {
//     return dummyDealers.filter((dealer) => {
//       const query = search.toLowerCase().trim();

//       const matchesSearch =
//         !query ||
//         dealer.dealerName.toLowerCase().includes(query) ||
//         dealer.dealerCode.toLowerCase().includes(query) ||
//         dealer.mobile.includes(query);

//       const matchesStatus = status === "ALL" || dealer.status === status;

//       const matchesProduct =
//         product === "ALL" || dealer.products.includes(product);

//       return matchesSearch && matchesStatus && matchesProduct;
//     });
//   }, [search, status, product]);

//   const handleViewDealer = (dealer: DealerActivity) => {
//     navigate(`/dealer-activity/${dealer.id}`);
//   };

//   return (
//     <div className="space-y-4">
//       {/* =================================================
//           PAGE HEADER
//       ================================================== */}

//       <div>
//         <h1 className="text-xl font-semibold text-gray-900">Dealer Activity</h1>

//         <p className="mt-1 text-sm text-gray-500">
//           Today's dealer activity and call overview
//         </p>
//       </div>

//       {/* =================================================
//           OVERVIEW
//       ================================================== */}

//       <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
//         <h2 className="mb-4 text-sm font-semibold text-gray-800">
//           Dealer & Call Overview
//         </h2>

//         <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-10">
//           <OverviewCard
//             title="Total Dealers"
//             value={summary.totalDealers}
//             icon={Users}
//             type="blue"
//           />

//           <OverviewCard
//             title="Active Dealers"
//             value={summary.activeDealers}
//             icon={UserCheck}
//             type="green"
//           />

//           <OverviewCard
//             title="On Leave"
//             value={summary.onLeave}
//             icon={UserX}
//             type="purple"
//           />

//           <OverviewCard
//             title="Available Capacity"
//             value={summary.availableCapacity}
//             icon={Clock3}
//             type="orange"
//           />

//           <OverviewCard
//             title="Today's Calls"
//             value={summary.todaysCalls}
//             icon={PhoneCall}
//             type="red"
//           />

//           <OverviewCard
//             title="Appointments"
//             value={summary.appointments}
//             icon={CalendarCheck}
//             type="blue"
//           />

//           <OverviewCard
//             title="Pending Calls"
//             value={summary.pending}
//             icon={Clock3}
//             type="orange"
//           />

//           <OverviewCard
//             title="Rescheduled"
//             value={summary.rescheduled}
//             icon={RefreshCcw}
//             type="cyan"
//           />

//           <OverviewCard
//             title="Cancelled"
//             value={summary.cancelled}
//             icon={XCircle}
//             type="red"
//           />

//           <OverviewCard
//             title="Closed"
//             value={summary.closed}
//             icon={CheckCircle2}
//             type="green"
//           />
//         </div>
//       </div>

//       {/* =================================================
//           TABLE SECTION
//       ================================================== */}

//       <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
//         {/* ===============================================
//             TOOLBAR
//         ================================================ */}

//         <div className="flex flex-col gap-3 border-b border-gray-200 p-4 xl:flex-row xl:items-center xl:justify-between">
//           {/* Tabs */}

//           {/* <div className="flex rounded-lg bg-gray-100 p-1">
//             <button
//               type="button"
//               className="rounded-md bg-[#123B7A] px-5 py-2 text-sm font-medium text-white shadow-sm"
//             >
//               Dealers ({filteredDealers.length})
//             </button>

//             <button
//               type="button"
//               className="rounded-md px-5 py-2 text-sm font-medium text-gray-600 transition hover:bg-white"
//             >
//               Dealer Performance
//             </button>
//           </div> */}

//           {/* Filters */}

//           <div className="flex flex-col gap-2 sm:flex-row">
//             {/* Search */}

//             <div className="relative">
//               <Search
//                 size={17}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//               />

//               <input
//                 type="text"
//                 value={search}
//                 onChange={(event) => setSearch(event.target.value)}
//                 placeholder="Search dealer name / ID / mobile..."
//                 className="
//                   h-10 w-full rounded-lg border border-gray-300
//                   bg-white pl-9 pr-3 text-sm outline-none
//                   transition
//                   focus:border-[#123B7A]
//                   sm:w-72
//                 "
//               />
//             </div>

//             {/* Status */}

//             {/* <select
//               value={status}
//               onChange={(event) => setStatus(event.target.value)}
//               className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none"
//             >
//               <option value="ALL">All Status</option>
//               <option value="ACTIVE">Active</option>
//               <option value="ON_LEAVE">On Leave</option>
//               <option value="BUSY">Busy</option>
//             </select> */}

//             {/* Product */}
//             {/*
//             <select
//               value={product}
//               onChange={(event) => setProduct(event.target.value)}
//               className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none"
//             >
//               <option value="ALL">All Products</option>

//               {products.map((item) => (
//                 <option key={item} value={item}>
//                   {item}
//                 </option>
//               ))}
//             </select> */}
//           </div>
//         </div>

//         {/* ===============================================
//             TABLE
//         ================================================ */}

//         <div className="w-full overflow-x-auto lg:overflow-x-visible">
//           <table className="w-full min-w-[1100px] table-auto lg:min-w-0 lg:table-fixed">
//             <thead>
//               <tr className="border-b border-gray-200 bg-gray-50">
//                 <TableHead className="lg:w-[3%]">#</TableHead>
//                 <TableHead className="lg:w-[13%]">Dealer</TableHead>
//                 <TableHead className="lg:w-[8%]">ID</TableHead>
//                 <TableHead className="lg:w-[9%]">Mobile</TableHead>
//                 <TableHead className="lg:w-[16%]">Products</TableHead>
//                 <TableHead className="lg:w-[8%]">City</TableHead>
//                 <TableHead center className="lg:w-[7%]">
//                   Assigned
//                 </TableHead>
//                 <TableHead center className="lg:w-[8%]">
//                   Appointments
//                 </TableHead>
//                 <TableHead center className="lg:w-[6%]">
//                   Pending
//                 </TableHead>
//                 <TableHead center className="lg:w-[6%]">
//                   Closed
//                 </TableHead>
//                 <TableHead className="lg:w-[9%]">Status</TableHead>
//                 <TableHead center className="lg:w-[7%]">
//                   Action
//                 </TableHead>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredDealers.map((dealer, index) => (
//                 <tr
//                   key={dealer.id}
//                   className="border-b border-gray-100 transition hover:bg-gray-50/70"
//                 >
//                   <TableCell>{index + 1}</TableCell>

//                   {/* Dealer */}
//                   <TableCell>
//                     <div className="flex min-w-0 items-center gap-2">
//                       {/* <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[11px] font-semibold text-white">
//       {getInitials(dealer.dealerName)}
//     </div> */}

//                       <span
//                         className="min-w-0 truncate font-medium text-[#123B7A]"
//                         title={dealer.dealerName}
//                       >
//                         {dealer.dealerName}
//                       </span>
//                     </div>
//                   </TableCell>

//                   <TableCell>
//                     <span className="text-xs font-medium text-gray-600">
//                       {dealer.dealerCode}
//                     </span>
//                   </TableCell>

//                   <TableCell>{dealer.mobile}</TableCell>

//                   <TableCell>
//                     <div
//                       className="max-w-[220px] truncate lg:max-w-full"
//                       title={dealer.products.join(", ")}
//                     >
//                       {dealer.products.join(", ")}
//                     </div>
//                   </TableCell>

//                   <TableCell>{dealer.city}</TableCell>

//                   <TableCell center>
//                     <CountBadge value={dealer.assignedCalls} type="blue" />
//                   </TableCell>

//                   <TableCell center>
//                     <CountBadge value={dealer.appointments} type="purple" />
//                   </TableCell>

//                   <TableCell center>
//                     <CountBadge value={dealer.pending} type="orange" />
//                   </TableCell>

//                   <TableCell center>
//                     <CountBadge value={dealer.closed} type="green" />
//                   </TableCell>

//                   <TableCell>
//                     <StatusBadge status={dealer.status} />
//                   </TableCell>

//                   <TableCell center>
//                     <button
//                       type="button"
//                       onClick={() => handleViewDealer(dealer)}
//                       className="
//                         inline-flex items-center gap-1.5
//                         rounded-lg bg-[#123B7A]
//                         px-3 py-2 text-xs font-medium text-white
//                         transition hover:bg-[#0f3268]
//                       "
//                     >
//                       <Eye size={14} />
//                       View
//                     </button>
//                   </TableCell>
//                 </tr>
//               ))}

//               {filteredDealers.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={12}
//                     className="py-12 text-center text-sm text-gray-500"
//                   >
//                     No dealers found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =====================================================
//    OVERVIEW CARD
// ===================================================== */

// function OverviewCard({
//   title,
//   value,
//   icon: Icon,
//   type,
// }: {
//   title: string;
//   value: number;
//   icon: React.ElementType;
//   type: "blue" | "green" | "purple" | "orange" | "red" | "cyan";
// }) {
//   const styles = {
//     blue: {
//       card: "bg-blue-50",
//       icon: "bg-blue-100 text-blue-600",
//       value: "text-blue-700",
//     },

//     green: {
//       card: "bg-emerald-50",
//       icon: "bg-emerald-100 text-emerald-600",
//       value: "text-emerald-700",
//     },

//     purple: {
//       card: "bg-violet-50",
//       icon: "bg-violet-100 text-violet-600",
//       value: "text-violet-700",
//     },

//     orange: {
//       card: "bg-amber-50",
//       icon: "bg-amber-100 text-amber-600",
//       value: "text-amber-700",
//     },

//     red: {
//       card: "bg-rose-50",
//       icon: "bg-rose-100 text-rose-600",
//       value: "text-rose-700",
//     },

//     cyan: {
//       card: "bg-cyan-50",
//       icon: "bg-cyan-100 text-cyan-600",
//       value: "text-cyan-700",
//     },
//   };

//   const style = styles[type];

//   return (
//     <div className={`rounded-xl p-3 ${style.card}`}>
//       <div
//         className={`mb-3 flex h-8 w-8 items-center justify-center rounded-full ${style.icon}`}
//       >
//         <Icon size={17} />
//       </div>

//       <p className="whitespace-nowrap text-xs font-medium text-gray-500">
//         {title}
//       </p>

//       <p className={`mt-1 text-xl font-bold ${style.value}`}>{value}</p>
//     </div>
//   );
// }

// /* =====================================================
//    TABLE COMPONENTS
// ===================================================== */

// function TableHead({
//   children,
//   center = false,
//   className = "",
// }: {
//   children: React.ReactNode;
//   center?: boolean;
//   className?: string;
// }) {
//   return (
//     <th
//       className={`
//         whitespace-nowrap
//         px-2 py-3
//         text-xs font-semibold text-gray-600
//         xl:px-3
//         ${center ? "text-center" : "text-left"}
//         ${className}
//       `}
//     >
//       {children}
//     </th>
//   );
// }

// function TableCell({
//   children,
//   center = false,
//   className = "",
// }: {
//   children: React.ReactNode;
//   center?: boolean;
//   className?: string;
// }) {
//   return (
//     <td
//       className={`
//         px-2 py-3
//         text-sm text-gray-600
//         xl:px-3
//         ${center ? "text-center" : "text-left"}
//         ${className}
//       `}
//     >
//       {children}
//     </td>
//   );
// }

// /* =====================================================
//    COUNT BADGE
// ===================================================== */

// function CountBadge({
//   value,
//   type,
// }: {
//   value: number;
//   type: "blue" | "purple" | "orange" | "green";
// }) {
//   const styles = {
//     blue: "bg-blue-50 text-blue-700",
//     purple: "bg-violet-50 text-violet-700",
//     orange: "bg-amber-50 text-amber-700",
//     green: "bg-emerald-50 text-emerald-700",
//   };

//   return (
//     <span
//       className={`
//         inline-flex min-w-9 items-center justify-center
//         rounded-full px-2 py-1
//         text-xs font-semibold
//         ${styles[type]}
//       `}
//     >
//       {value}
//     </span>
//   );
// }

// /* =====================================================
//    STATUS
// ===================================================== */

// function StatusBadge({ status }: { status: DealerStatus }) {
//   const config = {
//     ACTIVE: {
//       label: "Active",
//       className: "bg-emerald-50 text-emerald-700",
//       dot: "bg-emerald-500",
//     },

//     ON_LEAVE: {
//       label: "On Leave",
//       className: "bg-amber-50 text-amber-700",
//       dot: "bg-amber-500",
//     },

//     BUSY: {
//       label: "Busy",
//       className: "bg-blue-50 text-blue-700",
//       dot: "bg-blue-500",
//     },
//   };

//   const current = config[status];

//   return (
//     <span
//       className={`
//         inline-flex items-center gap-1.5
//         whitespace-nowrap rounded-full
//         px-2.5 py-1
//         text-xs font-medium
//         ${current.className}
//       `}
//     >
//       <span className={`h-2 w-2 rounded-full ${current.dot}`} />

//       {current.label}
//     </span>
//   );
// }

// /* =====================================================
//    HELPERS
// ===================================================== */

// function getInitials(name: string) {
//   return name
//     .split(" ")
//     .map((word) => word[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();
// }

import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  PhoneCall,
  RefreshCcw,
  RotateCcw,
  Search,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useDebounce } from "../../../hooks/useDebounce";

import {
  getDealerActivity,
  type DealerActivity,
  type DealerActivitySummary,
} from "../services/dealerActivityApi";

/* =====================================================
   DEFAULT SUMMARY
===================================================== */

const emptySummary: DealerActivitySummary = {
  totalDealers: 0,
  activeDealers: 0,
  onLeave: 0,

  assignedCalls: 0,
  appointments: 0,
  pending: 0,
  rescheduled: 0,
  cancelled: 0,
  closed: 0,
};

/* =====================================================
   COMPONENT
===================================================== */

export default function DealerActivityPage() {
  const navigate = useNavigate();

  /* =====================================================
     FILTERS
  ===================================================== */

  const today = getLocalDateString();

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const [selectedDate, setSelectedDate] = useState(today);

  /* =====================================================
     DATA
  ===================================================== */

  const [dealers, setDealers] = useState<DealerActivity[]>([]);

  const [summary, setSummary] = useState<DealerActivitySummary>(emptySummary);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /* =====================================================
     PAGINATION
  ===================================================== */

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(20);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  /* =====================================================
     LOAD DEALER ACTIVITY
  ===================================================== */

  const loadDealerActivity = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDealerActivity({
        date: selectedDate,
        search: debouncedSearch?.trim() || undefined,
        page,
        limit,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch dealer activity");
      }

      setDealers(response.data || []);

      setSummary(response.summary || emptySummary);

      setTotal(response.pagination?.total || 0);

      setTotalPages(response.pagination?.totalPages || 0);
    } catch (err: any) {
      console.error("Dealer activity error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch dealer activity",
      );

      setDealers([]);
      setSummary(emptySummary);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, debouncedSearch, page, limit]);

  /* =====================================================
     FETCH
  ===================================================== */

  useEffect(() => {
    loadDealerActivity();
  }, [loadDealerActivity]);

  /* =====================================================
     RESET PAGE WHEN FILTER CHANGES
  ===================================================== */

  useEffect(() => {
    setPage(1);
  }, [selectedDate, debouncedSearch]);

  /* =====================================================
     RESET FILTERS
  ===================================================== */

  const handleReset = () => {
    setSearch("");
    setSelectedDate(today);
    setPage(1);
  };

  /* =====================================================
     VIEW DEALER
  ===================================================== */

  const handleViewDealer = (dealer: DealerActivity) => {
    navigate(`/dealer-activity/${dealer._id}`);
  };

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="space-y-4">
      {/* =================================================
          HEADER
      ================================================== */}

      <div
        className="
          flex flex-col gap-3
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Dealer Activity
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor dealer activity for{" "}
            {selectedDate === today ? "today" : formatDate(selectedDate)}
          </p>
        </div>

        <div
          className="
            flex w-fit items-center gap-2
            rounded-lg
            bg-blue-50
            px-3 py-2
            text-xs font-medium
            text-[#123B7A]
          "
        >
          <CalendarDays size={15} />

          {formatDate(selectedDate)}

          {selectedDate === today && (
            <span
              className="
                rounded-full
                bg-blue-100
                px-2 py-0.5
                text-[10px]
                font-semibold
              "
            >
              TODAY
            </span>
          )}
        </div>
      </div>

      {/* =================================================
          FILTERS
      ================================================== */}

      <div
        className="
          rounded-xl
          border border-gray-200
          bg-white
          p-4
          shadow-sm
        "
      >
        <div
          className="
            flex flex-col gap-3
            md:flex-row
            md:items-end
          "
        >
          {/* =============================================
              SEARCH
          ============================================== */}

          <div className="w-full md:max-w-md">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Search Dealer
            </label>

            <div className="relative">
              <Search
                size={16}
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, code, mobile, firm or city..."
                className="
                  h-10 w-full
                  rounded-lg
                  border border-gray-300
                  bg-white
                  pl-9 pr-3
                  text-sm
                  text-gray-700
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-[#123B7A]
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>
          </div>

          {/* =============================================
              DATE
          ============================================== */}

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Activity Date
            </label>

            <div className="relative">
              <CalendarDays
                size={15}
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="date"
                value={selectedDate}
                max={today}
                onChange={(event) => {
                  setSelectedDate(event.target.value);

                  setPage(1);
                }}
                className="
                  h-10
                  rounded-lg
                  border border-gray-300
                  bg-white
                  pl-9 pr-2
                  text-sm
                  text-gray-700
                  outline-none
                  transition
                  focus:border-[#123B7A]
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>
          </div>

          {/* =============================================
              RESET
          ============================================== */}

          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="
              flex h-10
              items-center justify-center
              gap-2
              rounded-lg
              border border-gray-200
              bg-white
              px-4
              text-sm font-medium
              text-gray-600
              transition
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================== */}

      {error && (
        <div
          className="
            rounded-lg
            border border-red-200
            bg-red-50
            px-4 py-3
            text-sm
            text-red-700
          "
        >
          {error}

          <button
            type="button"
            onClick={loadDealerActivity}
            className="ml-2 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* =================================================
          SUMMARY
      ================================================== */}

      <div
        className="
          grid grid-cols-2 gap-3
          md:grid-cols-4
          xl:grid-cols-8
        "
      >
        <SummaryCard
          label="Total Dealers"
          value={summary.totalDealers}
          icon={Users}
          type="gray"
          loading={loading}
        />

        <SummaryCard
          label="Active Dealers"
          value={summary.activeDealers}
          icon={UserCheck}
          type="green"
          loading={loading}
        />

        <SummaryCard
          label="Assigned"
          value={summary.assignedCalls}
          icon={PhoneCall}
          type="blue"
          loading={loading}
        />

        <SummaryCard
          label="Appointments"
          value={summary.appointments}
          icon={CalendarDays}
          type="purple"
          loading={loading}
        />

        <SummaryCard
          label="Pending"
          value={summary.pending}
          icon={Clock3}
          type="orange"
          loading={loading}
        />

        <SummaryCard
          label="Rescheduled"
          value={summary.rescheduled}
          icon={RefreshCcw}
          type="cyan"
          loading={loading}
        />

        <SummaryCard
          label="Cancelled"
          value={summary.cancelled}
          icon={XCircle}
          type="red"
          loading={loading}
        />

        <SummaryCard
          label="Closed"
          value={summary.closed}
          icon={CheckCircle2}
          type="green"
          loading={loading}
        />
      </div>

      {/* =================================================
          TABLE
      ================================================== */}

      <div
        className="
          overflow-hidden
          rounded-xl
          border border-gray-200
          bg-white
          shadow-sm
        "
      >
        {/* ===============================================
            TABLE TOP
        ================================================ */}

        <div
          className="
            flex items-center
            justify-between
            border-b
            border-gray-200
            px-4 py-3
          "
        >
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Dealer Activity
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              {loading
                ? "Loading dealers..."
                : `${total} ${total === 1 ? "dealer" : "dealers"} found`}
            </p>
          </div>
        </div>

        {/* ===============================================
            TABLE
        ================================================ */}

        <div className="w-full overflow-x-auto lg:overflow-x-visible">
          <table
            className="
              w-full
              min-w-[1150px]
              table-auto
              lg:min-w-0
              lg:table-fixed
            "
          >
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <TableHead className="lg:w-[4%]">#</TableHead>

                <TableHead className="lg:w-[16%]">Dealer</TableHead>

                <TableHead className="lg:w-[10%]">ID</TableHead>

                <TableHead className="lg:w-[10%]">Mobile</TableHead>

                <TableHead className="lg:w-[13%]">Products</TableHead>

                <TableHead className="lg:w-[9%]">City</TableHead>

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

                <TableHead center className="lg:w-[7%]">
                  Status
                </TableHead>

                <TableHead center className="lg:w-[8%]">
                  Actions
                </TableHead>
              </tr>
            </thead>

            <tbody>
              {/* =========================================
                  LOADING
              ========================================== */}

              {loading &&
                Array.from({
                  length: 6,
                }).map((_, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td colSpan={12} className="px-3 py-3">
                      <div className="h-8 animate-pulse rounded bg-gray-100" />
                    </td>
                  </tr>
                ))}

              {/* =========================================
                  DATA
              ========================================== */}

              {!loading &&
                dealers.map((dealer, index) => (
                  <tr
                    key={dealer._id}
                    className="
                        border-b
                        border-gray-100
                        transition
                        last:border-b-0
                        hover:bg-gray-50/70
                      "
                  >
                    {/* # */}

                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>

                    {/* Dealer */}

                    <TableCell>
                      <div className="min-w-0">
                        <p
                          className="
                              truncate
                              font-semibold
                              text-gray-800
                            "
                          title={dealer.dealerName}
                        >
                          {dealer.dealerName || "-"}
                        </p>

                        {dealer.firmName && (
                          <p
                            className="
                                mt-0.5
                                truncate
                                text-[10px]
                                text-gray-400
                              "
                            title={dealer.firmName}
                          >
                            {dealer.firmName}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Dealer Code */}

                    <TableCell>
                      <span
                        className="
                            whitespace-nowrap
                            font-medium
                            text-gray-700
                          "
                      >
                        {dealer.dealerCode || "-"}
                      </span>
                    </TableCell>

                    {/* Mobile */}

                    <TableCell>
                      <span className="whitespace-nowrap">
                        {dealer.mobile || "-"}
                      </span>
                    </TableCell>

                    {/* Products */}

                    <TableCell>
                      <ProductList products={dealer.products} />
                    </TableCell>

                    {/* City */}

                    <TableCell>
                      <span
                        className="
                            block truncate
                          "
                        title={dealer.city}
                      >
                        {dealer.city || "-"}
                      </span>
                    </TableCell>

                    {/* Assigned */}

                    <TableCell center>
                      <CountBadge value={dealer.assignedCalls} type="blue" />
                    </TableCell>

                    {/* Appointments */}

                    <TableCell center>
                      <CountBadge value={dealer.appointments} type="purple" />
                    </TableCell>

                    {/* Pending */}

                    <TableCell center>
                      <CountBadge value={dealer.pending} type="orange" />
                    </TableCell>

                    {/* Closed */}

                    <TableCell center>
                      <CountBadge value={dealer.closed} type="green" />
                    </TableCell>

                    {/* Status */}

                    <TableCell center>
                      <DealerStatusBadge status={dealer.status} />
                    </TableCell>

                    {/* Actions */}

                    <TableCell center>
                      <button
                        type="button"
                        onClick={() => handleViewDealer(dealer)}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-1.5
                            rounded-lg
                            border
                            border-blue-200
                            bg-blue-50
                            px-2.5 py-1.5
                            text-xs
                            font-medium
                            text-[#123B7A]
                            transition
                            hover:bg-blue-100
                          "
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </TableCell>
                  </tr>
                ))}

              {/* =========================================
                  EMPTY
              ========================================== */}

              {!loading && !error && dealers.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-4 py-14 text-center">
                    <div className="flex flex-col items-center">
                      <div
                        className="
                            flex h-11 w-11
                            items-center
                            justify-center
                            rounded-full
                            bg-gray-100
                            text-gray-400
                          "
                      >
                        <Users size={20} />
                      </div>

                      <p className="mt-3 text-sm font-medium text-gray-700">
                        No dealers found
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {search
                          ? "Try changing your dealer search."
                          : `No dealer data found for ${formatDate(
                              selectedDate,
                            )}.`}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===============================================
            PAGINATION
        ================================================ */}

        {!loading && total > 0 && (
          <div
            className="
                flex flex-col gap-3
                border-t
                border-gray-200
                px-4 py-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
          >
            {/* Left */}

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>
                Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)}{" "}
                of {total}
              </span>

              <select
                value={limit}
                onChange={(event) => {
                  setLimit(Number(event.target.value));

                  setPage(1);
                }}
                className="
                    h-8 rounded-md
                    border
                    border-gray-200
                    bg-white
                    px-2
                    text-xs
                    outline-none
                  "
              >
                <option value={10}>10</option>

                <option value={20}>20</option>

                <option value={50}>50</option>
              </select>
            </div>

            {/* Right */}

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
                className="
                    h-8
                    rounded-md
                    border
                    border-gray-200
                    bg-white
                    px-3
                    text-xs
                    font-medium
                    text-gray-600
                    transition
                    hover:bg-gray-50
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
              >
                Previous
              </button>

              <span
                className="
                    text-xs
                    text-gray-500
                  "
              >
                Page {page} of {totalPages || 1}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => current + 1)}
                className="
                    h-8
                    rounded-md
                    border
                    border-gray-200
                    bg-white
                    px-3
                    text-xs
                    font-medium
                    text-gray-600
                    transition
                    hover:bg-gray-50
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   PRODUCTS
===================================================== */

function ProductList({ products }: { products: string[] }) {
  if (!products?.length) {
    return <span className="text-gray-400">-</span>;
  }

  const visibleProducts = products.slice(0, 2);

  const remaining = products.length - visibleProducts.length;

  return (
    <div className="flex min-w-0 flex-wrap gap-1">
      {visibleProducts.map((product) => (
        <span
          key={product}
          title={product}
          className="
              max-w-[90px]
              truncate
              rounded
              bg-gray-100
              px-1.5 py-0.5
              text-[10px]
              font-medium
              text-gray-600
            "
        >
          {product}
        </span>
      ))}

      {remaining > 0 && (
        <span
          title={products.slice(2).join(", ")}
          className="
            rounded
            bg-blue-50
            px-1.5 py-0.5
            text-[10px]
            font-medium
            text-blue-700
          "
        >
          +{remaining}
        </span>
      )}
    </div>
  );
}

/* =====================================================
   STATUS
===================================================== */

function DealerStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700",

    LEAVE: "bg-amber-50 text-amber-700",

    INACTIVE: "bg-gray-100 text-gray-600",

    SUSPENDED: "bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={`
        inline-flex
        whitespace-nowrap
        rounded-full
        px-2 py-1
        text-[10px]
        font-semibold

        ${styles[status] || "bg-gray-100 text-gray-600"}
      `}
    >
      {status?.replaceAll("_", " ") || "-"}
    </span>
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
        inline-flex
        min-w-8
        items-center
        justify-center
        rounded-full
        px-2 py-1
        text-[11px]
        font-semibold
        ${styles[type]}
      `}
    >
      {value ?? 0}
    </span>
  );
}

/* =====================================================
   SUMMARY CARD
===================================================== */

function SummaryCard({
  label,
  value,
  icon: Icon,
  type,
  loading = false,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  loading?: boolean;

  type: "gray" | "blue" | "purple" | "orange" | "cyan" | "red" | "green";
}) {
  const styles = {
    gray: {
      container: "bg-gray-50",
      icon: "bg-gray-200 text-gray-600",
      value: "text-gray-800",
    },

    blue: {
      container: "bg-blue-50",
      icon: "bg-blue-100 text-blue-600",
      value: "text-blue-700",
    },

    purple: {
      container: "bg-violet-50",
      icon: "bg-violet-100 text-violet-600",
      value: "text-violet-700",
    },

    orange: {
      container: "bg-amber-50",
      icon: "bg-amber-100 text-amber-600",
      value: "text-amber-700",
    },

    cyan: {
      container: "bg-cyan-50",
      icon: "bg-cyan-100 text-cyan-600",
      value: "text-cyan-700",
    },

    red: {
      container: "bg-rose-50",
      icon: "bg-rose-100 text-rose-600",
      value: "text-rose-700",
    },

    green: {
      container: "bg-emerald-50",
      icon: "bg-emerald-100 text-emerald-600",
      value: "text-emerald-700",
    },
  };

  const current = styles[type];

  return (
    <div
      className={`
        rounded-xl
        border border-gray-100
        p-3
        ${current.container}
      `}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p
            className="
              truncate
              text-[11px]
              font-medium
              text-gray-500
            "
          >
            {label}
          </p>

          {loading ? (
            <div className="mt-2 h-6 w-9 animate-pulse rounded bg-white/70" />
          ) : (
            <p
              className={`
                mt-1.5
                text-xl
                font-bold
                ${current.value}
              `}
            >
              {value ?? 0}
            </p>
          )}
        </div>

        <div
          className={`
            flex h-8 w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            ${current.icon}
          `}
        >
          <Icon size={16} />
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   TABLE HELPERS
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
        px-1.5 py-3
        text-[10px]
        font-semibold
        text-gray-600
        xl:px-2

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
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <td
      className={`
        overflow-hidden
        px-1.5 py-3
        text-[11px]
        text-gray-600
        xl:px-2

        ${center ? "text-center" : "text-left"}
      `}
    >
      {children}
    </td>
  );
}

/* =====================================================
   DATE
===================================================== */

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(date: string) {
  if (!date) {
    return "-";
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
