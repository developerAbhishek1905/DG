import SharedStatusBadge from "../../../components/ui/StatusBadge";
import { useCallback, useEffect, useState } from "react";
import Pagination from "../../../components/ui/Pagination";
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
  getDealerActivityRangeSummary,
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

  // Last 30 days totals (all dealers matching search)
  const [monthSummary, setMonthSummary] =
    useState<DealerActivitySummary>(emptySummary);
  const [monthRange, setMonthRange] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const [monthLoading, setMonthLoading] = useState(false);

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
     LOAD LAST 30 DAYS SUMMARY
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setMonthLoading(true);

        const response = await getDealerActivityRangeSummary({
          search: debouncedSearch?.trim() || undefined,
          days: 30,
        });

        if (cancelled) return;

        setMonthSummary(response.summary || emptySummary);
        setMonthRange(response.range || null);
      } catch (err) {
        console.error("Dealer activity 30 days summary error:", err);

        if (!cancelled) {
          setMonthSummary(emptySummary);
          setMonthRange(null);
        }
      } finally {
        if (!cancelled) setMonthLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

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
        </div>

        <div
          className="
            flex w-fit items-center gap-2
            rounded-lg
            bg-blue-50
            px-3 py-2
            text-xs font-medium
            text-[#6D28D9]
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
                  focus:border-[#6D28D9]
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
                  focus:border-[#6D28D9]
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

      <div className="space-y-4">
        {/* SELECTED DAY (TODAY BY DEFAULT) */}

        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-md bg-[#6D28D9] px-2 py-0.5 text-[11px] font-semibold text-white">
              {selectedDate === today ? "Today" : "Selected Day"}
            </span>

            <span className="text-xs text-gray-500">
              {formatDate(selectedDate)}
            </span>
          </div>

          <SummaryGrid summary={summary} loading={loading} />
        </div>

        {/* LAST 30 DAYS */}

        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-violet-600 px-2 py-0.5 text-[11px] font-semibold text-white">
              Last 30 Days
            </span>

            <span className="text-xs text-gray-500">
              {monthRange
                ? `${formatDate(monthRange.from)} - ${formatDate(monthRange.to)}`
                : ""}
            </span>

            <span className="text-[11px] text-gray-400">
              Pending and Rescheduled show current status
            </span>
          </div>

          <SummaryGrid summary={monthSummary} loading={monthLoading} />
        </div>
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
                            text-[#6D28D9]
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
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(value) => {
              setLimit(value);
              setPage(1);
            }}
          />
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
  return <SharedStatusBadge status={status} size="sm" />;
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
   SUMMARY GRID
===================================================== */

function SummaryGrid({
  summary,
  loading,
}: {
  summary: DealerActivitySummary;
  loading: boolean;
}) {
  return (
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
