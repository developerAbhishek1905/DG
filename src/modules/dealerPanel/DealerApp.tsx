import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { logoutSuccess } from "../auth/store/authSlice";
import {
  getAppointments,
  getComplaintActivities,
  getAppointmentById,
  getReasonDropdown,
  getRemarksSentToDealer,
  updateAppointmentStatus,
  type ComplaintActivity,
  type SentRemark,
} from "../appointments/services/appointmentApi";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../notifications/services/notificationApi";
import type { Notification } from "../notifications/types/notification.types";
import { searchCategories } from "../complaints/services/complaintApi";
import { complaintTypeLabel } from "../appointments/utils/complaintTypeLabel";
import { cancelLeave, getMyLeaves, registerLeave, type DealerLeave } from "./leaveApi";
import { changePassword } from "../profile/services/profileApi";
import { getDealerLedgers } from "../billing/services/billingApi";
import type { DealerLedger } from "../billing/types/billing.types";
import {
  getDealerStatement,
  getDealerUnpaidBills,
  type DealerStatement,
  type DealerUnpaidBill,
} from "../ledger/services/ledgerApi";
import "../../layouts/DealerLayout/dealerTheme.css";

/* ------------------------------------------------------------------ */
/* icons (same paths as the design)                                    */
/* ------------------------------------------------------------------ */
const P: Record<string, string> = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 7l9 6 9-6"/>',
  resch: '<path d="M20 11a8 8 0 00-14-4L4 9"/><path d="M4 4v5h5"/><path d="M4 13a8 8 0 0014 4l2-2"/><path d="M20 20v-5h-5"/>',
  more: '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
  bell: '<path d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 004 0"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
  wrench: '<path d="M14 6a4 4 0 005 5l-9 9a2.1 2.1 0 01-3-3l9-9a4 4 0 00-2-2z"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  phone: '<path d="M5 3h4l2 5-2 1a11 11 0 006 6l1-2 5 2v4a2 2 0 01-2 2A17 17 0 013 5a2 2 0 012-2z"/>',
  pin: '<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  down: '<path d="M12 4v12M6 11l6 6 6-6M5 20h14"/>',
  x2: '<circle cx="12" cy="12" r="9"/><path d="M5 5l14 14"/>',
  check: '<path d="M5 13l4 4L19 7"/>',
  leave: '<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M8 2v4M16 2v4M3 10h18"/>',
  ledger: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  bill: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
  out: '<path d="M9 4H5a2 2 0 00-2 2v12a2 2 0 002 2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
};
function Ic({ n, s = 20, sw = 1.8 }: { n: string; s?: number; sw?: number }) {
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: P[n] }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */
const COL: Record<string, [string, string]> = {
  Appointment: ["#c9eeee", "#0d6b6b"],
  New: ["#d3f5cc", "#1b7a2c"],
  "Not Scheduled": ["#e9e9f2", "#5b5f78"],
  Visited: ["#ffe6b8", "#8a5a00"],
  Pending: ["#fbd5c8", "#a3441f"],
  Upcoming: ["#cfe0fb", "#25549c"],
  "On leave": ["#fbd5c8", "#a3441f"],
  Completed: ["#c9eeee", "#0d6b6b"],
  Approved: ["#c9eeee", "#0d6b6b"],
  Billed: ["#cfe0fb", "#25549c"],
  Reversed: ["#fbd5c8", "#a3441f"],
  Reschedule: ["#e6e2fb", "#5a4bc4"],
  Closed: ["#cfe0fb", "#25549c"],
  Cancelled: ["#fbd0d8", "#a52d44"],
  Urgent: ["#fbd0d8", "#a52d44"],
  High: ["#fbd5c8", "#a3441f"],
  Normal: ["#c9eeee", "#0d6b6b"],
};
const Chip = ({ s }: { s: string }) => {
  const c = COL[s] || ["#e6e2fb", "#5a4bc4"];
  return (
    <span className="chip" style={{ background: c[0], color: c[1] }}>
      {s}
    </span>
  );
};

const pad = (n: number) => String(n).padStart(2, "0");
const localYmd = (d = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const TODAY = localYmd();
const ymd = (v?: string | null) => (v ? String(v).slice(0, 10) : "");
const fmtDate = (s?: string) =>
  !s
    ? "—"
    : s === TODAY
      ? "Today"
      : new Date(s + "T12:00:00").toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        });
const time12 = (s?: string) => {
  if (!s) return "";
  if (/am|pm/i.test(s)) return s;
  const m = s.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return s;
  const h = +m[1];
  return `${h % 12 || 12}:${m[2]} ${h >= 12 ? "PM" : "AM"}`;
};
const to24 = (s?: string) => {
  const m = (s || "").match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!m) return "";
  let h = +m[1];
  if (m[3]) h = (h % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0);
  return `${pad(h)}:${m[2]}`;
};
const fmtDateTime = (s?: string) =>
  s
    ? new Date(s).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
const rupees = (n?: number) =>
  `₹${Math.abs(Number(n) || 0).toLocaleString("en-IN")}`;

interface Call {
  id: string;
  no: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  product: string;
  brand: string;
  problem: string;
  date: string;
  time: string;
  status: string;
  repeat: string;
  note: string;
  oldDate: string;
  oldTime: string;
  reschedules: number;
  raw: string;
  complaintAt: string;
  altPhone: string;
  productType: string;
  category: string;
  categoryDesc: string;
  units: string;
  typeLabel: string;
  fullAddress: string;
  pendingReason: string;
  cancelReason: string;
}

const formatReason = (v?: string) =>
  v
    ? v.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (ch) => ch.toUpperCase())
    : "";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCall(a: any): Call {
  const raw = String(a.status || "");
  const count = Number(a.rescheduleCount) || 0;
  let status = "Pending";
  if (raw === "ALLOCATED" || raw === "REOPEN") status = "New";
  else if (raw === "APPOINTMENT_SCHEDULED")
    status = count > 0 ? "Reschedule" : "Appointment";
  else if (raw === "RESCHEDULED") status = "Reschedule";
  else if (raw === "VISITED") status = "Visited";
  else if (raw.startsWith("CANCEL")) status = "Cancelled";
  else if (
    ["CLOSED", "CLOSE_ON_BILLING", "CLOSE_ON_VERIFICATION", "WORK_COMPLETED", "DG_VERIFICATION"].includes(raw)
  )
    status = "Closed";
  const addr = a.address;
  return {
    id: a._id,
    no: a.complaintNumber || "—",
    name: a.customerName || a.customer?.name || "—",
    phone: a.phone || a.customer?.phone || "",
    city: addr?.city || "",
    address: [addr?.addressLine, addr?.city].filter(Boolean).join(", ") || "—",
    product: a.productName || a.category || "—",
    brand: a.brand || "",
    problem: a.faultReported || "—",
    date: ymd(a.appointmentDate),
    time: time12(a.appointmentTime),
    status,
    repeat:
      a.complaintType === "REPEAT" ? "Repeat customer" : "New customer",
    note: a.pendingReason || a.cancellationReason || a.rescheduleReason || "",
    oldDate: ymd(a.originalAppointmentDate),
    oldTime: time12(a.originalAppointmentTime),
    reschedules: count,
    raw,
    complaintAt: a.complaintDateTime || a.createdAt || "",
    altPhone: a.alternatePhone || "",
    productType: a.productType || "",
    category: a.category || "",
    categoryDesc: a.categoryId?.description || "",
    units: a.units != null ? String(a.units) : "",
    typeLabel: complaintTypeLabel(a, true),
    fullAddress:
      [addr?.addressLine, addr?.city, addr?.district, addr?.state, addr?.pinCode]
        .filter(Boolean)
        .join(", ") || "—",
    pendingReason: a.pendingReason || "",
    cancelReason: a.cancellationReason || "",
  };
}

type View =
  | "home"
  | "calls"
  | "inbox"
  | "resched"
  | "ledger"
  | "statement"
  | "billing"
  | "profile"
  | "leave"
  | "alerts"
  | "cancelled"
  | "closed";
type Sheet =
  | null
  | { t: "more" }
  | { t: "details"; id: string }
  | { t: "resched"; id: string }
  | { t: "bill"; id: string }
  | { t: "schedule"; id: string }
  | { t: "billing"; id: string }
  | { t: "reason"; id: string; kind: ReasonKind }
  | { t: "history"; id: string };

type ReasonKind =
  | "on_call_pending"
  | "on_call_cancel"
  | "after_call_pending"
  | "after_call_cancel"
  | "close";
const REASON_META: Record<ReasonKind, { title: string; status: string; key: string }> = {
  on_call_pending: { title: "Mark Complaint Pending", status: "PENDING_ON_CALL", key: "pendingReason" },
  on_call_cancel: { title: "Cancel Complaint", status: "CANCEL_ON_CALL", key: "cancellationReason" },
  after_call_pending: { title: "Pending on Visit", status: "PENDING_ON_VISIT", key: "pendingReason" },
  after_call_cancel: { title: "Cancel on Visit", status: "CANCEL_ON_VISIT", key: "cancellationReason" },
  close: { title: "Close Complaint", status: "CLOSE_ON_BILLING", key: "closingReason" },
};

