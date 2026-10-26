import type { BillingType, LedgerStatus } from "../types/billing.types";

/*
| Single source of truth for the Billing list.
| Same labels are used by the filter dropdowns AND the table,
| so what you pick is exactly what you see in the rows.
| Values mirror the backend dealerLedger model enums.
*/

export const BILLING_TYPE_OPTIONS: { value: BillingType; label: string }[] = [
  { value: "FIXED", label: "Fixed" },
  { value: "PARTIAL_PAYMENT", label: "Partial Payment" },
  { value: "PROFIT_SHARING", label: "Profit Sharing" },
  { value: "CANCELLATION", label: "Cancellation" },
  { value: "OPENING_BALANCE", label: "Opening Balance" },
  { value: "ADJUSTMENT", label: "Adjustment" },
  { value: "DUMMY_BILL", label: "Dummy Bill" },
  { value: "PENALTY", label: "Penalty" },
  { value: "PAYMENT", label: "Payment" },
  { value: "AUTO_BILL", label: "Auto Bill" },
];

export const LEDGER_STATUS_OPTIONS: { value: LedgerStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "BILLED", label: "Billed" },
  { value: "REVERSED", label: "Reversed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const getBillingTypeLabel = (type?: string) =>
  BILLING_TYPE_OPTIONS.find((o) => o.value === type)?.label ??
  (type ? type.replaceAll("_", " ") : "-");

export const getLedgerStatusLabel = (status?: string) =>
  LEDGER_STATUS_OPTIONS.find((o) => o.value === status)?.label ??
  (status || "-");
