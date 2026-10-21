import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  PhoneCall,
  RefreshCcw,
  RotateCcw,
  User,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getDealerDailyActivity,
  type DailyDealerActivity,
  type DealerActivityDealer,
  type DealerActivitySummary,
} from "../services/dealerActivityApi";

/* =====================================================
   DEFAULT SUMMARY
===================================================== */

const emptySummary: DealerActivitySummary = {
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

export default function DealerDailyActivityPage() {
  const navigate = useNavigate();
  const { dealerId } = useParams<{ dealerId: string }>();

  /* =====================================================
     STATE
  ===================================================== */

  const [dealer, setDealer] = useState<DealerActivityDealer | null>(null);
  const [activity, setActivity] = useState<DailyDealerActivity[]>([]);
  const [summary, setSummary] = useState<DealerActivitySummary>(emptySummary);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =====================================================
     DATE FILTER
  ===================================================== */

  const today = getLocalDateString();
  const [startDate, setStartDate] = useState(getFirstDayOfCurrentMonth());
  const [endDate, setEndDate] = useState(today);

  /* =====================================================
     LOAD ACTIVITY
  ===================================================== */

  const loadActivity = useCallback(async () => {
    if (!dealerId) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getDealerDailyActivity(
        dealerId,
        startDate,
        endDate,
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch dealer activity");
      }

      setDealer(response.data.dealer);
      setActivity(response.data.activity || []);
      setSummary(response.data.summary || emptySummary);
    } catch (err: any) {
      console.error("Dealer activity error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch dealer activity",
      );

      setActivity([]);
      setSummary(emptySummary);
    } finally {
      setLoading(false);
    }
  }, [dealerId, startDate, endDate]);

  /* =====================================================
     FETCH
  ===================================================== */

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  /* =====================================================
     DATE HANDLERS
  ===================================================== */

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    if (value && endDate && value > endDate) {
      setEndDate(value);
    }
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
  };

  const handleReset = () => {
    setStartDate(getFirstDayOfCurrentMonth());

    setEndDate(today);
  };

  /* =====================================================
     INVALID ROUTE
  ===================================================== */

  if (!dealerId) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <p className="text-sm text-gray-600">Invalid dealer.</p>

        <button
          type="button"
          onClick={() => navigate("/dealer-activity")}
          className="mt-4 text-sm font-medium text-[#123B7A]"
        >
          Back to Dealer Activity
        </button>
      </div>
    );
  }

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="space-y-4">
      {/* =================================================
          PAGE HEADER
      ================================================== */}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/dealer-activity")}
          className="
            flex h-9 w-9 shrink-0
            items-center justify-center
            rounded-lg
            border border-gray-200
            bg-white
            text-gray-600
            transition
            hover:bg-gray-50
            hover:text-[#123B7A]
          "
          title="Back"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Dealer Daily Activity
          </h1>
        </div>
      </div>

      {/* =================================================
          DEALER + FILTERS
      ================================================== */}

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div
          className="
            flex flex-col gap-4
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          {/* =============================================
              DEALER INFO
          ============================================== */}

          <div className="flex min-w-0 items-center gap-4">
            <div
              className="
                flex h-12 w-12 shrink-0
                items-center justify-center
                rounded-full
                bg-violet-600
                text-sm font-semibold
                text-white
              "
            >
              {dealer
                ? getInitials(dealer.dealerName || dealer.firmName || "D")
                : "D"}
            </div>

            <div className="min-w-0">
              {loading && !dealer ? (
                <>
                  <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />

                  <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-100" />
                </>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-base font-semibold text-gray-900">
                      {dealer?.dealerName || dealer?.firmName || "Dealer"}
                    </h2>

                    {dealer?.status && (
                      <DealerStatusBadge status={dealer.status} />
                    )}
                  </div>

                  <div
                    className="
                      mt-2 flex flex-wrap
                      items-center gap-x-5 gap-y-2
                      text-xs text-gray-500
                    "
                  >
                    {(dealer?.dealerCode || dealer?.headCode) && (
                      <span className="flex items-center gap-1.5">
                        <User size={14} />

                        {dealer.dealerCode || dealer.headCode}
                      </span>
                    )}

                    {dealer?.mobile && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} />

                        {dealer.mobile}
                      </span>
                    )}

                    {dealer?.city && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} />

                        {dealer.city}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* =============================================
              DATE FILTERS
          ============================================== */}

          <div className="flex flex-wrap items-end gap-2">
            {/* Start Date */}

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Start Date
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
                  value={startDate}
                  max={endDate || today}
                  onChange={(event) =>
                    handleStartDateChange(event.target.value)
                  }
                  className="
                    h-10 rounded-lg
                    border border-gray-300
                    bg-white
                    pl-9 pr-2
                    text-sm text-gray-700
                    outline-none
                    transition
                    focus:border-[#123B7A]
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />
              </div>
            </div>

            {/* End Date */}

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                End Date
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
                  value={endDate}
                  min={startDate || undefined}
                  max={today}
                  onChange={(event) => handleEndDateChange(event.target.value)}
                  className="
                    h-10 rounded-lg
                    border border-gray-300
                    bg-white
                    pl-9 pr-2
                    text-sm text-gray-700
                    outline-none
                    transition
                    focus:border-[#123B7A]
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />
              </div>
            </div>

            {/* Reset */}

            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="
                flex h-10 items-center gap-2
                rounded-lg
                border border-gray-200
                bg-white px-3
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
            text-sm text-red-700
          "
        >
          {error}

          <button
            type="button"
            onClick={loadActivity}
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
          md:grid-cols-3
          xl:grid-cols-6
        "
      >
        <SummaryCard
          label="Assigned Calls"
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
        {/* Table Header */}

        <div
          className="
            flex flex-col gap-2
            border-b border-gray-200
            px-4 py-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Date-wise Activity
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              {loading
                ? "Loading activity..."
                : `${activity.length} ${
                    activity.length === 1 ? "day" : "days"
                  } found`}
            </p>
          </div>

          <div
            className="
              flex w-fit items-center gap-1.5
              rounded-lg
              bg-blue-50
              px-3 py-2
              text-xs font-medium
              text-[#123B7A]
            "
          >
            <CalendarDays size={14} />

            {formatDate(startDate)}

            <span>—</span>

            {formatDate(endDate)}
          </div>
        </div>

        {/* ===============================================
            TABLE

            Mobile/tablet = horizontal scroll
            Desktop = single screen
        ================================================ */}

        <div className="w-full overflow-x-auto lg:overflow-x-visible">
          <table
            className="
              w-full min-w-[800px]
              table-auto
              lg:min-w-0
              lg:table-fixed
            "
          >
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <TableHead className="lg:w-[6%]">#</TableHead>

                <TableHead className="lg:w-[20%]">Date</TableHead>

                <TableHead center className="lg:w-[14%]">
                  Assigned
                </TableHead>

                <TableHead center className="lg:w-[15%]">
                  Appointments
                </TableHead>

                <TableHead center className="lg:w-[12%]">
                  Pending
                </TableHead>

                <TableHead center className="lg:w-[14%]">
                  Rescheduled
                </TableHead>

                <TableHead center className="lg:w-[12%]">
                  Cancelled
                </TableHead>

                <TableHead center className="lg:w-[12%]">
                  Closed
                </TableHead>
              </tr>
            </thead>

            <tbody>
              {/* =========================================
                  LOADING
              ========================================== */}

              {loading &&
                Array.from({
                  length: 5,
                }).map((_, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td colSpan={8} className="px-3 py-3">
                      <div className="h-7 animate-pulse rounded bg-gray-100" />
                    </td>
                  </tr>
                ))}

              {/* =========================================
                  DATA
              ========================================== */}

              {!loading &&
                activity.map((item, index) => (
                  <tr
                    key={item.date}
                    className="
                        border-b border-gray-100
                        transition
                        last:border-b-0
                        hover:bg-gray-50/70
                      "
                  >
                    <TableCell>{index + 1}</TableCell>

                    {/* Date */}

                    <TableCell>
                      <div>
                        <p className="whitespace-nowrap font-medium text-gray-800">
                          {formatDate(item.date)}
                        </p>

                        <p className="mt-0.5 text-[10px] text-gray-400">
                          {getDayName(item.date)}
                        </p>
                      </div>
                    </TableCell>

                    {/* Assigned */}

                    <TableCell center>
                      <CountBadge value={item.assignedCalls} type="blue" />
                    </TableCell>

                    {/* Appointments */}

                    <TableCell center>
                      <CountBadge value={item.appointments} type="purple" />
                    </TableCell>

                    {/* Pending */}

                    <TableCell center>
                      <CountBadge value={item.pending} type="orange" />
                    </TableCell>

                    {/* Rescheduled */}

                    <TableCell center>
                      <CountBadge value={item.rescheduled} type="cyan" />
                    </TableCell>

                    {/* Cancelled */}

                    <TableCell center>
                      <CountBadge value={item.cancelled} type="red" />
                    </TableCell>

                    {/* Closed */}

                    <TableCell center>
                      <CountBadge value={item.closed} type="green" />
                    </TableCell>
                  </tr>
                ))}

              {/* =========================================
                  EMPTY
              ========================================== */}

              {!loading && !error && activity.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-14 text-center">
                    <div className="flex flex-col items-center">
                      <div
                        className="
                            flex h-11 w-11
                            items-center justify-center
                            rounded-full
                            bg-gray-100
                            text-gray-400
                          "
                      >
                        <CalendarDays size={20} />
                      </div>

                      <p className="mt-3 text-sm font-medium text-gray-700">
                        No activity found
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        No dealer activity found between {formatDate(startDate)}{" "}
                        and {formatDate(endDate)}.
                      </p>
                    </div>
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

  type: "blue" | "purple" | "orange" | "cyan" | "red" | "green";
}) {
  const styles = {
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
        p-4
        ${current.container}
      `}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-gray-500">{label}</p>

          {loading ? (
            <div className="mt-2 h-7 w-10 animate-pulse rounded bg-white/70" />
          ) : (
            <p
              className={`
                mt-2 text-2xl
                font-bold
                ${current.value}
              `}
            >
              {value}
            </p>
          )}
        </div>

        <div
          className={`
            flex h-9 w-9 shrink-0
            items-center justify-center
            rounded-full
            ${current.icon}
          `}
        >
          <Icon size={18} />
        </div>
      </div>
    </div>
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

  type: "blue" | "purple" | "orange" | "cyan" | "red" | "green";
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-700",

    purple: "bg-violet-50 text-violet-700",

    orange: "bg-amber-50 text-amber-700",

    cyan: "bg-cyan-50 text-cyan-700",

    red: "bg-rose-50 text-rose-700",

    green: "bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`
        inline-flex min-w-9
        items-center justify-center
        rounded-full
        px-2 py-1
        text-xs font-semibold
        ${styles[type]}
      `}
    >
      {value}
    </span>
  );
}

/* =====================================================
   DEALER STATUS
===================================================== */

function DealerStatusBadge({ status }: { status: string }) {
  let className = "bg-gray-100 text-gray-700";

  if (status === "ACTIVE") {
    className = "bg-emerald-50 text-emerald-700";
  } else if (status === "ON_LEAVE") {
    className = "bg-amber-50 text-amber-700";
  } else if (status === "SUSPENDED") {
    className = "bg-rose-50 text-rose-700";
  }

  return (
    <span
      className={`
        inline-flex
        whitespace-nowrap
        rounded-full
        px-2.5 py-1
        text-xs font-medium
        ${className}
      `}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

/* =====================================================
   TABLE
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
        text-[11px]
        font-semibold
        text-gray-600
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
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <td
      className={`
        overflow-hidden
        px-2 py-3
        text-xs
        text-gray-600
        xl:px-3

        ${center ? "text-center" : "text-left"}
      `}
    >
      {children}
    </td>
  );
}

/* =====================================================
   DATE HELPERS
===================================================== */

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getFirstDayOfCurrentMonth() {
  const date = new Date();

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-01`;
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

function getDayName(date: string) {
  if (!date) {
    return "";
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