const MORE_VIEWS: View[] = ["ledger", "statement", "billing", "profile", "leave", "alerts", "cancelled", "closed"];

/* ------------------------------------------------------------------ */
export default function DealerApp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [params] = useSearchParams();
  const user = useAppSelector((s) => s.auth.user);

  const initial = (params.get("view") as View) || "home";
  const [view, setView] = useState<View>(initial);
  const [filter, setFilter] = useState("ALL");
  const [q, setQ] = useState("");
  const [sheet, setSheet] = useState<Sheet>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Notification[]>([]);
  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const searchRef = useRef<HTMLInputElement>(null);

  const toast = (m: string) => {
    setToastMsg(m);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 2300);
  };

  const loadCalls = useCallback(async () => {
    try {
      // API returns max 100 per page – load every page so older closed /
      // cancelled complaints are not cut off.
      const first = await getAppointments({ page: 1, limit: 100 });
      let all = first?.data || [];
      const pages = Math.min(first?.pagination?.totalPages || 1, 30);
      for (let p = 2; p <= pages; p++) {
        const next = await getAppointments({ page: p, limit: 100 });
        all = all.concat(next?.data || []);
      }
      // Once DG approves the bill (CLOSED) or confirms the cancellation
      // (CANCELLED) the complaint leaves the dealer panel.
      setCalls(
        all
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((a: any) => a.status !== "CLOSED" && a.status !== "CANCELLED")
          .map(toCall),
      );
    } catch {
      toast("Failed to load calls");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadNotes = useCallback(async () => {
    try {
      const res = await getNotifications();
      setNotes(res.notifications);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    loadCalls();
    loadNotes();
    const t = setInterval(loadNotes, 30000);
    return () => clearInterval(t);
  }, [loadCalls, loadNotes]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  const go = (v: View, focus = false) => {
    setView(v);
    if (focus) setTimeout(() => searchRef.current?.focus(), 60);
  };
  const setFilterGo = (f: string) => {
    setFilter(f);
    setView("calls");
  };

  const unread = notes.filter((n) => !n.isRead).length;
  const cnt = (s: string) => calls.filter((c) => c.status === s).length;
  const byId = (id: string) => calls.find((c) => c.id === id);
  const openComplaint = (id?: string) => {
    if (id && calls.some((c) => c.id === id)) setSheet({ t: "details", id });
    else toast("Complaint not found in your list");
  };

  const matches = (c: Call) =>
    !q ||
    [c.name, c.no, c.phone, c.city, c.product, c.problem]
      .join(" ")
      .toLowerCase()
      .includes(q.toLowerCase());

  const logout = () => {
    ["token", "authUser", "role", "isLoggedIn", "user"].forEach((k) =>
      localStorage.removeItem(k),
    );
    dispatch(logoutSuccess());
    navigate("/login", { replace: true });
  };

  const exportCSV = () => {
    const h = [
      "Complaint No",
      "Customer",
      "Phone",
      "City",
      "Product",
      "Brand",
      "Issue",
      "Date",
      "Time",
      "Status",
      "Customer Type",
    ];
    const rows = calls.map((c) => [
      c.no,
      c.name,
      c.phone,
      c.city,
      c.product,
      c.brand,
      c.problem,
      c.date,
      c.time,
      c.status,
      c.repeat,
    ]);
    const csv = [h, ...rows]
      .map((r) => r.map((v) => '"' + String(v ?? "").replace(/"/g, '""') + '"').join(","))
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "dg-dealer-calls.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("CSV exported");
  };

  /* ---------------- pieces ---------------- */
  const Item = ({ c }: { c: Call }) => (
    <div className="item" onClick={() => setSheet({ t: "details", id: c.id })}>
      <div
        className="logo"
        style={{ background: COL[c.status][0], color: COL[c.status][1] }}
      >
        <Ic n="wrench" />
      </div>
      <div className="mid">
        <b>{c.name}</b>
        <small>
          {c.no} · {[c.brand, c.product].filter(Boolean).join(" ")}
        </small>
      </div>
      <div className="tm">
        {c.date || c.time ? (
          <>
            {c.time || "—"}
            <small>{fmtDate(c.date)}</small>
          </>
        ) : (
          <Chip s="Not Scheduled" />
        )}
        <div style={{ marginTop: 6 }}><Chip s={c.status} /></div>
      </div>
    </div>
  );

  const Ticket = ({ c }: { c: Call }) => (
    <div className="ticket">
      <div className="row">
        <div className="brand">
          <div className="logo">
            <Ic n="wrench" s={18} />
          </div>
          <div>
            <small>{c.repeat}</small>
            <b>{c.no}</b>
          </div>
        </div>
        <Chip s={c.status} />
      </div>
      <div className="route">
        <div>
          <small>Customer</small>
          <b>{c.name.split(" ")[0]}</b>
        </div>
        <div className="dash" />
        <div style={{ textAlign: "right" }}>
          <small>{fmtDate(c.date)}</small>
          <b>{(c.time || "—").replace(" ", "")}</b>
        </div>
      </div>
      <div className="foot">
        <div>
          <small>Product</small>
          <b>{[c.brand, c.product].filter(Boolean).join(" ")}</b>
        </div>
        <button className="btn" onClick={() => setSheet({ t: "details", id: c.id })}>
          See Details
        </button>
      </div>
    </div>
  );

  const SheetTop = ({ t }: { t: string }) => (
    <div className="sh-top">
      <button className="round" onClick={() => setSheet(null)}>
        <Ic n="back" />
      </button>
      <b style={{ fontSize: 16 }}>{t}</b>
      <span style={{ width: 42 }} />
    </div>
  );

  /* ---------------- views ---------------- */
  const renderHome = () => {
    const tiles: [string, string][] = [
      ["New", "New"],
      ["Appointment", "Scheduled"],
      ["Reschedule", "Moved"],
      ["Visited", "Visited"],
      ["Pending", "Pending"],
      ["Closed", "Closed"],
      ["Cancelled", "Cancelled"],
      ["ALL", "All"],
    ];
    const up = calls
      .filter((c) => ["Appointment", "Reschedule"].includes(c.status))
      .sort((a, b) => (a.date + to24(a.time)).localeCompare(b.date + to24(b.time)))
      .slice(0, 6);
    const newOnes = calls.filter((c) => c.status === "New");
    const ongoing = calls.filter((c) => c.status === "Visited");
    const dealerName =
      user?.dealer?.technicianFirmName ||
      user?.dealer?.technicianName ||
      user?.name ||
      "Dealer";
    return (
      <>
        <h1>
          Hi!
          <br />
          <em>{dealerName}</em>
        </h1>
        <div className="tiles">
          {tiles.map(([s, l]) => (
            <button
              key={s}
              className="tile"
              style={{ background: s === "ALL" ? "#e6e2fb" : COL[s][0] }}
              onClick={() => setFilterGo(s)}
            >
              {l}
              <span>{s === "ALL" ? calls.length : cnt(s)}</span>
            </button>
          ))}
        </div>
        <div className="sec">
          <h2>Upcoming Schedules</h2>
          <a onClick={() => go("calls")}>View All</a>
        </div>
        <div className="rail">
          {up.length ? (
            up.map((c) => <Ticket key={c.id} c={c} />)
          ) : (
            <p className="empty" style={{ width: "100%" }}>
              {loading ? "Loading…" : "No upcoming visits"}
            </p>
          )}
        </div>
        <div className="sec">
          <h2>Ongoing Complaints</h2>
          <a onClick={() => setFilterGo("Visited")}>{ongoing.length} items</a>
        </div>
        {ongoing.length === 0 && (
          <p className="empty">{loading ? "Loading…" : "No ongoing complaints"}</p>
        )}
        {ongoing.slice(0, 4).map((c) => (
          <Item key={c.id} c={c} />
        ))}
        <div className="sec">
          <h2>New Complaints</h2>
          <a onClick={() => setFilterGo("New")}>{newOnes.length} items</a>
        </div>
        {newOnes.length === 0 && (
          <p className="empty">{loading ? "Loading…" : "No new complaints"}</p>
        )}
        {newOnes.slice(0, 4).map((c) => (
          <Item key={c.id} c={c} />
        ))}
      </>
    );
  };

  const renderCalls = () => {
    const base =
      view === "cancelled"
        ? "Cancelled"
        : view === "closed"
          ? "Closed"
          : filter === "ALL"
            ? null
            : filter;
    const list = calls.filter((c) => (!base || c.status === base) && matches(c));
    const title =
      view === "cancelled"
        ? "Cancelled Calls"
        : view === "closed"
          ? "Closed Calls"
          : "All Complaints";
    const [first, ...rest] = title.split(" ");
    return (
      <>
        <h1>
          {first}
          <br />
          <em>{rest.join(" ")}</em>
        </h1>
        <div className="search">
          <Ic n="search" s={18} />
          <input
            ref={searchRef}
            placeholder="Search name, phone, complaint no…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        {view === "calls" && (
          <div className="fchips">
            {["ALL", "New", "Appointment", "Reschedule", "Visited", "Pending", "Closed", "Cancelled"].map((f) => (
              <button key={f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>
                {f === "ALL" ? "All" : f}
              </button>
            ))}
          </div>
        )}
        <div className="sec">
          <h2>{base || "Every status"}</h2>
          <a>{list.length} items</a>
        </div>
        <div>
          {list.length ? (
            list.map((c) => <Item key={c.id} c={c} />)
          ) : (
            <p className="empty">{loading ? "Loading…" : "No complaints match"}</p>
          )}
        </div>
      </>
    );
  };

  const prio = (p?: string) =>
    p === "CRITICAL" ? "Urgent" : p === "HIGH" ? "High" : "Normal";

  const msgCards = () => (
    <>
      {notes.length === 0 && <p className="empty">No notifications</p>}
      {notes.map((m) => {
        const c = m.entityId ? byId(m.entityId) : undefined;
        return (
          <div
            key={m.id}
            className="ticket"
            style={{
              marginBottom: 12,
              boxShadow: !m.isRead
                ? "0 0 0 2px var(--lav) inset,0 10px 30px #7a82b022"
                : undefined,
            }}
          >
            <div className="row">
              <div className="brand">
                <div className="logo">
                  <Ic n="mail" s={18} />
                </div>
                <div>
                  <small>DG Team · {fmtDateTime(m.createdAt)}</small>
                  <b style={{ fontSize: 14 }}>
                    {m.title}
                    {!m.isRead && <span style={{ color: "#ff4d5e" }}> ●</span>}
                  </b>
                </div>
              </div>
              <Chip s={prio(m.priority)} />
            </div>
            {c && (
              <div className="kv" style={{ marginTop: 14 }}>
                <div><small>Complaint</small><b>{c.no}</b></div>
                <div><small>Customer</small><b>{c.name}</b></div>
                <div><small>Product</small><b>{[c.brand, c.product].filter(Boolean).join(" ")}</b></div>
                <div><small>Area</small><b>{c.city || "—"}</b></div>
              </div>
            )}
            <div className="note">{m.message}</div>
            <div className="acts">
              <button
                className="btn alt sm"
                onClick={async () => { await markNotificationRead(m.id); loadNotes(); toast("Message marked as read"); }}
              >
                {m.isRead ? "Read ✓" : "Mark as read"}
              </button>
              <button
                className="btn sm"
                onClick={async () => {
                  await markNotificationRead(m.id);
                  loadNotes();
                  openComplaint(m.entityId);
                }}
              >
                Open complaint
              </button>
            </div>
          </div>
        );
      })}
    </>
  );

  const renderInbox = () => (
    <>
      <h1>
        DG Team
        <br />
        <em>Inbox</em>
      </h1>
      <div className="sec" style={{ marginTop: 0 }}>
        <h2>Messages</h2>
        <a onClick={async () => { await markAllNotificationsRead(); loadNotes(); }}>
          {unread} unread
        </a>
      </div>
      {msgCards()}
    </>
  );

  const renderResched = () => {
    const list = calls.filter((c) => c.status === "Reschedule");
    return (
      <>
        <h1>
          Reschedule
          <br />
          <em>Desk</em>
        </h1>
        <div className="sec" style={{ marginTop: 0 }}>
          <h2>Slot changes</h2>
          <a>{list.length} items</a>
        </div>
        {list.length === 0 && <p className="empty">No rescheduled visits</p>}
        {list.map((r) => (
          <div key={r.id} className="ticket" style={{ marginBottom: 12 }}>
            <div className="row">
              <div className="brand">
                <div className="logo"><Ic n="resch" s={18} /></div>
                <div>
                  <small>{r.no} · {r.product}</small>
                  <b>{r.name}</b>
                </div>
              </div>
              <Chip s="Reschedule" />
            </div>
            <div className="route">
              <div>
                <small>Original · {fmtDate(r.oldDate)}</small>
                <b>{(r.oldTime || "—").replace(" ", "")}</b>
              </div>
              <div className="dash" />
              <div style={{ textAlign: "right" }}>
                <small>Current · {fmtDate(r.date)}</small>
                <b>{(r.time || "—").replace(" ", "")}</b>
              </div>
            </div>
            {r.note && (
              <div className="note" style={{ marginTop: 0 }}>
                <b>Reason:</b> {r.note}
              </div>
            )}
            <div className="acts">
              <button className="btn alt sm" onClick={() => setSheet({ t: "history", id: r.id })}>History</button>
              <button className="btn alt sm" onClick={() => setSheet({ t: "resched", id: r.id })}>Change again</button>
            </div>
          </div>
        ))}
      </>
    );
  };

  const [ledger, setLedger] = useState<{
    opening: number; openingType: string; debit: number; credit: number; net: number; type: string;
  } | null>(null);
  const [ledgerErr, setLedgerErr] = useState("");
  const [bills, setBills] = useState<DealerUnpaidBill[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawDealer: any = user?.dealerId;
  const dealerId: string | undefined =
    (typeof rawDealer === "object" ? rawDealer?._id || rawDealer?.id : rawDealer) ||
    user?.dealer?._id;
  useEffect(() => {
    if ((view !== "ledger" && view !== "statement") || !dealerId) return;
    getDealerUnpaidBills(dealerId)
      .then((d) => {
        setBills(d.bills || []);
        const s = d.summary;
        setLedger({
          opening: s.openingBalance, openingType: s.openingBalanceType,
          debit: s.totalDebit, credit: s.totalCredit, net: s.netOutstanding, type: s.balanceType,
        });
        setLedgerErr("");
      })
      .catch(() => setLedgerErr("Unable to load ledger"));
  }, [view, dealerId]);

  const renderLedger = () => (
    <>
      <h1>
        Dealer
        <br />
        <em>Ledger</em>
      </h1>
      <div className="card" style={{ marginTop: 0 }}>
        {ledger ? (
          <>
            <div className="dr"><span>Opening balance</span><b>{rupees(ledger.opening)} {ledger.openingType}</b></div>
            <div className="dr"><span>Total debit</span><b>{rupees(ledger.debit)}</b></div>
            <div className="dr"><span>Total credit</span><b>{rupees(ledger.credit)}</b></div>
            <div className="dr"><span>Net outstanding</span><b>{rupees(ledger.net)} {ledger.type === "SETTLED" ? "" : ledger.type === "DEBIT" ? "Dr" : "Cr"}</b></div>
          </>
        ) : (
          <p className="empty">{ledgerErr || "Loading…"}</p>
        )}
      </div>
      <div className="acts">
        <button className="btn alt wide" onClick={() => go("statement")}>Open full statement</button>
      </div>
    </>
  );

  /* ---------- full statement ---------- */
  const [stTab, setStTab] = useState<"statement" | "unpaid">("statement");
  const [stFrom, setStFrom] = useState("");
  const [stTo, setStTo] = useState("");
  const [stmt, setStmt] = useState<DealerStatement | null>(null);
  const [stLoading, setStLoading] = useState(false);
  const [stErr, setStErr] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (view !== "statement" || !dealerId) return;
    setStLoading(true);
    getDealerStatement(dealerId, { fromDate: stFrom, toDate: stTo })
      .then((d) => { setStmt(d); setStErr(""); })
      .catch(() => setStErr("Unable to load statement"))
      .finally(() => setStLoading(false));
  }, [view, dealerId, stFrom, stTo]);

  const drcr = (n: number) => `${rupees(n)} ${n >= 0 ? "Dr" : "Cr"}`;
  const sdate = (v?: string) =>
    v ? new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";

  const renderStatement = () => (
    <>
      <h1>
        Dealer
        <br />
        <em>Statement</em>
      </h1>
      <div className="fchips" style={{ marginTop: 0 }}>
        <button onClick={() => go("ledger")}>← Ledger</button>
        <button className={stTab === "statement" ? "on" : ""} onClick={() => setStTab("statement")}>Statement</button>
        <button className={stTab === "unpaid" ? "on" : ""} onClick={() => setStTab("unpaid")}>Unpaid bills</button>
      </div>

      {stTab === "statement" && (
        <>
          <div className="card">
            <div className="g2">
              <div className="field" style={{ marginTop: 0 }}><label>From</label>
                <input type="date" value={stFrom} onChange={(e) => setStFrom(e.target.value)} /></div>
              <div className="field" style={{ marginTop: 0 }}><label>To</label>
                <input type="date" value={stTo} onChange={(e) => setStTo(e.target.value)} /></div>
            </div>
            {(stFrom || stTo) && (
              <button className="btn alt sm" style={{ marginTop: 10 }} onClick={() => { setStFrom(""); setStTo(""); }}>Clear dates</button>
            )}
          </div>

          {stmt && (
            <div className="card">
              <div className="dr"><span>Opening balance</span><b>{drcr(stmt.openingBalance)}</b></div>
              <div className="dr"><span>Total debit</span><b>{rupees(stmt.totals.debit)}</b></div>
              <div className="dr"><span>Total credit</span><b>{rupees(stmt.totals.credit)}</b></div>
              <div className="dr"><span>Closing balance</span><b>{drcr(stmt.totals.closingBalance)}</b></div>
            </div>
          )}

          <div className="sec"><h2>Transactions</h2><a>{stmt?.rows.length ?? 0} items</a></div>
          {stLoading && <p className="empty">Loading…</p>}
          {stErr && <p className="empty">{stErr}</p>}
          {!stLoading && stmt && stmt.rows.length === 0 && <p className="empty">No transactions</p>}
          {(stmt?.rows || [])
            .map((r, i) => ({ r, i }))
            .sort((a, b) => {
              const d = new Date(b.r.date).getTime() - new Date(a.r.date).getTime();
              return d !== 0 ? d : b.i - a.i;
            })
            .map(({ r }) => {
            const hasKids = (r.children?.length || 0) > 0;
            return (
              <div key={r.key}>
                <div className="item" style={{ marginBottom: open[r.key] ? 0 : 10 }} onClick={() => hasKids && setOpen({ ...open, [r.key]: !open[r.key] })}>
                  <div
                    className="logo"
                    style={{ background: r.debit ? "#fbd0d8" : "#c9eeee", color: r.debit ? "#a52d44" : "#0d6b6b" }}
                  >
                    <Ic n="ledger" />
                  </div>
                  <div className="mid">
                    <b style={{ whiteSpace: "normal" }}>{r.particulars}</b>
                    <small>{sdate(r.date)} · {[r.reference, r.type].filter(Boolean).join(" · ")}</small>
                  </div>
                  <div className="tm">
                    <span style={{ color: r.debit ? "#a52d44" : "#0d6b6b" }}>
                      {r.debit ? `− ${rupees(r.debit)}` : `+ ${rupees(r.credit)}`}
                    </span>
                    <small>{drcr(r.balance)}</small>
                  </div>
                </div>
                {open[r.key] && hasKids && (
                  <div className="card" style={{ marginTop: 6, marginBottom: 10 }}>
                    {r.children.map((ch, i) => (
                      <div key={i} className="dr">
                        <span style={{ whiteSpace: "normal" }}>{ch.particulars}<br /><small>{sdate(ch.date)}</small></span>
                        <b>{rupees(ch.amount)}</b>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {stTab === "unpaid" && (
        <>
          <div className="sec"><h2>Pending bills</h2><a>{bills.length} items</a></div>
          {bills.length === 0 && <p className="empty">No unpaid bills</p>}
          {[...bills]
            .sort((a, b) => new Date(b.billingDate).getTime() - new Date(a.billingDate).getTime())
            .map((b) => (
            <div key={b._id} className="item" style={{ cursor: "default" }}>
              <div className="logo"><Ic n="bill" /></div>
              <div className="mid">
                <b>{b.complaintNumber}</b>
                <small>{b.productName} · {sdate(b.billingDate)}</small>
              </div>
              <div className="tm">
                {rupees(b.remainingAmount)}
                <small>of {rupees(b.amount)}</small>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );

  /* ---------- billing ---------- */
  const [bRows, setBRows] = useState<DealerLedger[]>([]);
  const [bPage, setBPage] = useState(1);
  const [bPages, setBPages] = useState(1);
  const [bLoading, setBLoading] = useState(false);
  const [bStatus, setBStatus] = useState("ALL");
  const [bSearch, setBSearch] = useState("");
  const [bQ, setBQ] = useState("");
  const [bFrom, setBFrom] = useState("");
  const [bTo, setBTo] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setBQ(bSearch), 400);
    return () => clearTimeout(t);
  }, [bSearch]);
  useEffect(() => {
    setBPage(1);
  }, [bQ, bStatus, bFrom, bTo]);
  useEffect(() => {
    if (view !== "billing") return;
    setBLoading(true);
    getDealerLedgers({
      search: bQ,
      dealerId: dealerId || undefined,
      status: bStatus as never,
      fromDate: bFrom,
      toDate: bTo,
      page: bPage,
      limit: 20,
    })
      .then((r) => {
        setBPages(r.pagination.totalPages || 1);
        setBRows((prev) => (bPage === 1 ? r.data : [...prev, ...r.data]));
      })
      .catch(() => toast("Failed to load billing"))
      .finally(() => setBLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, bQ, bStatus, bFrom, bTo, bPage, dealerId]);

  const lbl = (v?: string) => (v ? formatReason(v) : "");

  const renderBilling = () => (
    <>
      <h1>
        Billing
        <br />
        <em>Overview</em>
      </h1>
      <div className="search">
        <Ic n="search" s={18} />
        <input placeholder="Search complaint, customer…" value={bSearch} onChange={(e) => setBSearch(e.target.value)} />
      </div>
      <div className="fchips">
        {["ALL", "PENDING", "APPROVED", "BILLED", "REVERSED", "CANCELLED"].map((f) => (
          <button key={f} className={bStatus === f ? "on" : ""} onClick={() => setBStatus(f)}>
            {f === "ALL" ? "All" : lbl(f)}
          </button>
        ))}
      </div>
      <div className="g2" style={{ marginTop: 12 }}>
        <div className="field" style={{ marginTop: 0 }}><label>From</label>
          <input type="date" value={bFrom} onChange={(e) => setBFrom(e.target.value)} /></div>
        <div className="field" style={{ marginTop: 0 }}><label>To</label>
          <input type="date" value={bTo} onChange={(e) => setBTo(e.target.value)} /></div>
      </div>

      <div className="sec"><h2>Bills</h2><a>{bRows.length} items</a></div>
      {bRows.length === 0 && <p className="empty">{bLoading ? "Loading…" : "No bills found"}</p>}
      {bRows.map((b) => (
        <div key={b._id} className="item" onClick={() => setSheet({ t: "bill", id: b._id })}>
          <div
            className="logo"
            style={{ background: b.entryType === "DEBIT" ? "#fbd0d8" : "#c9eeee", color: b.entryType === "DEBIT" ? "#a52d44" : "#0d6b6b" }}
          >
            <Ic n="bill" />
          </div>
          <div className="mid">
            <b>{b.complaintNumber || lbl(b.transactionType)}</b>
            <small>
              {[b.productName, b.category].filter(Boolean).join(" · ") || lbl(b.transactionType)} ·{" "}
              {fmtDate(ymd(b.billingDate || b.createdAt))}
            </small>
          </div>
          <div className="tm">
            <span style={{ color: b.entryType === "DEBIT" ? "#a52d44" : "#0d6b6b" }}>
              {b.entryType === "DEBIT" ? "− " : "+ "}
              {rupees(b.amount)}
            </span>
            <div style={{ marginTop: 6 }}><Chip s={lbl(b.status)} /></div>
          </div>
        </div>
      ))}
      {bPage < bPages && (
        <button className="btn alt" style={{ width: "100%", marginTop: 6 }} disabled={bLoading} onClick={() => setBPage(bPage + 1)}>
          {bLoading ? "Loading…" : "Load more"}
        </button>
      )}
    </>
  );

  /* ---------- profile ---------- */
  const [pw, setPw] = useState({ n: "", c: "" });
  const [pwShow, setPwShow] = useState(false);
  const [pwBusy, setPwBusy] = useState(false);
  const submitPw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw.n) return toast("New password is required");
    if (pw.n.length < 6) return toast("Password must be at least 6 characters");
    if (pw.n !== pw.c) return toast("Passwords do not match");
    try {
      setPwBusy(true);
      const r = await changePassword({ newPassword: pw.n });
      toast(r?.message || "Password changed successfully");
      setPw({ n: "", c: "" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast(err?.response?.data?.message || err?.message || "Failed to change password");
    } finally {
      setPwBusy(false);
    }
  };

  const renderProfile = () => {
    const initials =
      (user?.name || "U").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "U";
    const dl = user?.dealer;
    const rows: [string, string | undefined][] = [
      ["Name", user?.name],
      ["Email", user?.email],
      ["Role", user?.role?.name],
      ["Firm name", dl?.technicianFirmName],
      ["Technician", dl?.technicianName],
      ["Head code", dl?.headCode],
      ["Mobile", dl?.mobileNumber || user?.phone],
    ];
    return (
      <>
        <h1>
          My
          <br />
          <em>Profile</em>
        </h1>
        <div className="card" style={{ marginTop: 0 }}>
          <div className="row" style={{ justifyContent: "flex-start", gap: 14 }}>
            <div className="logo" style={{ width: 60, height: 60, fontSize: 20, fontWeight: 800 }}>{initials}</div>
            <div>
              <b style={{ fontSize: 17 }}>{user?.name || "User"}</b>
              <small style={{ display: "block", color: "var(--mute)", fontSize: 12 }}>{user?.role?.name || "Dealer"}</small>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            {rows.filter(([, v]) => v).map(([l, v]) => (
              <div key={l} className="dr"><span>{l}</span><b style={{ textAlign: "right", wordBreak: "break-word" }}>{v}</b></div>
            ))}
          </div>
        </div>

        <form className="card" onSubmit={submitPw}>
          <b style={{ fontSize: 15 }}>Change Password</b>
          <div className="field">
            <label>New password</label>
            <input type={pwShow ? "text" : "password"} autoComplete="off" value={pw.n} onChange={(e) => setPw({ ...pw, n: e.target.value })} />
          </div>
          <div className="field">
            <label>Confirm new password</label>
            <input type={pwShow ? "text" : "password"} autoComplete="off" value={pw.c} onChange={(e) => setPw({ ...pw, c: e.target.value })} />
          </div>
          <div className="acts">
            <button type="button" className="btn alt" onClick={() => setPwShow(!pwShow)}>{pwShow ? "Hide" : "Show"} password</button>
            <button className="btn lav" disabled={pwBusy}>{pwBusy ? "Changing…" : "Change Password"}</button>
          </div>
        </form>

        <button className="btn alt" style={{ width: "100%", marginTop: 14 }} onClick={logout}>Logout</button>
      </>
    );
  };

  /* ---------- leave ---------- */
  const [leaves, setLeaves] = useState<DealerLeave[]>([]);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [lf, setLf] = useState({ from: "", to: "", reason: "" });
  const [lfBusy, setLfBusy] = useState(false);
  const loadLeaves = useCallback(async () => {
    try {
      setLeaveLoading(true);
      setLeaves(await getMyLeaves());
    } catch {
      toast("Failed to load leaves");
    } finally {
      setLeaveLoading(false);
    }
  }, []);
  useEffect(() => {
    if (view === "leave") loadLeaves();
  }, [view, loadLeaves]);

  const submitLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lf.to < lf.from) return toast("To date cannot be before from date");
    try {
      setLfBusy(true);
      await registerLeave({ fromDate: lf.from, toDate: lf.to, reason: lf.reason.trim() });
      setLf({ from: "", to: "", reason: "" });
      await loadLeaves();
      toast("Leave registered");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast(err?.response?.data?.message || "Failed to register leave");
    } finally {
      setLfBusy(false);
    }
  };

  const removeLeave = async (id: string) => {
    try {
      await cancelLeave(id);
      await loadLeaves();
      toast("Leave cancelled");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast(err?.response?.data?.message || "Failed to cancel leave");
    }
  };

  const leavePhase = (l: DealerLeave) =>
    l.status === "CANCELLED"
      ? "Cancelled"
      : l.toDate < TODAY
        ? "Completed"
        : l.fromDate <= TODAY
          ? "On leave"
          : "Upcoming";
  const days = (l: DealerLeave) =>
    Math.round((new Date(l.toDate).getTime() - new Date(l.fromDate).getTime()) / 86400000) + 1;

  const renderLeave = () => (
    <>
      <h1>
        Request
        <br />
        <em>Leave</em>
      </h1>
      <form className="card" style={{ marginTop: 0 }} onSubmit={submitLeave}>
        <div className="g2">
          <div className="field" style={{ marginTop: 0 }}>
            <label>From date *</label>
            <input type="date" required min={TODAY} value={lf.from} onChange={(e) => setLf({ ...lf, from: e.target.value, to: lf.to && lf.to < e.target.value ? e.target.value : lf.to })} />
          </div>
          <div className="field" style={{ marginTop: 0 }}>
            <label>To date *</label>
            <input type="date" required min={lf.from || TODAY} value={lf.to} onChange={(e) => setLf({ ...lf, to: e.target.value })} />
          </div>
        </div>
        <div className="field">
          <label>Reason *</label>
          <textarea required maxLength={500} placeholder="Reason for leave…" value={lf.reason} onChange={(e) => setLf({ ...lf, reason: e.target.value })} />
        </div>
        <button className="btn lav" disabled={lfBusy} style={{ width: "100%", marginTop: 14 }}>
          {lfBusy ? "Saving…" : "Register leave"}
        </button>
      </form>

      <div className="sec"><h2>My leaves</h2><a>{leaves.length} items</a></div>
      {leaves.length === 0 && <p className="empty">{leaveLoading ? "Loading…" : "No leaves registered"}</p>}
      {leaves.map((l) => {
        const phase = leavePhase(l);
        const canCancel = l.status === "ACTIVE" && l.toDate >= TODAY;
        return (
          <div key={l._id} className="ticket" style={{ marginBottom: 12 }}>
            <div className="row">
              <div className="brand">
                <div className="logo"><Ic n="leave" s={18} /></div>
                <div>
                  <small>{days(l)} day{days(l) > 1 ? "s" : ""}</small>
                  <b>{fmtDate(l.fromDate)} → {fmtDate(l.toDate)}</b>
                </div>
              </div>
              <Chip s={phase} />
            </div>
            <div className="note">{l.reason}</div>
            {canCancel && (
              <div className="acts">
                <button className="btn alt sm wide" onClick={() => removeLeave(l._id)}>Cancel leave</button>
              </div>
            )}
          </div>
        );
      })}
    </>
  );

  const renderAlerts = () => (
    <>
      <h1>
        Alerts &amp;
        <br />
        <em>Activity</em>
      </h1>
      <div className="sec" style={{ marginTop: 0 }}>
        <h2>Notifications</h2>
        <a onClick={async () => { await markAllNotificationsRead(); loadNotes(); }}>
          {unread} unread
        </a>
      </div>
      {notes.length === 0 && <p className="empty">No alerts</p>}
      {notes.map((a) => (
        <div
          key={a.id}
          className="item"
          onClick={async () => {
            await markNotificationRead(a.id);
            loadNotes();
            openComplaint(a.entityId);
          }}
        >
          <div className="logo"><Ic n="bell" /></div>
          <div className="mid">
            <b>
              {a.title}
              {!a.isRead && <span style={{ color: "#ff4d5e" }}> ●</span>}
            </b>
            <small>{a.message}</small>
          </div>
        </div>
      ))}
    </>
  );

  /* ---------------- sheets ---------------- */
  const [hist, setHist] = useState<ComplaintActivity[] | null>(null);
  useEffect(() => {
    if (sheet?.t !== "history") return;
    setHist(null);
    getComplaintActivities(sheet.id)
      .then((r) => setHist(r.activities || []))
      .catch(() => setHist([]));
  }, [sheet]);

  const [rs, setRs] = useState({ date: "", time: "", reason: "" });
  const [rsBusy, setRsBusy] = useState(false);
  useEffect(() => {
    if (sheet?.t === "resched") {
      const c = byId(sheet.id);
      setRs({ date: c?.date || TODAY, time: to24(c?.time), reason: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet]);

  const maxDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return localYmd(d);
  }, []);

  const submitResched = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    try {
      setRsBusy(true);
      await updateAppointmentStatus(id, "RESCHEDULED", {
        appointmentDate: rs.date,
        appointmentTime: rs.time,
      });
      setSheet(null);
      await loadCalls();
      toast("Visit rescheduled");
      setView("resched");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast(err?.response?.data?.message || "Failed to reschedule");
    } finally {
      setRsBusy(false);
    }
  };

  /* ---------- full complaint details (same data as the details page) ---------- */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [detail, setDetail] = useState<any>(null);
  const [remarks, setRemarks] = useState<SentRemark[]>([]);
  const detailId = sheet?.t === "details" ? sheet.id : null;
  const loadDetail = useCallback(async (id: string) => {
    try {
      setDetail(await getAppointmentById(id));
    } catch {
      /* fall back to list data */
    }
  }, []);
  useEffect(() => {
    if (!detailId) return;
    setDetail(null);
    setRemarks([]);
    loadDetail(detailId);
    getRemarksSentToDealer(detailId, true).then(setRemarks).catch(() => setRemarks([]));
  }, [detailId, loadDetail]);

  /* ---------- actions ---------- */
  const [busy, setBusy] = useState(false);
  const [schedule, setSchedule] = useState({ date: "", time: "" });
  const [reasons, setReasons] = useState<{ id: string; reasonName: string }[]>([]);
  const [reasonsLoading, setReasonsLoading] = useState(false);
  const [selReason, setSelReason] = useState("");
  const [billingBusy, setBillingBusy] = useState(false);
  const [closingReason, setClosingReason] = useState("");
  const [cats, setCats] = useState<{ _id: string; category: string }[]>([]);
  const [catsLoading, setCatsLoading] = useState(false);
  const [bf, setBf] = useState({ cat: "", customer: "", profit: "", wv: "", wu: "MONTHS" as "DAYS" | "MONTHS" });

  const reasonKind = sheet?.t === "reason" ? sheet.kind : null;
  useEffect(() => {
    if (!reasonKind) return;
    setSelReason("");
    setReasons([]);
    setReasonsLoading(true);
    getReasonDropdown(reasonKind)
      .then((r) => setReasons(r?.data || []))
      .catch(() => setReasons([]))
      .finally(() => setReasonsLoading(false));
  }, [reasonKind]);
  useEffect(() => {
    if (sheet?.t === "schedule") setSchedule({ date: "", time: "" });
  }, [sheet]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const act = async (id: string, status: string, extra: Record<string, any> = {}, ok = "Status updated") => {
    try {
      setBusy(true);
      await updateAppointmentStatus(id, status, extra);
      setSheet(null);
      await loadCalls();
      toast(ok);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast(err?.response?.data?.message || err?.response?.data?.error || "Action failed");
    } finally {
      setBusy(false);
    }
  };

  const billingSheetId = sheet?.t === "billing" ? sheet.id : null;
  useEffect(() => {
    if (!billingSheetId) return;
    setBf({
      cat: String(detail?.categoryId?._id ?? detail?.categoryId ?? ""),
      customer: "",
      profit: "",
      wv: "",
      wu: "MONTHS",
    });
    const productId = Number(detail?.productId) || Number(detail?.categoryId?.product_id) || undefined;
    setCats([]);
    if (!productId) return;
    setCatsLoading(true);
    searchCategories({ productId })
      .then((items) => setCats(items.map((i) => ({ _id: i._id, category: i.category }))))
      .catch(() => setCats([]))
      .finally(() => setCatsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingSheetId]);

  const submitReason = async (id: string, kind: ReasonKind) => {
    const picked = reasons.find((r) => r.id === selReason);
    if (!picked) return toast("Please select a reason");
    if (kind === "close") {
      if (!["FIXED", "PARTIAL_PAYMENT", "PROFIT_SHARING"].includes(billingType || "")) {
        return toast("Dealer billing type is not configured");
      }
      setClosingReason(picked.reasonName);
      setSheet({ t: "billing", id });
      return;
    }
    const m = REASON_META[kind];
    await act(id, m.status, { [m.key]: picked.reasonName });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authUser = user as any;
  const billingType: string | undefined =
    authUser?.dealerId?.billingType ?? user?.dealer?.billingType;

  const submitBilling = async (billingId: string, v: {
    closureCategoryId?: string;
    customerAmount?: number;
    profitAmount?: number;
    warrantyAssured: { value: number; unit: "DAYS" | "MONTHS" };
  }) => {
    try {
      setBillingBusy(true);
      const payload =
        billingType === "PROFIT_SHARING"
          ? { ...v, closingReason }
          : {
              closureCategoryId: v.closureCategoryId,
              customerAmount: v.customerAmount,
              warrantyAssured: v.warrantyAssured,
              closingReason,
            };
      await updateAppointmentStatus(billingId, "CLOSE_ON_BILLING", payload);
      setSheet(null);
      await loadCalls();
      toast(billingType === "FIXED" ? "Complaint closed – sent for verification" : "Billing submitted for approval");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast(err?.response?.data?.message || err?.response?.data?.error || "Failed to close the complaint");
    } finally {
      setBillingBusy(false);
    }
  };

  const renderSheet = () => {
    if (!sheet) return null;
    if (sheet.t === "more") {
      const m: [string, string, () => void][] = [
        ["x2", "Cancelled calls", () => go("cancelled")],
        ["check", "Closed calls", () => go("closed")],
        ["ledger", "Ledger", () => go("ledger")],
        ["bill", "Billing", () => go("billing")],
        ["leave", "Leave", () => go("leave")],
        ["bell", "Alerts & activity", () => go("alerts")],
        ["user", "My profile", () => go("profile")],
      ];
      return (
        <>
          <SheetTop t="More" />
          <div className="menu">
            {m.map(([i, l, fn]) => (
              <div key={l} className="item" style={{ margin: 0 }} onClick={() => { setSheet(null); fn(); }}>
                <div className="logo"><Ic n={i} /></div>
                <div className="mid"><b>{l}</b></div>
              </div>
            ))}
            <div className="item" style={{ margin: 0 }} onClick={() => { setSheet(null); exportCSV(); }}>
              <div className="logo"><Ic n="down" /></div>
              <div className="mid"><b>Export CSV</b></div>
            </div>
            <div className="item" style={{ margin: 0 }} onClick={logout}>
              <div className="logo"><Ic n="out" /></div>
              <div className="mid"><b>Logout</b></div>
            </div>
          </div>
        </>
      );
    }
    if (sheet.t === "bill") {
      const b = bRows.find((x) => x._id === sheet.id);
      if (!b) return null;
      const Row = ({ l, v }: { l: string; v?: string | number | null }) =>
        v === undefined || v === null || v === "" ? null : (
          <div className="dr"><span>{l}</span><b style={{ textAlign: "right" }}>{v}</b></div>
        );
      return (
        <>
          <SheetTop t="Bill details" />
          <div className="card" style={{ marginTop: 0 }}>
            <div className="row">
              <div className="brand">
                <div className="logo"><Ic n="bill" s={18} /></div>
                <div><small>{lbl(b.transactionType)}</small><b>{b.complaintNumber || "—"}</b></div>
              </div>
              <Chip s={lbl(b.status)} />
            </div>
            <div className="route">
              <div><small>{b.entryType === "DEBIT" ? "Debit" : "Credit"}</small><b>{rupees(b.amount)}</b></div>
              <div className="dash" />
              <div style={{ textAlign: "right" }}><small>Date</small><b>{fmtDate(ymd(b.billingDate || b.createdAt))}</b></div>
            </div>
          </div>
          <div className="card">
            <Row l="Customer" v={b.customerName} />
            <Row l="Phone" v={b.phone} />
            <Row l="Product" v={b.productName} />
            <Row l="Category" v={b.category} />
            <Row l="Units" v={b.units} />
            <Row l="Service" v={b.serviceDescription} />
            <Row l="Billing type" v={lbl(b.billingType)} />
            <Row l="Base amount" v={b.baseAmount != null ? rupees(b.baseAmount) : ""} />
            <Row l="Percentage" v={b.percentage ? `${b.percentage}%` : ""} />
            <Row l="Service rate" v={b.serviceRate ? rupees(b.serviceRate) : ""} />
            <Row l="Customer amount" v={b.calculation?.customerAmount != null ? rupees(b.calculation.customerAmount) : ""} />
            <Row l="Profit amount" v={b.calculation?.profitAmount != null ? rupees(b.calculation.profitAmount) : ""} />
            <Row l="Approved at" v={b.approvedAt ? fmtDateTime(b.approvedAt) : ""} />
            <Row l="Description" v={b.description} />
            <Row l="Remarks" v={b.remarks} />
          </div>
        </>
      );
    }
    const c = byId(sheet.id);
    if (!c) return null;
    if (sheet.t === "details") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d: any = detail || {};
      const raw: string = d.status || c.raw;
      const isWarranty = d.complaintType === "WARRANTY";
      const typeShown = /^repeat/i.test(c.typeLabel);
      const fd = (v?: string | null) =>
        v ? new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
      const fdt = (v?: string | null) =>
        v
          ? new Date(v).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
          : "—";
      const address = [d.address?.addressLine, d.address?.city, d.address?.district, d.address?.state, d.address?.pinCode]
        .filter(Boolean)
        .join(", ");
      const K = ({ l, v, tel }: { l: string; v?: string | number | null; tel?: boolean }) => (
        <div style={{ minWidth: 0 }}>
          <small>{l}</small>
          {tel && v && v !== "-" ? (
            <a href={`tel:${v}`} style={{ color: "var(--lav)", fontWeight: 700, fontSize: 14 }}>{v}</a>
          ) : (
            <b style={{ wordBreak: "break-word" }}>{v === undefined || v === null || v === "" ? "—" : v}</b>
          )}
        </div>
      );
      const Sec = ({ t, children }: { t: string; children: React.ReactNode }) => (
        <div className="card">
          <b style={{ fontSize: 14 }}>{t}</b>
          <div className="kv" style={{ marginTop: 12 }}>{children}</div>
        </div>
      );
      const go2 = (kind: ReasonKind) => setSheet({ t: "reason", id: c.id, kind });
      const actions: { label: string; fn: () => void; cls?: string }[] = [];
      if (raw === "ALLOCATED" || raw === "REOPEN") {
        actions.push({ label: "Schedule Appointment", fn: () => setSheet({ t: "schedule", id: c.id }), cls: "lav" });
        actions.push({ label: "Pending", fn: () => go2("on_call_pending"), cls: "alt" });
        actions.push({ label: "Cancel", fn: () => go2("on_call_cancel"), cls: "alt" });
      } else if (raw === "APPOINTMENT_SCHEDULED") {
        actions.push({ label: "Reschedule", fn: () => setSheet({ t: "resched", id: c.id }), cls: "alt" });
        actions.push({ label: busy ? "Updating…" : "Visit", fn: () => act(c.id, "VISITED", {}, "Marked as visited"), cls: "lav" });
        actions.push({ label: "Cancel", fn: () => go2("on_call_cancel"), cls: "alt" });
      } else if (raw === "RESCHEDULED") {
        actions.push({ label: busy ? "Updating…" : "Visit", fn: () => act(c.id, "VISITED", {}, "Marked as visited"), cls: "lav" });
        actions.push({ label: "Cancel", fn: () => go2("on_call_cancel"), cls: "alt" });
      } else if (raw === "VISITED") {
        actions.push({ label: "Close on Billing", fn: () => go2("close"), cls: "lav" });
        actions.push({ label: "Pending on Visit", fn: () => go2("after_call_pending"), cls: "alt" });
        actions.push({ label: "Cancel on Visit", fn: () => go2("after_call_cancel"), cls: "alt" });
      } else if (raw === "PENDING_ON_VISIT") {
        actions.push({ label: "Close on Billing", fn: () => go2("close"), cls: "lav" });
      } else if (raw === "PENDING_ON_CALL") {
        actions.push({ label: "Schedule Appointment", fn: () => setSheet({ t: "schedule", id: c.id }), cls: "lav" });
        actions.push({ label: "Cancel", fn: () => go2("on_call_cancel"), cls: "alt" });
      }
      return (
        <>
          <SheetTop t="Complaint" />
          <div className="card" style={{ marginTop: 0 }}>
            <div className="row">
              <div className="brand">
                <div className="logo"><Ic n="wrench" s={18} /></div>
                <div>
                  <small>Complaint Number</small>
                  <b>{c.no}</b>
                  <small>Created: {fdt(d.complaintDateTime || c.complaintAt)}</small>
                </div>
              </div>
              <Chip s={c.status} />
            </div>
            <div className="kv" style={{ marginTop: 14 }}>
              <K l="Units" v={d.units ?? c.units} />
              <K l="Quote Amount" v={d.quoteAmount != null ? `₹${d.quoteAmount}` : "—"} />
              {(typeShown || isWarranty) && <K l="Complaint Type" v={c.typeLabel} />}
            </div>
          </div>

          <div
            className="card"
            style={{
              background: "linear-gradient(135deg,#a79bf0,#8f80ea)",
              color: "#fff",
              boxShadow: "0 12px 28px #8f80ea66",
            }}
          >
            <b style={{ fontSize: 13, letterSpacing: ".04em", textTransform: "uppercase", opacity: 0.9 }}>
              Appointment Information
            </b>
            {d.appointmentDate || d.appointmentTime || c.date ? (
              <div className="kv" style={{ marginTop: 12 }}>
                <div>
                  <small style={{ color: "#ffffffcc" }}>Date</small>
                  <b style={{ fontSize: 18 }}>{d.appointmentDate ? fd(d.appointmentDate) : fmtDate(c.date)}</b>
                </div>
                <div>
                  <small style={{ color: "#ffffffcc" }}>Time</small>
                  <b style={{ fontSize: 18 }}>{d.appointmentTime ? time12(d.appointmentTime) : c.time || "—"}</b>
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <small style={{ color: "#ffffffcc" }}>Status</small>
                  <b>{c.status}</b>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 10, fontSize: 18, fontWeight: 800 }}>Not Scheduled</div>
            )}
          </div>

          {actions.length > 0 && (
            <div className="card">
              <b style={{ fontSize: 14 }}>Take Action</b>
              <div className="acts">
                {actions.map((a, i) => (
                  <button
                    key={a.label}
                    disabled={busy}
                    className={`btn ${a.cls || ""} ${actions.length % 2 === 1 && i === 0 ? "wide" : ""}`}
                    onClick={a.fn}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Sec t="Customer Information">
            <K l="Customer Name" v={d.customerName || c.name} />
            <K l="Mobile Number" v={d.phone || c.phone} tel />
            <K l="Alternate Number" v={d.alternatePhone || c.altPhone} tel />
            <div style={{ gridColumn: "1/-1" }}><K l="Complaint Address" v={address || c.fullAddress} /></div>
          </Sec>

          <Sec t="Product & Complaint Information">
            <K l="Product" v={d.productName || c.product} />
            <K l="Brand" v={d.brand || c.brand} />
            <K l="Category (Registration)" v={d.category || c.category} />
            {d.dealerClosureCategory && <K l="Category (Dealer Closing)" v={d.dealerClosureCategory} />}
            {d.verifiedCategory && <K l="Category (Verification)" v={d.verifiedCategory} />}
            <div style={{ gridColumn: "1/-1" }}>
              <K l="Category Description" v={d.categoryId?.description || c.categoryDesc} />
            </div>
            <div style={{ gridColumn: "1/-1" }}><K l="Fault Reported" v={d.faultReported || c.problem} /></div>
            {d.description && <div style={{ gridColumn: "1/-1" }}><K l="Description" v={d.description} /></div>}
          </Sec>

          {(d.adName || d.subject || (d.additionalInfo?.length ?? 0) > 0) && (
            <Sec t="Additional Information">
              {d.adName && <K l="Ad. Name" v={d.adName} />}
              {d.subject && <K l="Subject" v={d.subject} />}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {d.additionalInfo?.map((info: string, i: number) => (
                <K key={i} l={`Additional Info ${i + 1}`} v={info} />
              ))}
            </Sec>
          )}

          {remarks.length > 0 && (
            <div className="card">
              <b style={{ fontSize: 14 }}>Remarks Sent to Dealer</b>
              {remarks.map((r, i) => (
                <div
                  key={r._id || i}
                  style={{
                    marginTop: 12,
                    background: "#fff1e8",
                    borderLeft: "5px solid #ff7a3d",
                    borderRadius: 14,
                    padding: 12,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 11, color: "#a3441f", fontWeight: 700 }}>
                    <span>{r.followUpStatus || "Remark"}</span>
                    <span>{fdt(r.createdAt)}</span>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 16, fontWeight: 700, lineHeight: 1.45, color: "#14141f" }}>
                    {r.remark}
                  </div>
                  {r.followUpDate && (
                    <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: "#a3441f" }}>
                      Follow-up: {fd(r.followUpDate)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {raw === "PENDING" && d.pendingReason && (
            <Sec t="Pending Information"><K l="Pending Reason" v={formatReason(d.pendingReason)} /></Sec>
          )}
          {(raw === "PENDING_ON_CALL" || raw === "PENDING_ON_VISIT") && (d.pendingReason || c.pendingReason) && (
            <Sec t="Pending Information"><K l="Pending Reason" v={formatReason(d.pendingReason || c.pendingReason)} /></Sec>
          )}
          {c.status === "Cancelled" && (
            <Sec t="Cancellation Information">
              <K l="Cancellation Reason" v={formatReason(d.cancellationReason || c.cancelReason)} />
              <K l="Cancelled At" v={fdt(d.cancelledAt)} />
            </Sec>
          )}
          {d.closedAt && <Sec t="Closure"><K l="Closed At" v={fdt(d.closedAt)} /></Sec>}

          <div className="acts">
            <a
              className="btn wide"
              href={`tel:${d.phone || c.phone}`}
              style={{ background: "#1fa84f", boxShadow: "0 8px 20px #1fa84f55", padding: "15px 20px", fontSize: 15 }}
            >
              <Ic n="phone" s={18} /> Call {d.customerName || c.name}
            </a>
            <button className="btn alt wide" onClick={() => setSheet({ t: "history", id: c.id })}>View Activity</button>
          </div>
        </>
      );
    }
    if (sheet.t === "billing") {
      const customerInvalid = !bf.customer || Number(bf.customer) <= 0;
      const profitInvalid =
        billingType === "PROFIT_SHARING" &&
        (!bf.profit || Number(bf.profit) <= 0 || Number(bf.profit) > Number(bf.customer));
      const warrantyInvalid = bf.wv !== "" && (!Number.isFinite(Number(bf.wv)) || Number(bf.wv) < 0);
      const catInvalid = cats.length > 0 && !bf.cat;
      const invalid = customerInvalid || profitInvalid || warrantyInvalid || catInvalid;
      const title =
        billingType === "FIXED" ? "Close Complaint" : billingType === "PARTIAL_PAYMENT" ? "Partial Payment Billing" : "Profit Sharing Billing";
      return (
        <>
          <SheetTop t={title} />
          <form
            className="card"
            style={{ marginTop: 0 }}
            onSubmit={(e) => {
              e.preventDefault();
              if (invalid) return;
              submitBilling(c.id, {
                closureCategoryId: bf.cat || undefined,
                customerAmount: Number(bf.customer),
                ...(billingType === "PROFIT_SHARING" ? { profitAmount: Number(bf.profit) } : {}),
                warrantyAssured: { value: bf.wv === "" ? 0 : Number(bf.wv), unit: bf.wu },
              });
            }}
          >
            <div className="dr"><span>Complaint</span><b>{c.no} · {c.name}</b></div>
            <div className="dr"><span>Closing reason</span><b style={{ textAlign: "right" }}>{closingReason}</b></div>

            {(cats.length > 0 || catsLoading) && (
              <div className="field">
                <label>Service category *</label>
                <select value={bf.cat} disabled={billingBusy} onChange={(e) => setBf({ ...bf, cat: e.target.value })}>
                  <option value="">{catsLoading ? "Loading categories…" : "Select the service done"}</option>
                  {cats.map((x) => (
                    <option key={x._id} value={x._id}>{x.category}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="field">
              <label>Customer amount (₹) *</label>
              <input type="number" min="0" step="0.01" inputMode="decimal" placeholder="Enter customer amount" value={bf.customer} disabled={billingBusy} onChange={(e) => setBf({ ...bf, customer: e.target.value })} />
            </div>

            {billingType === "PROFIT_SHARING" && (
              <div className="field">
                <label>Profit amount (₹) *</label>
                <input type="number" min="0" step="0.01" inputMode="decimal" placeholder="Enter profit amount" value={bf.profit} disabled={billingBusy} onChange={(e) => setBf({ ...bf, profit: e.target.value })} />
                {bf.profit && bf.customer && Number(bf.profit) > Number(bf.customer) && (
                  <small style={{ color: "#a52d44", fontWeight: 600 }}>Profit amount cannot be greater than customer amount.</small>
                )}
              </div>
            )}

            <div className="field">
              <label>Warranty assured (optional)</label>
              <div className="g2">
                <input type="number" min="0" step="1" inputMode="numeric" placeholder="e.g. 3" value={bf.wv} disabled={billingBusy} onChange={(e) => setBf({ ...bf, wv: e.target.value })} />
                <select value={bf.wu} disabled={billingBusy} onChange={(e) => setBf({ ...bf, wu: e.target.value as "DAYS" | "MONTHS" })}>
                  <option value="DAYS">Days</option>
                  <option value="MONTHS">Months</option>
                </select>
              </div>
            </div>

            <button className="btn lav" disabled={invalid || billingBusy} style={{ width: "100%", marginTop: 16 }}>
              {billingBusy ? "Submitting…" : billingType === "FIXED" ? "Close Complaint" : "Submit for Approval"}
            </button>
          </form>
        </>
      );
    }
    if (sheet.t === "schedule") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tmr = localYmd(tomorrow);
      const Day = ({ v, l }: { v: string; l: string }) => (
        <button
          type="button"
          className="item"
          style={{ margin: 0, boxShadow: schedule.date === v ? "0 0 0 2px var(--lav) inset" : undefined }}
          onClick={() => setSchedule({ ...schedule, date: v })}
        >
          <div className="mid"><small>{l}</small><b>{new Date(v + "T12:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</b></div>
        </button>
      );
      return (
        <>
          <SheetTop t="Schedule Appointment" />
          <form
            className="card"
            style={{ marginTop: 0 }}
            onSubmit={(e) => {
              e.preventDefault();
              act(c.id, "APPOINTMENT_SCHEDULED", { appointmentDate: schedule.date, appointmentTime: schedule.time }, "Appointment scheduled");
            }}
          >
            <div className="dr"><span>{c.no}</span><b>{c.name}</b></div>
            <div className="field"><label>Select appointment date</label></div>
            <div className="g2" style={{ marginTop: 6 }}>
              <Day v={TODAY} l="Today" />
              <Day v={tmr} l="Tomorrow" />
            </div>
            <div className="field"><label>Appointment time *</label>
              <input type="time" required value={schedule.time} onChange={(e) => setSchedule({ ...schedule, time: e.target.value })} /></div>
            <button className="btn lav" disabled={busy || !schedule.date || !schedule.time} style={{ width: "100%", marginTop: 14 }}>
              {busy ? "Saving…" : "Schedule"}
            </button>
          </form>
        </>
      );
    }
    if (sheet.t === "reason") {
      const m = REASON_META[sheet.kind];
      const kind = sheet.kind;
      return (
        <>
          <SheetTop t={m.title} />
          <div className="card" style={{ marginTop: 0 }}>
            <div className="dr"><span>{c.no}</span><b>{c.name}</b></div>
            <div className="field"><label>Select a reason *</label></div>
            {reasonsLoading && <p className="empty">Loading reasons…</p>}
            {!reasonsLoading && reasons.length === 0 && <p className="empty">No reasons available</p>}
            {reasons.map((r) => (
              <label
                key={r.id}
                className="item"
                style={{ margin: "8px 0 0", boxShadow: selReason === r.id ? "0 0 0 2px var(--lav) inset" : undefined }}
              >
                <input type="radio" name="reason" checked={selReason === r.id} onChange={() => setSelReason(r.id)} />
                <div className="mid"><b style={{ whiteSpace: "normal" }}>{r.reasonName}</b></div>
              </label>
            ))}
            <button
              className="btn lav"
              disabled={busy || !selReason}
              style={{ width: "100%", marginTop: 14 }}
              onClick={() => submitReason(c.id, kind)}
            >
              {kind === "close" ? "Continue" : busy ? "Saving…" : m.title}
            </button>
          </div>
        </>
      );
    }
    if (sheet.t === "resched") {
      return (
        <>
          <SheetTop t="Reschedule visit" />
          <form className="card" style={{ marginTop: 0 }} onSubmit={(e) => submitResched(e, c.id)}>
            <div className="dr"><span>{c.no}</span><b>{c.name} · {c.product}</b></div>
            <div className="g2">
              <div className="field"><label>Original date</label><input value={c.date} disabled /></div>
              <div className="field"><label>Original time</label><input value={c.time} disabled /></div>
              <div className="field"><label>New date *</label>
                <input type="date" min={TODAY} max={maxDate} required value={rs.date} onChange={(e) => setRs({ ...rs, date: e.target.value })} /></div>
              <div className="field"><label>New time *</label>
                <input type="time" required value={rs.time} onChange={(e) => setRs({ ...rs, time: e.target.value })} /></div>
            </div>
            <div className="field"><label>Reason *</label>
              <textarea required placeholder="Customer unavailable, part delay…" value={rs.reason} onChange={(e) => setRs({ ...rs, reason: e.target.value })} /></div>
            <button className="btn lav" disabled={rsBusy} style={{ width: "100%", marginTop: 14 }}>
              {rsBusy ? "Saving…" : "Save request"}
            </button>
          </form>
        </>
      );
    }
    return (
      <>
        <SheetTop t="Change log" />
        <div className="card" style={{ marginTop: 0 }}>
          <div className="dr"><span>Customer</span><b>{c.name}</b></div>
          <div className="dr"><span>Complaint</span><b>{c.no}</b></div>
          <div className="dr"><span>Status</span><Chip s={c.status} /></div>
        </div>
        <div className="card">
          <b style={{ fontSize: 14 }}>History timeline</b>
          <div className="tl" style={{ marginTop: 12 }}>
            {hist === null && <p className="empty">Loading…</p>}
            {hist?.length === 0 && <p className="empty">No history yet</p>}
            {hist?.map((h) => (
              <div key={h._id}>
                <b>{h.title}</b>
                <p>{fmtDateTime(h.activityAt || h.createdAt)}</p>
                {(h.description || h.reason) && <p>{h.description || h.reason}</p>}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  /* ---------------- nav ---------------- */
  const navItems: [View | "more", string, string][] = [
    ["home", "home", "Home"],
    ["calls", "list", "Calls"],
    ["inbox", "mail", "Inbox"],
    ["resched", "resch", "Reschedule"],
    ["more", "more", "More"],
  ];

  return (
    <>
    <div className="dg">
      <div className="app" id="app">
        <div className="top">
          <div className="pill">
            <i>DG</i>DG Service · Dealer
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="round" onClick={() => go("calls", true)}>
              <Ic n="search" />
            </button>
            <button className="round" onClick={() => go("alerts")}>
              <Ic n="bell" />
              {unread > 0 && <b />}
            </button>
          </div>
        </div>
        <div id="view">
          {view === "home" && renderHome()}
          {(view === "calls" || view === "cancelled" || view === "closed") && renderCalls()}
          {view === "inbox" && renderInbox()}
          {view === "resched" && renderResched()}
          {view === "ledger" && renderLedger()}
          {view === "statement" && renderStatement()}
          {view === "billing" && renderBilling()}
          {view === "profile" && renderProfile()}
          {view === "leave" && renderLeave()}
          {view === "alerts" && renderAlerts()}
        </div>
      </div>

      <div className="nav">
        {navItems.map(([k, i, l]) => {
          const on = k === "more" ? MORE_VIEWS.includes(view) : view === k;
          return (
            <button
              key={k}
              className={on ? "on" : ""}
              aria-label={l}
              onClick={() => (k === "more" ? setSheet({ t: "more" }) : go(k))}
            >
              <Ic n={i} s={24} />
              {k === "inbox" && unread > 0 && <span className="dot">{unread}</span>}
            </button>
          );
        })}
      </div>

      <div
        id="sheet"
        className={sheet ? "open" : ""}
        onClick={(e) => e.target === e.currentTarget && setSheet(null)}
      >
        <div className="panel" id="sheet-body">{renderSheet()}</div>
      </div>

      <div className="toast" style={{ display: toastMsg ? "block" : "none" }}>{toastMsg}</div>
    </div>

    </>
  );
}
