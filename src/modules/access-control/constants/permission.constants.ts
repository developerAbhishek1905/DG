import type { Permission } from "../types/accessControl.types";

export const PERMISSIONS = {
  DASHBOARD_ACCESS: "dashboard.access",
  DASHBOARD_VIEW: "dashboard.view",
  DASHBOARD_OPERATIONS: "dashboard.operations",
  DASHBOARD_FINANCE: "dashboard.finance",
  DASHBOARD_DEALER_PERFORMANCE: "dashboard.dealer_performance",
  DASHBOARD_SLA: "dashboard.sla",

  COMPLAINT_ACCESS: "complaints.access",

  DEALER_ACCESS: "dealers.access",

  PRODUCT_MASTER_ACCESS: "productMaster.access",

  // =========================
  // CATEGORY
  // =========================

  CATEGORY_ACCESS: "category.access",
  CATEGORY_TABLE: "category.table",
  CATEGORY_CREATE: "category.create",
  CATEGORY_VIEW: "category.view",
  CATEGORY_UPDATE: "category.update",
  CATEGORY_DELETE: "category.delete",
  CATEGORY_IMPORT: "category.import",
  CATEGORY_EXPORT: "category.export",

  // =========================
  // BRAND
  // =========================

  BRAND_ACCESS: "brand.access",
  BRAND_TABLE: "brand.table",
  BRAND_CREATE: "brand.create",
  BRAND_VIEW: "brand.view",
  BRAND_UPDATE: "brand.update",
  BRAND_DELETE: "brand.delete",
  BRAND_IMPORT: "brand.import",
  BRAND_EXPORT: "brand.export",

  // =========================
  // PRODUCT
  // =========================

  PRODUCT_ACCESS: "product.access",
  PRODUCT_TABLE: "product.table",
  PRODUCT_CREATE: "product.create",
  PRODUCT_VIEW: "product.view",
  PRODUCT_UPDATE: "product.update",
  PRODUCT_DELETE: "product.delete",
  PRODUCT_IMPORT: "product.import",
  PRODUCT_EXPORT: "product.export",

  // =========================
  // PRODUCT TYPE
  // =========================

  PRODUCT_TYPE_ACCESS: "product_type.access",
  PRODUCT_TYPE_TABLE: "product_type.table",
  PRODUCT_TYPE_CREATE: "product_type.create",
  PRODUCT_TYPE_VIEW: "product_type.view",
  PRODUCT_TYPE_UPDATE: "product_type.update",
  PRODUCT_TYPE_DELETE: "product_type.delete",
  PRODUCT_TYPE_IMPORT: "product_type.import",
  PRODUCT_TYPE_EXPORT: "product_type.export",

  // =========================
  // ADDRESS
  // =========================

  ADDRESS_ACCESS: "address.access",

  // =========================
  // STATE
  // =========================

  STATE_ACCESS: "state.access",
  STATE_TABLE: "state.table",
  STATE_CREATE: "state.create",
  STATE_VIEW: "state.view",
  STATE_UPDATE: "state.update",
  STATE_DELETE: "state.delete",
  STATE_IMPORT: "state.import",
  STATE_EXPORT: "state.export",

  // =========================
  // DISTRICT
  // =========================

  DISTRICT_ACCESS: "district.access",
  DISTRICT_TABLE: "district.table",
  DISTRICT_CREATE: "district.create",
  DISTRICT_VIEW: "district.view",
  DISTRICT_UPDATE: "district.update",
  DISTRICT_DELETE: "district.delete",
  DISTRICT_IMPORT: "district.import",
  DISTRICT_EXPORT: "district.export",

  // =========================
  // CITY
  // =========================

  CITY_ACCESS: "city.access",
  CITY_TABLE: "city.table",
  CITY_CREATE: "city.create",
  CITY_VIEW: "city.view",
  CITY_UPDATE: "city.update",
  CITY_DELETE: "city.delete",
  CITY_IMPORT: "city.import",
  CITY_EXPORT: "city.export",

  // =========================
  // PINCODE
  // =========================

  PINCODE_ACCESS: "pincode.access",
  PINCODE_TABLE: "pincode.table",
  PINCODE_CREATE: "pincode.create",
  PINCODE_VIEW: "pincode.view",
  PINCODE_UPDATE: "pincode.update",
  PINCODE_DELETE: "pincode.delete",
  PINCODE_IMPORT: "pincode.import",
  PINCODE_EXPORT: "pincode.export",

  // =========================
  // AREA
  // =========================

  AREA_ACCESS: "area.access",
  AREA_TABLE: "area.table",
  AREA_CREATE: "area.create",
  AREA_VIEW: "area.view",
  AREA_UPDATE: "area.update",
  AREA_DELETE: "area.delete",
  AREA_IMPORT: "area.import",
  AREA_EXPORT: "area.export",

  // =========================
  // REASON MASTER
  // =========================

  REASON_ACCESS: "reason.access",
  REASON_TABLE: "reason.table",
  REASON_CREATE: "reason.create",
  REASON_VIEW: "reason.view",
  REASON_UPDATE: "reason.update",
  REASON_DELETE: "reason.delete",
  // REASON_IMPORT: "reason.import",
  // REASON_EXPORT: "reason.export",
  REASON_ACTIVE: "reason.active",

  // =========================
  // DEALER MASTER
  // =========================

  DEALER_VIEW: "dealers.view",
  DEAlER_TABLE: "dealers.table",
  DEALER_CREATE: "dealers.create",
  DEALER_UPDATE: "dealers.update",
  DEALER_DELETE: "dealers.delete",
  DEALER_PERFORMANCE_VIEW: "dealers.performance.view",
  DEALER_CAPACITY_MANAGE: "dealers.capacity.manage",
  DEALER_LEAVE: "dealers.leave",
  DEALER_REJOIN: "dealers.rejoin",
  DEALER_RATING: "dealers.rating",
  DEALER_SUSPEND: "dealers.suspend",
  DEALER_LEAVE_HISTORY: "dealers.leave_history",

  ITEM_ACCESS: "item.access",

  APPOINTMENT_ACCESS: "appointments.access",

  PENDING_ACCESS: "pending.access",

  CANCELLATION_ACCESS: "cancellations.access",
  CLOSURE_ACCESS: "closures.access",
  VERIFICATION_ACCESS: "verification.access",
  BILLING_ACCESS: "billing.access",
  LEDGER_ACCESS: "ledger.access",
  NOTIFICATION_ACCESS: "notifications.access",
  // AREA_ACCESS: "area.access",
  USER_ACCESS: "users.access",
  // BRAND_ACCESS: "brand.access",

  USER_VIEW: "users.view",
  USER_CREATE: "users.create",
  USER_UPDATE: "users.update",
  USER_DELETE: "users.delete",
  USER_ASSIGN_ROLE: "users.assign_role",
  USER_RESET_PASSWORD: "users.reset_password",
  USER_SUSPEND: "users.suspend",

  ROLE_ACCESS: "roles.access",
  ROLE_VIEW: "roles.view",
  ROLE_CREATE: "roles.create",
  ROLE_UPDATE: "roles.update",
  ROLE_DELETE: "roles.delete",
  ROLE_PERMISSION_MANAGE: "roles.permissions.manage",
  ROLE_PERMISSION_VIEW: "roles.permissions.view",

  COMPLAINT_VIEW: "complaints.view",
  COMPLAINT_CREATE: "complaints.create",
  COMPLAINT_UPDATE: "complaints.update",
  COMPLAINT_DELETE: "complaints.delete",
  COMPLAINT_ASSIGN: "complaints.assign",
  COMPLAINT_REASSIGN: "complaints.reassign",
  COMPLAINT_UPDATE_STATUS: "complaints.update_status",
  COMPLAINT_CANCEL: "complaints.cancel",
  COMPLAINT_CLOSE: "complaints.close",
  COMPLAINT_VERIFY: "complaints.verify",
  COMPLAINT_TABLE: "complaints.table",
  COMPLAINT_SUSPEND: "complaints.suspend",
  COMPLAINT_ACTIVITY: "complaints.activity",

  APPOINTMENT_VIEW: "appointments.view",
  APPOINTMENT_CREATE: "appointments.create",
  APPOINTMENT_UPDATE: "appointments.update",
  APPOINTMENT_CONFIRM: "appointments.confirm",
  APPOINTMENT_RESCHEDULE: "appointments.reschedule",
  APPOINTMENT_COMPLETE: "appointments.complete",
  APPOINTMENT_CANCEL: "appointments.cancel",
  APPOINTMENT_TABLE: "appointments.table",

  PENDING_VIEW: "pending.view",
  PENDING_CREATE: "pending.create",
  PENDING_UPDATE: "pending.update",
  PENDING_RESOLVE: "pending.resolve",
  PENDING_CONTINUE: "pending.continue",
  PENDING_REASSIGN: "pending.reassign",
  PENDING_ESCALATE: "pending.escalate",
  PENDING_CANCEL: "pending.cancel",

  SLA_VIEW: "sla.view",
  SLA_REMINDER: "sla.reminder",
  SLA_MANAGE: "sla.manage",

  CANCELLATION_VIEW: "cancellations.view",
  CANCELLATION_CREATE: "cancellations.create",
  CANCELLATION_VERIFY: "cancellations.verify",
  CANCELLATION_APPROVE: "cancellations.approve",
  CANCELLATION_REJECT: "cancellations.reject",
  CANCELLATION_REASSIGN: "cancellations.reassign",

  CLOSURE_VIEW: "closures.view",
  CLOSURE_CREATE: "closures.create",
  CLOSURE_SUBMIT: "closures.submit",
  CLOSURE_VERIFY: "closures.verify",
  CLOSURE_REJECT: "closures.reject",
  CLOSURE_HISTORY_VIEW: "closures.history.view",

  VERIFICATION_VIEW: "verification.view",
  VERIFICATION_REVIEW: "verification.review",
  VERIFICATION_VERIFY: "verification.verify",
  VERIFICATION_REJECT: "verification.reject",
  VERIFICATION_CORRECTION: "verification.correction",
  VERIFICATION_ASSIGN: "verification.assign",
  PENDING_TABLE: "pending.table",
  CANCELLATION_TABLE: "cancellations.table",
  CANCELLATION_REOPEN: "cancellations.reopen",
  CANCELLATION_CANCEL: "cancellations.cancel",
  CLOSURE_TABLE: "closures.table",
  CLOSURE_APPROVE: "closures.approve",
  RATE_ACCESS: "rate.access",
  RATE_TABLE: "rate.table",
  RATE_CREATE: "rate.create",
  RATE_UPDATE: "rate.update",
  RATE_DELETE: "rate.delete",

  BILLING_VIEW: "billing.view",
  BILLING_GENERATE: "billing.generate",
  BILLING_APPROVE: "billing.approve",
  BILLING_REJECT: "billing.reject",
  BILLING_RATE_VIEW: "billing.rates.view",
  BILLING_RATE_CREATE: "billing.rates.create",
  BILLING_RATE_UPDATE: "billing.rates.update",
  BILLING_RATE_DELETE: "billing.rates.delete",
  BILLING_TABLE: "billing.table",
  BILLING_UPDATE: "billing.update",
  BILLING_DUMMY: "billing.dummy",
  LEDGER_CREATE: "ledger.create",

  LEDGER_VIEW: "ledger.view",
  LEDGER_DEALER_VIEW: "ledger.dealer.view",
  LEDGER_TRANSACTION_VIEW: "ledger.transaction.view",
  LEDGER_ADJUSTMENT_CREATE: "ledger.adjustment.create",
  LEDGER_EXPORT: "ledger.export",

  PAYMENT_VIEW: "payment.view",
  PAYMENT_DETAILS_VIEW: "payment.details.view",
  PAYMENT_CREATE: "payment.create",
  PAYMENT_APPROVE: "payment.approve",
  PAYMENT_REJECT: "payment.reject",
  PAYMENT_REVERSE: "payment.reverse",
  PAYMENT_EXPORT: "payment.export",

  RECONCILIATION_VIEW: "reconciliation.view",
  RECONCILIATION_DETAILS_VIEW: "reconciliation.details.view",
  RECONCILIATION_RECONCILE: "reconciliation.reconcile",
  RECONCILIATION_MARK_MATCHED: "reconciliation.mark_matched",
  RECONCILIATION_EXPORT: "reconciliation.export",

  REPORT_VIEW: "report.view",
  REPORT_COMPLAINT: "report.complaint",
  REPORT_DEALER: "report.dealer",
  REPORT_SLA: "report.sla",
  REPORT_CANCELLATION: "report.cancellation",
  REPORT_BILLING: "report.billing",
  REPORT_PAYMENT: "report.payment",
  REPORT_EXPORT: "report.export",
  NOTIFICATION_VIEW: "notification.view",
  NOTIFICATION_READ: "notification.read",
  NOTIFICATION_DELETE: "notification.delete",
  NOTIFICATION_CLEAR: "notification.clear",

  AUDIT_VIEW: "audit.view",
  AUDIT_DETAILS: "audit.details",
  AUDIT_EXPORT: "audit.export",

  SETTINGS_VIEW: "settings.view",
  SETTINGS_SLA: "settings.sla",
  SETTINGS_NOTIFICATION: "settings.notification",
  SETTINGS_BILLING: "settings.billing",
  SETTINGS_STATUS: "settings.status",
  SETTINGS_CANCELLATION_REASON: "settings.cancellation_reason",
  SETTINGS_PENDING_REASON: "settings.pending_reason",
  SETTINGS_PERMISSION: "settings.permission",

  ALLOCATION_VIEW: "allocation.view",
  ALLOCATION_ASSIGN: "allocation.assign",
  ALLOCATION_REASSIGN: "allocation.reassign",
  ALLOCATION_HISTORY_VIEW: "allocation.history.view",
  ALLOCATION_ACCESS: "allocation.access",
  DEALER_ACTIVITY_ACCESS: "dealers.activity.access",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const PERMISSION_LIST: Permission[] = [
  // {
  //   id: "P-001",
  //   key: PERMISSIONS.BRAND_ACCESS,
  //   module: "Brand",
  //   action: "access",
  //   label: "Access Brand",
  // },
  {
    id: "P-002",
    key: PERMISSIONS.COMPLAINT_ACCESS,
    module: "Complaints",
    action: "access",
    label: "Access Complaints",
  },
  {
    id: "P-003",
    key: PERMISSIONS.DEALER_ACCESS,
    module: "Dealers",
    action: "access",
    label: "Access Dealers",
  },

  // =========================
  // PRODUCT MASTER
  // =========================

  {
    id: "P-001",
    key: PERMISSIONS.PRODUCT_MASTER_ACCESS,
    module: "Product Master",
    action: "access",
    label: "Access Product",
  },

  // =========================
  // CATEGORY
  // =========================
  {
    id: "P-001",
    key: PERMISSIONS.CATEGORY_ACCESS,
    module: "Category",
    action: "access",
    label: "Access Category",
  },
  {
    id: "P-002",
    key: PERMISSIONS.CATEGORY_TABLE,
    module: "Category",
    action: "table",
    label: "View Category Table",
  },
  {
    id: "P-003",
    key: PERMISSIONS.CATEGORY_CREATE,
    module: "Category",
    action: "create",
    label: "Create Category",
  },
  {
    id: "P-004",
    key: PERMISSIONS.CATEGORY_VIEW,
    module: "Category",
    action: "view",
    label: "View Category",
  },
  {
    id: "P-005",
    key: PERMISSIONS.CATEGORY_UPDATE,
    module: "Category",
    action: "update",
    label: "Update Category",
  },
  {
    id: "P-006",
    key: PERMISSIONS.CATEGORY_DELETE,
    module: "Category",
    action: "delete",
    label: "Delete Category",
  },
  {
    id: "P-007",
    key: PERMISSIONS.CATEGORY_IMPORT,
    module: "Category",
    action: "import",
    label: "Import Category",
  },
  {
    id: "P-008",
    key: PERMISSIONS.CATEGORY_EXPORT,
    module: "Category",
    action: "export",
    label: "Export Category",
  },

  // =========================
  // BRAND
  // =========================
  {
    id: "P-009",
    key: PERMISSIONS.BRAND_ACCESS,
    module: "Brand",
    action: "access",
    label: "Access Brand",
  },
  {
    id: "P-010",
    key: PERMISSIONS.BRAND_TABLE,
    module: "Brand",
    action: "table",
    label: "View Brand Table",
  },
  {
    id: "P-011",
    key: PERMISSIONS.BRAND_CREATE,
    module: "Brand",
    action: "create",
    label: "Create Brand",
  },
  {
    id: "P-012",
    key: PERMISSIONS.BRAND_VIEW,
    module: "Brand",
    action: "view",
    label: "View Brand",
  },
  {
    id: "P-013",
    key: PERMISSIONS.BRAND_UPDATE,
    module: "Brand",
    action: "update",
    label: "Update Brand",
  },
  {
    id: "P-014",
    key: PERMISSIONS.BRAND_DELETE,
    module: "Brand",
    action: "delete",
    label: "Delete Brand",
  },
  {
    id: "P-015",
    key: PERMISSIONS.BRAND_IMPORT,
    module: "Brand",
    action: "import",
    label: "Import Brand",
  },
  {
    id: "P-016",
    key: PERMISSIONS.BRAND_EXPORT,
    module: "Brand",
    action: "export",
    label: "Export Brand",
  },

  // =========================
  // PRODUCT
  // =========================
  {
    id: "P-017",
    key: PERMISSIONS.PRODUCT_ACCESS,
    module: "Product",
    action: "access",
    label: "Access Product",
  },
  {
    id: "P-018",
    key: PERMISSIONS.PRODUCT_TABLE,
    module: "Product",
    action: "table",
    label: "View Product Table",
  },
  {
    id: "P-019",
    key: PERMISSIONS.PRODUCT_CREATE,
    module: "Product",
    action: "create",
    label: "Create Product",
  },
  {
    id: "P-020",
    key: PERMISSIONS.PRODUCT_VIEW,
    module: "Product",
    action: "view",
    label: "View Product",
  },
  {
    id: "P-021",
    key: PERMISSIONS.PRODUCT_UPDATE,
    module: "Product",
    action: "update",
    label: "Update Product",
  },
  {
    id: "P-022",
    key: PERMISSIONS.PRODUCT_DELETE,
    module: "Product",
    action: "delete",
    label: "Delete Product",
  },
  {
    id: "P-023",
    key: PERMISSIONS.PRODUCT_IMPORT,
    module: "Product",
    action: "import",
    label: "Import Product",
  },
  {
    id: "P-024",
    key: PERMISSIONS.PRODUCT_EXPORT,
    module: "Product",
    action: "export",
    label: "Export Product",
  },

  // =========================
  // PRODUCT TYPE
  // =========================
  {
    id: "P-025",
    key: PERMISSIONS.PRODUCT_TYPE_ACCESS,
    module: "Product Type",
    action: "access",
    label: "Access Product Type",
  },
  {
    id: "P-026",
    key: PERMISSIONS.PRODUCT_TYPE_TABLE,
    module: "Product Type",
    action: "table",
    label: "View Product Type Table",
  },
  {
    id: "P-027",
    key: PERMISSIONS.PRODUCT_TYPE_CREATE,
    module: "Product Type",
    action: "create",
    label: "Create Product Type",
  },
  {
    id: "P-028",
    key: PERMISSIONS.PRODUCT_TYPE_VIEW,
    module: "Product Type",
    action: "view",
    label: "View Product Type",
  },
  {
    id: "P-029",
    key: PERMISSIONS.PRODUCT_TYPE_UPDATE,
    module: "Product Type",
    action: "update",
    label: "Update Product Type",
  },
  {
    id: "P-030",
    key: PERMISSIONS.PRODUCT_TYPE_DELETE,
    module: "Product Type",
    action: "delete",
    label: "Delete Product Type",
  },
  {
    id: "P-031",
    key: PERMISSIONS.PRODUCT_TYPE_IMPORT,
    module: "Product Type",
    action: "import",
    label: "Import Product Type",
  },
  {
    id: "P-032",
    key: PERMISSIONS.PRODUCT_TYPE_EXPORT,
    module: "Product Type",
    action: "export",
    label: "Export Product Type",
  },

  // =========================
  // ADDRESS
  // =========================
  {
    id: "P-033",
    key: PERMISSIONS.ADDRESS_ACCESS,
    module: "Address",
    action: "access",
    label: "Access Address",
  },

  // =========================
  // STATE
  // =========================
  {
    id: "P-041",
    key: PERMISSIONS.STATE_ACCESS,
    module: "State",
    action: "access",
    label: "Access State",
  },
  {
    id: "P-042",
    key: PERMISSIONS.STATE_TABLE,
    module: "State",
    action: "table",
    label: "View State Table",
  },
  {
    id: "P-043",
    key: PERMISSIONS.STATE_CREATE,
    module: "State",
    action: "create",
    label: "Create State",
  },
  {
    id: "P-044",
    key: PERMISSIONS.STATE_VIEW,
    module: "State",
    action: "view",
    label: "View State",
  },
  {
    id: "P-045",
    key: PERMISSIONS.STATE_UPDATE,
    module: "State",
    action: "update",
    label: "Update State",
  },
  {
    id: "P-046",
    key: PERMISSIONS.STATE_DELETE,
    module: "State",
    action: "delete",
    label: "Delete State",
  },
  {
    id: "P-047",
    key: PERMISSIONS.STATE_IMPORT,
    module: "State",
    action: "import",
    label: "Import State",
  },
  {
    id: "P-048",
    key: PERMISSIONS.STATE_EXPORT,
    module: "State",
    action: "export",
    label: "Export State",
  },

  // =========================
  // DISTRICT
  // =========================
  {
    id: "P-049",
    key: PERMISSIONS.DISTRICT_ACCESS,
    module: "District",
    action: "access",
    label: "Access District",
  },
  {
    id: "P-050",
    key: PERMISSIONS.DISTRICT_TABLE,
    module: "District",
    action: "table",
    label: "View District Table",
  },
  {
    id: "P-051",
    key: PERMISSIONS.DISTRICT_CREATE,
    module: "District",
    action: "create",
    label: "Create District",
  },
  {
    id: "P-052",
    key: PERMISSIONS.DISTRICT_VIEW,
    module: "District",
    action: "view",
    label: "View District",
  },
  {
    id: "P-053",
    key: PERMISSIONS.DISTRICT_UPDATE,
    module: "District",
    action: "update",
    label: "Update District",
  },
  {
    id: "P-054",
    key: PERMISSIONS.DISTRICT_DELETE,
    module: "District",
    action: "delete",
    label: "Delete District",
  },
  {
    id: "P-055",
    key: PERMISSIONS.DISTRICT_IMPORT,
    module: "District",
    action: "import",
    label: "Import District",
  },
  {
    id: "P-056",
    key: PERMISSIONS.DISTRICT_EXPORT,
    module: "District",
    action: "export",
    label: "Export District",
  },

  // =========================
  // CITY
  // =========================
  {
    id: "P-057",
    key: PERMISSIONS.CITY_ACCESS,
    module: "City",
    action: "access",
    label: "Access City",
  },
  {
    id: "P-058",
    key: PERMISSIONS.CITY_TABLE,
    module: "City",
    action: "table",
    label: "View City Table",
  },
  {
    id: "P-059",
    key: PERMISSIONS.CITY_CREATE,
    module: "City",
    action: "create",
    label: "Create City",
  },
  {
    id: "P-060",
    key: PERMISSIONS.CITY_VIEW,
    module: "City",
    action: "view",
    label: "View City",
  },
  {
    id: "P-061",
    key: PERMISSIONS.CITY_UPDATE,
    module: "City",
    action: "update",
    label: "Update City",
  },
  {
    id: "P-062",
    key: PERMISSIONS.CITY_DELETE,
    module: "City",
    action: "delete",
    label: "Delete City",
  },
  {
    id: "P-063",
    key: PERMISSIONS.CITY_IMPORT,
    module: "City",
    action: "import",
    label: "Import City",
  },
  {
    id: "P-064",
    key: PERMISSIONS.CITY_EXPORT,
    module: "City",
    action: "export",
    label: "Export City",
  },

  // =========================
  // PINCODE
  // =========================
  {
    id: "P-065",
    key: PERMISSIONS.PINCODE_ACCESS,
    module: "Pincode",
    action: "access",
    label: "Access Pincode",
  },
  {
    id: "P-066",
    key: PERMISSIONS.PINCODE_TABLE,
    module: "Pincode",
    action: "table",
    label: "View Pincode Table",
  },
  {
    id: "P-067",
    key: PERMISSIONS.PINCODE_CREATE,
    module: "Pincode",
    action: "create",
    label: "Create Pincode",
  },
  {
    id: "P-068",
    key: PERMISSIONS.PINCODE_VIEW,
    module: "Pincode",
    action: "view",
    label: "View Pincode",
  },
  {
    id: "P-069",
    key: PERMISSIONS.PINCODE_UPDATE,
    module: "Pincode",
    action: "update",
    label: "Update Pincode",
  },
  {
    id: "P-070",
    key: PERMISSIONS.PINCODE_DELETE,
    module: "Pincode",
    action: "delete",
    label: "Delete Pincode",
  },
  {
    id: "P-071",
    key: PERMISSIONS.PINCODE_IMPORT,
    module: "Pincode",
    action: "import",
    label: "Import Pincode",
  },
  {
    id: "P-072",
    key: PERMISSIONS.PINCODE_EXPORT,
    module: "Pincode",
    action: "export",
    label: "Export Pincode",
  },

  // =========================
  // AREA
  // =========================
  {
    id: "P-073",
    key: PERMISSIONS.AREA_ACCESS,
    module: "Area",
    action: "access",
    label: "Access Area",
  },
  {
    id: "P-074",
    key: PERMISSIONS.AREA_TABLE,
    module: "Area",
    action: "table",
    label: "View Area Table",
  },
  {
    id: "P-075",
    key: PERMISSIONS.AREA_CREATE,
    module: "Area",
    action: "create",
    label: "Create Area",
  },
  {
    id: "P-076",
    key: PERMISSIONS.AREA_VIEW,
    module: "Area",
    action: "view",
    label: "View Area",
  },
  {
    id: "P-077",
    key: PERMISSIONS.AREA_UPDATE,
    module: "Area",
    action: "update",
    label: "Update Area",
  },
  {
    id: "P-078",
    key: PERMISSIONS.AREA_DELETE,
    module: "Area",
    action: "delete",
    label: "Delete Area",
  },
  {
    id: "P-079",
    key: PERMISSIONS.AREA_IMPORT,
    module: "Area",
    action: "import",
    label: "Import Area",
  },
  {
    id: "P-080",
    key: PERMISSIONS.AREA_EXPORT,
    module: "Area",
    action: "export",
    label: "Export Area",
  },

  // =========================
  // REASON MASTER
  // =========================

  {
    id: "P-081",
    key: PERMISSIONS.REASON_ACCESS,
    module: "Reason",
    action: "access",
    label: "Access Reason Master",
  },
  {
    id: "P-082",
    key: PERMISSIONS.REASON_TABLE,
    module: "Reason",
    action: "table",
    label: "View Reason Table",
  },
  {
    id: "P-083",
    key: PERMISSIONS.REASON_CREATE,
    module: "Reason",
    action: "create",
    label: "Create Reason",
  },
  {
    id: "P-084",
    key: PERMISSIONS.REASON_VIEW,
    module: "Reason",
    action: "view",
    label: "View Reason",
  },
  {
    id: "P-085",
    key: PERMISSIONS.REASON_UPDATE,
    module: "Reason",
    action: "update",
    label: "Update Reason",
  },
  {
    id: "P-086",
    key: PERMISSIONS.REASON_DELETE,
    module: "Reason",
    action: "delete",
    label: "Delete Reason",
  },
  // {
  //   id: "P-087",
  //   key: PERMISSIONS.REASON_IMPORT,
  //   module: "Reason",
  //   action: "import",
  //   label: "Import Reason",
  // },
  // {
  //   id: "P-088",
  //   key: PERMISSIONS.REASON_EXPORT,
  //   module: "Reason",
  //   action: "export",
  //   label: "Export Reason",
  // },
  {
    id: "P-089",
    key: PERMISSIONS.REASON_ACTIVE,
    module: "Reason",
    action: "active",
    label: "Active Reason",
  },
  // {
  //   id: "P-004",
  //   key: PERMISSIONS.CATEGORY_ACCESS,
  //   module: "Category Master",
  //   action: "access",
  //   label: "Access Category Master",
  // },

  // {
  //   id: "P-005",
  //   key: PERMISSIONS.ITEM_ACCESS,
  //   module: "Item Master",
  //   action: "access",
  //   label: "Access Item Master",
  // },

  // =========================
  // DEALER MASTER
  // =========================

  {
    id: "P-019",
    key: PERMISSIONS.DEALER_VIEW,
    module: "Dealers",
    action: "view",
    label: "View Dealers",
  },
  {
    id: "P-019",
    key: PERMISSIONS.DEAlER_TABLE,
    module: "Dealers",
    action: "table",
    label: "View Dealers Table",
  },

  {
    id: "P-020",
    key: PERMISSIONS.DEALER_CREATE,
    module: "Dealers",
    action: "create",
    label: "Create Dealers",
  },

  {
    id: "P-021",
    key: PERMISSIONS.DEALER_UPDATE,
    module: "Dealers",
    action: "update",
    label: "Update Dealers",
  },

  {
    id: "P-022",
    key: PERMISSIONS.DEALER_DELETE,
    module: "Dealers",
    action: "delete",
    label: "Delete Dealers",
  },

  {
    id: "P-023",
    key: PERMISSIONS.DEALER_PERFORMANCE_VIEW,
    module: "Dealers",
    action: "performance",
    label: "View Performance",
  },
  {
    id: "P-DEALER-LEAVE",
    key: PERMISSIONS.DEALER_LEAVE,
    module: "Dealers",
    action: "leave",
    label: "Mark Dealer Leave",
  },
  {
    id: "P-DEALER-REJOIN",
    key: PERMISSIONS.DEALER_REJOIN,
    module: "Dealers",
    action: "rejoin",
    label: "Rejoin Dealer",
  },
  {
    id: "P-DEALER-RATING",
    key: PERMISSIONS.DEALER_RATING,
    module: "Dealers",
    action: "rating",
    label: "Change Dealer Rating",
  },
  {
    id: "P-DEALER-SUSPEND",
    key: PERMISSIONS.DEALER_SUSPEND,
    module: "Dealers",
    action: "suspend",
    label: "Suspend Dealer",
  },
  {
    id: "P-DEALER-LEAVE_HISTORY",
    key: PERMISSIONS.DEALER_LEAVE_HISTORY,
    module: "Dealers",
    action: "history",
    label: "View Dealer Leave History",
  },

  {
    id: "P-006",
    key: PERMISSIONS.APPOINTMENT_ACCESS,
    module: "Appointments",
    action: "access",
    label: "Access Appointments",
  },
  {
    id: "P-007",
    key: PERMISSIONS.PENDING_ACCESS,
    module: "Pending",
    action: "access",
    label: "Access Pending & SLA",
  },
  {
    id: "P-008",
    key: PERMISSIONS.CANCELLATION_ACCESS,
    module: "Cancellations",
    action: "access",
    label: "Access Cancellation",
  },
  {
    id: "P-009",
    key: PERMISSIONS.CLOSURE_ACCESS,
    module: "Closures",
    action: "access",
    label: "Access Closure History",
  },
  {
    id: "P-010",
    key: PERMISSIONS.VERIFICATION_ACCESS,
    module: "DG Verification",
    action: "access",
    label: "Access DG Verification",
  },
  {
    id: "P-011",
    key: PERMISSIONS.BILLING_ACCESS,
    module: "Billing",
    action: "access",
    label: "Access Billing",
  },
  {
    id: "P-012",
    key: PERMISSIONS.LEDGER_ACCESS,
    module: "Dealer Ledger",
    action: "access",
    label: "Access Dealer Ledger",
  },
  {
    id: "P-015",
    key: PERMISSIONS.USER_ACCESS,
    module: "Users",
    action: "access",
    label: "Access Users",
  },
  {
    id: "P-016",
    key: PERMISSIONS.ROLE_ACCESS,
    module: "Roles & Permissions",
    action: "access",
    label: "Access Roles & Permissions",
  },
  {
    id: "P-002",
    key: PERMISSIONS.USER_VIEW,
    module: "Users",
    action: "view",
    label: "View Users",
  },

  {
    id: "P-003",
    key: PERMISSIONS.USER_CREATE,
    module: "Users",
    action: "create",
    label: "Create Users",
  },

  {
    id: "P-004",
    key: PERMISSIONS.USER_UPDATE,
    module: "Users",
    action: "update",
    label: "Update Users",
  },

  {
    id: "P-005",
    key: PERMISSIONS.USER_DELETE,
    module: "Users",
    action: "delete",
    label: "Delete Users",
  },

  {
    id: "P-006",
    key: PERMISSIONS.USER_ASSIGN_ROLE,
    module: "Users",
    action: "assign_role",
    label: "Assign Role",
  },

  {
    id: "P-007",
    key: PERMISSIONS.ROLE_VIEW,
    module: "Roles",
    action: "view",
    label: "View Roles",
  },

  {
    id: "P-500",
    key: PERMISSIONS.ROLE_ACCESS,
    module: "Roles",
    action: "access",
    label: "View Roles",
  },

  {
    id: "P-008",
    key: PERMISSIONS.ROLE_CREATE,
    module: "Roles",
    action: "create",
    label: "Create Roles",
  },

  {
    id: "P-009",
    key: PERMISSIONS.ROLE_UPDATE,
    module: "Roles",
    action: "update",
    label: "Update Roles",
  },

  {
    id: "P-010",
    key: PERMISSIONS.ROLE_DELETE,
    module: "Roles",
    action: "delete",
    label: "Delete Roles",
  },

  {
    id: "P-011",
    key: PERMISSIONS.ROLE_PERMISSION_MANAGE,
    module: "Roles",
    action: "permissions",
    label: "Manage Permissions",
  },

  {
    id: "role-permission-view",
    key: PERMISSIONS.ROLE_PERMISSION_VIEW,
    module: "Roles",
    action: "permissions",
    label: "View Role Permissions",
  },

  // {
  //   id: "P-012",
  //   key:
  //     PERMISSIONS.COMPLAINT_VIEW,
  //   module:
  //     "Complaints",
  //   action: "view",
  //   label:
  //     "View Complaints",
  // },

  // {
  //   id: "P-013",
  //   key:
  //     PERMISSIONS.COMPLAINT_CREATE,
  //   module:
  //     "Complaints",
  //   action: "create",
  //   label:
  //     "Create Complaints",
  // },

  // {
  //   id: "P-014",
  //   key:
  //     PERMISSIONS.COMPLAINT_UPDATE,
  //   module:
  //     "Complaints",
  //   action: "update",
  //   label:
  //     "Update Complaints",
  // },

  // {
  //   id: "P-015",
  //   key:
  //     PERMISSIONS.COMPLAINT_ASSIGN,
  //   module:
  //     "Complaints",
  //   action: "assign",
  //   label:
  //     "Assign Dealer",
  // },

  // {
  //   id: "P-016",
  //   key:
  //     PERMISSIONS.COMPLAINT_REASSIGN,
  //   module:
  //     "Complaints",
  //   action: "reassign",
  //   label:
  //     "Reassign Dealer",
  // },

  // {
  //   id: "P-017",
  //   key:
  //     PERMISSIONS.COMPLAINT_CANCEL,
  //   module:
  //     "Complaints",
  //   action: "cancel",
  //   label:
  //     "Cancel Complaint",
  // },

  // {
  //   id: "P-018",
  //   key:
  //     PERMISSIONS.COMPLAINT_VERIFY,
  //   module:
  //     "Complaints",
  //   action: "verify",
  //   label:
  //     "Verify Complaint",
  // },

  {
    id: "P-012",
    key: "complaints.view",
    module: "Complaints",
    action: "view",
    label: "View Complaints",
  },

  {
    id: "P-013",
    key: "complaints.create",
    module: "Complaints",
    action: "create",
    label: "Create Complaints",
  },

  {
    id: "P-014",
    key: "complaints.update",
    module: "Complaints",
    action: "update",
    label: "Update Complaints",
  },

  {
    id: "P-015",
    key: "complaints.delete",
    module: "Complaints",
    action: "delete",
    label: "Delete Complaints",
  },

  {
    id: "P-016",
    key: "complaints.assign",
    module: "Complaints",
    action: "assign",
    label: "Assign Complaint",
  },

  {
    id: "P-017",
    key: "complaints.reassign",
    module: "Complaints",
    action: "reassign",
    label: "Reassign Complaint",
  },

  {
    id: "P-018",
    key: "complaints.verify",
    module: "Complaints",
    action: "verify",
    label: "Verify Complaint",
  },
  {
    id: "P-COMPLAINT-TABLE",
    key: PERMISSIONS.COMPLAINT_TABLE,
    module: "Complaints",
    action: "table",
    label: "View Complaints Table",
  },
  {
    id: "P-COMPLAINT-SUSPEND",
    key: PERMISSIONS.COMPLAINT_SUSPEND,
    module: "Complaints",
    action: "suspend",
    label: "Suspend Complaint",
  },
  {
    id: "P-COMPLAINT-CLOSE",
    key: PERMISSIONS.COMPLAINT_CLOSE,
    module: "Complaints",
    action: "close",
    label: "Close Complaint",
  },
  {
    id: "P-COMPLAINT-ACTIVITY",
    key: PERMISSIONS.COMPLAINT_ACTIVITY,
    module: "Complaints",
    action: "activity",
    label: "View Complaint Activity",
  },

  {
    id: "P-038",
    key: PERMISSIONS.APPOINTMENT_VIEW,
    module: "Appointments",
    action: "view",
    label: "View Appointments",
  },
  {
    id: "P-APPOINTMENT-TABLE",
    key: PERMISSIONS.APPOINTMENT_TABLE,
    module: "Appointments",
    action: "table",
    label: "View Appointments Table",
  },

  {
    id: "P-045",
    key: PERMISSIONS.PENDING_VIEW,
    module: "Pending",
    action: "view",
    label: "View Pending Complaints",
  },

  {
    id: "P-047",
    key: PERMISSIONS.PENDING_UPDATE,
    module: "Pending",
    action: "update",
    label: "Update Pending Complaint",
  },

  {
    id: "P-073",
    key: PERMISSIONS.BILLING_VIEW,
    module: "Billing",
    action: "view",
    label: "View Billing",
  },

  {
    id: "P-074",
    key: PERMISSIONS.BILLING_GENERATE,
    module: "Billing",
    action: "generate",
    label: "Generate Bill",
  },

  {
    id: "P-075",
    key: PERMISSIONS.BILLING_APPROVE,
    module: "Billing",
    action: "approve",
    label: "Approve Bill",
  },

  {
    id: "P-076",
    key: PERMISSIONS.BILLING_REJECT,
    module: "Billing",
    action: "reject",
    label: "Reject Bill",
  },
  {
    id: "P-BILLING-TABLE",
    key: PERMISSIONS.BILLING_TABLE,
    module: "Billing",
    action: "table",
    label: "View Billing Table",
  },
  {
    id: "P-BILLING-UPDATE",
    key: PERMISSIONS.BILLING_UPDATE,
    module: "Billing",
    action: "update",
    label: "Update Bill",
  },
  {
    id: "P-BILLING-DUMMY",
    key: PERMISSIONS.BILLING_DUMMY,
    module: "Billing",
    action: "dummy",
    label: "Create Dummy Bill",
  },

  {
    id: "P-034",
    key: PERMISSIONS.ALLOCATION_VIEW,
    module: "Allocation",
    action: "view",
    label: "View Dealer Allocation",
  },

  {
    id: "P-035",
    key: PERMISSIONS.ALLOCATION_ASSIGN,
    module: "Allocation",
    action: "assign",
    label: "Assign Dealer",
  },

  {
    id: "P-036",
    key: PERMISSIONS.ALLOCATION_REASSIGN,
    module: "Allocation",
    action: "reassign",
    label: "Reassign Dealer",
  },

  {
    id: "P-037",
    key: PERMISSIONS.ALLOCATION_HISTORY_VIEW,
    module: "Allocation",
    action: "history",
    label: "View Allocation History",
  },
  {
    id: "P-ALLOCATION-ACCESS",
    key: PERMISSIONS.ALLOCATION_ACCESS,
    module: "Allocation",
    action: "access",
    label: "Access Dealer Allocation",
  },
  {
    id: "P-DEALER-ACTIVITY-ACCESS",
    key: PERMISSIONS.DEALER_ACTIVITY_ACCESS,
    module: "Dealer Activity",
    action: "access",
    label: "Access Dealer Activity",
  },
  {
    id: "P-055",
    key: PERMISSIONS.CANCELLATION_VIEW,
    module: "Cancellations",
    action: "view",
    label: "View Cancellation Requests",
  },

  {
    id: "P-060",
    key: PERMISSIONS.CANCELLATION_REASSIGN,
    module: "Cancellations",
    action: "reassign",
    label: "Reassign After Cancellation",
  },
  {
    id: "P-061",
    key: PERMISSIONS.CLOSURE_VIEW,
    module: "Closures",
    action: "view",
    label: "View Closures",
  },

  {
    id: "P-PENDING-TABLE",
    key: PERMISSIONS.PENDING_TABLE,
    module: "Pending",
    action: "table",
    label: "View Pending Table",
  },
  {
    id: "P-CANCELLATION-TABLE",
    key: PERMISSIONS.CANCELLATION_TABLE,
    module: "Cancellations",
    action: "table",
    label: "View Cancellations Table",
  },
  {
    id: "P-CANCELLATION-REOPEN",
    key: PERMISSIONS.CANCELLATION_REOPEN,
    module: "Cancellations",
    action: "reopen",
    label: "Reopen Complaint",
  },
  {
    id: "P-CANCELLATION-CANCEL",
    key: PERMISSIONS.CANCELLATION_CANCEL,
    module: "Cancellations",
    action: "cancel",
    label: "Cancel Complaint",
  },
  {
    id: "P-CLOSURE-TABLE",
    key: PERMISSIONS.CLOSURE_TABLE,
    module: "Closures",
    action: "table",
    label: "View Closures Table",
  },
  {
    id: "P-CLOSURE-APPROVE",
    key: PERMISSIONS.CLOSURE_APPROVE,
    module: "Closures",
    action: "approve",
    label: "Approve Closure",
  },
  {
    id: "P-RATE-ACCESS",
    key: PERMISSIONS.RATE_ACCESS,
    module: "Closure Master",
    action: "access",
    label: "Access Closure Master",
  },
  {
    id: "P-RATE-TABLE",
    key: PERMISSIONS.RATE_TABLE,
    module: "Closure Master",
    action: "table",
    label: "View Closure Master Table",
  },
  {
    id: "P-RATE-CREATE",
    key: PERMISSIONS.RATE_CREATE,
    module: "Closure Master",
    action: "create",
    label: "Add Closure",
  },
  {
    id: "P-RATE-UPDATE",
    key: PERMISSIONS.RATE_UPDATE,
    module: "Closure Master",
    action: "update",
    label: "Update Closure",
  },
  {
    id: "P-RATE-DELETE",
    key: PERMISSIONS.RATE_DELETE,
    module: "Closure Master",
    action: "delete",
    label: "Delete Closure",
  },
  {
    id: "P-081",
    key: PERMISSIONS.LEDGER_VIEW,
    module: "Dealer Ledger",
    action: "view",
    label: "View Ledger Overview",
  },

  {
    id: "P-082",
    key: PERMISSIONS.LEDGER_DEALER_VIEW,
    module: "Dealer Ledger",
    action: "dealer_view",
    label: "View Dealer Ledger",
  },

  {
    id: "P-083",
    key: PERMISSIONS.LEDGER_TRANSACTION_VIEW,
    module: "Dealer Ledger",
    action: "transaction_view",
    label: "View Ledger Transactions",
  },

  {
    id: "P-084",
    key: PERMISSIONS.LEDGER_ADJUSTMENT_CREATE,
    module: "Dealer Ledger",
    action: "adjust",
    label: "Create Ledger Adjustment",
  },

  {
    id: "P-085",
    key: PERMISSIONS.LEDGER_EXPORT,
    module: "Dealer Ledger",
    action: "export",
    label: "Export Dealer Ledger",
  },
  {
    id: "P-LEDGER-CREATE",
    key: PERMISSIONS.LEDGER_CREATE,
    module: "Dealer Ledger",
    action: "create",
    label: "Add Ledger Entry",
  },

];
