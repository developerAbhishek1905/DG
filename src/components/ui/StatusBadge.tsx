import type { ComponentType, ReactNode } from "react";

/*
|--------------------------------------------------------------------------
| ONE status badge for the whole CRM
|--------------------------------------------------------------------------
| Every status (complaint, billing, dealer, user, payment, ledger ...) is
| mapped to ONE of the tones below, so the same word always has the same
| colour on every page. Add new statuses to STATUS_TONES only.
|
|   success  green    finished / approved / active / paid
|   info     violet   new / allocated / scheduled / in motion
|   warning  amber    pending / waiting / under review
|   danger   red      cancelled / rejected / failed / breached
|   accent   fuchsia  suspended / reversed (needs special attention)
|   neutral  grey     inactive / draft / unknown
*/

export type StatusTone =
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "accent"
  | "neutral";

const TONE_STYLES: Record<StatusTone, { badge: string; dot: string }> = {
  success: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  info: {
    badge: "border-violet-200 bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
  },
  warning: {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  danger: {
    badge: "border-red-200 bg-red-50 text-red-700",
    dot: "bg-red-500",
  },
  accent: {
    badge: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
    dot: "bg-fuchsia-500",
  },
  neutral: {
    badge: "border-gray-200 bg-gray-100 text-gray-600",
    dot: "bg-gray-400",
  },
};

// Exact statuses (normalised: upper case, spaces / hyphens -> "_")
export const STATUS_TONES: Record<string, StatusTone> = {
  // success
  ACTIVE: "success",
  APPROVED: "success",
  CLOSED: "success",
  COMPLETED: "success",
  WORK_COMPLETED: "success",
  SUCCESS: "success",
  PAID: "success",
  VERIFIED: "success",
  RESOLVED: "success",
  SAFE: "success",
  CONFIRMED: "success",
  SENT: "success",
  ASSIGNED: "success",
  POSTED: "success",
  SETTLED: "success",
  AUTO_BILL: "success",

  // info
  NEW: "info",
  SUBMITTED: "info",
  IN_REVIEW: "info",
  REGISTERED: "info",
  ALLOCATED: "info",
  APPOINTMENT_SCHEDULED: "info",
  SCHEDULED: "info",
  RESCHEDULED: "info",
  VISITED: "info",
  REOPEN: "info",
  REOPENED: "info",
  GENERATED: "info",
  BILLED: "info",
  PROCESSING: "info",
  OPEN: "info",
  IN_PROGRESS: "info",
  WORK_IN_PROGRESS: "info",
  FIXED: "info",

  // warning
  PENDING: "warning",
  DG_VERIFICATION: "warning",
  UNDER_REVIEW: "warning",
  UNASSIGNED: "warning",
  CORRECTION_REQUIRED: "accent",
  PARTIALLY_PAID: "warning",
  PARTIAL: "warning",
  WARNING: "warning",
  LEAVE: "warning",
  ON_LEAVE: "warning",
  CLOSE_ON_BILLING: "warning",
  CLOSE_ON_VERIFICATION: "warning",

  // danger
  CANCELLED: "danger",
  CANCELED: "danger",
  REJECTED: "danger",
  FAILED: "danger",
  BREACHED: "danger",
  NO_SHOW: "danger",
  UNPAID: "danger",
  PENALTY: "danger",
  REASSIGNMENT_REQUIRED: "danger",

  // accent
  SUSPENDED: "accent",
  REVERSED: "accent",

  // neutral
  INACTIVE: "neutral",
  DRAFT: "neutral",
  EXPIRED: "neutral",
  UNKNOWN: "neutral",
};

const normalise = (status: unknown) =>
  String(status ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

export const getStatusTone = (status: unknown): StatusTone => {
  const key = normalise(status);

  if (!key) return "neutral";
  if (STATUS_TONES[key]) return STATUS_TONES[key];

  // families: PENDING_ON_CALL, CANCEL_ON_VISIT, CLOSE_ON_* ...
  if (key.startsWith("PENDING")) return "warning";
  if (key.startsWith("CANCEL")) return "danger";
  if (key.startsWith("CLOSE")) return "warning";

  return "neutral";
};

const LABELS: Record<string, string> = {
  ON_LEAVE: "On Leave",
  LEAVE: "On Leave",
  DG_VERIFICATION: "DG Verification",
  AUTO_BILL: "Auto Bill",
};

export const getStatusLabel = (status: unknown): string => {
  const key = normalise(status);

  if (!key) return "-";
  if (LABELS[key]) return LABELS[key];

  return key
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

interface Props {
  status?: unknown;
  // Overrides the text only (the colour still comes from `status`)
  label?: ReactNode;
  // Overrides the colour (use sparingly, prefer adding to STATUS_TONES)
  tone?: StatusTone;
  icon?: ComponentType<{ size?: number }>;
  size?: "sm" | "md";
  className?: string;
}

export default function StatusBadge({
  status,
  label,
  tone,
  icon: Icon,
  size = "md",
  className = "",
}: Props) {
  const styles = TONE_STYLES[tone ?? getStatusTone(status)];

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border font-semibold ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      } ${styles.badge} ${className}`}
    >
      {Icon ? (
        <Icon size={size === "sm" ? 11 : 13} />
      ) : (
        <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      )}

      {label ?? getStatusLabel(status)}
    </span>
  );
}
