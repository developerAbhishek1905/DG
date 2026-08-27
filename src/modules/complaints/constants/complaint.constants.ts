import type {
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
} from "../types/complaint.types";

export const COMPLAINT_STATUS_LABELS: Record<
  ComplaintStatus,
  string
> = {
  REGISTERED: "Registered",
  ALLOCATED: "Allocated",
  APPOINTMENT_SCHEDULED: "Appointment Scheduled",
  PENDING: "Pending",
  WORK_IN_PROGRESS: "Work In Progress",
  WORK_COMPLETED: "Work Completed",
  DG_VERIFICATION: "DG Verification",
  CLOSED: "Closed",
  CANCELLED: "Cancelled",
};

export const COMPLAINT_PRIORITY_LABELS: Record<
  ComplaintPriority,
  string
> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

export const COMPLAINT_CATEGORY_LABELS: Record<
  ComplaintCategory,
  string
> = {
  INSTALLATION: "Installation",
  SERVICE: "Service",
  REPAIR: "Repair",
  UNINSTALLATION: "Uninstallation",
  PRODUCT: "Product",
  OTHER: "Other",
};

export const COMPLAINT_STATUS_OPTIONS = Object.entries(
  COMPLAINT_STATUS_LABELS
).map(([value, label]) => ({
  value,
  label,
}));

export const COMPLAINT_PRIORITY_OPTIONS = Object.entries(
  COMPLAINT_PRIORITY_LABELS
).map(([value, label]) => ({
  value,
  label,
}));

export const COMPLAINT_CATEGORY_OPTIONS = Object.entries(
  COMPLAINT_CATEGORY_LABELS
).map(([value, label]) => ({
  value,
  label,
}));