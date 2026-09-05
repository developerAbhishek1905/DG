import { configureStore } from "@reduxjs/toolkit";

// import uiReducer from "./uiSlice";
import authReducer from "../modules/auth/store/authSlice";
import complaintReducer from "../modules/complaints/store/complaintSlice";
import dealerReducer from "../modules/dealers/store/dealerSlice";

import userReducer from "../modules/users/store/userSlice";

import accessControlReducer from "../modules/access-control/store/accessControlSlice";
import allocationReducer from "../modules/allocation/store/allocationSlice";
import appointmentReducer from "../modules/appointments/store/appointmentSlice";
import pendingReducer from "../modules/pending/store/pendingSlice";
import cancellationReducer from "../modules/cancellations/store/cancellationSlice";
import closureReducer from "../modules/closures/store/closureSlice";
import verificationReducer from "../modules/verification/store/verificationSlice";
import billingReducer from "../modules/billing/store/billingSlice";
import ledgerReducer from "../modules/ledger/store/ledgerSlice";
import paymentReducer from "../modules/payments/store/paymentSlice";
import reconciliationReducer from "../modules/reconciliation/store/reconciliationSlice";
import dashboardReducer from "../modules/dashboard/store/dashboardSlice";
import reportReducer from "../modules/reports/store/reportSlice";
import notificationReducer from "../modules/notifications/store/notificationSlice";
import auditLogReducer from "../modules/auditLogs/store/auditLogSlice";
import settingsReducer from "../modules/settings/store/settingsSlice";
// import areaReducer from "../modules/areaMaster/store/areaSlice";
import itemReducer from "../modules/itemMaster/store/itemSlice";
import brandReducer from "../modules/brandMaster/store/brandSlice";



export const store = configureStore({
  reducer: {
    // ui: uiReducer,
    auth: authReducer,
    complaints: complaintReducer,
    dealers: dealerReducer,

    users: userReducer,

    accessControl: accessControlReducer,
    allocation: allocationReducer,
    appointments: appointmentReducer,
    pending: pendingReducer,
    cancellations: cancellationReducer,
    closures: closureReducer,
    verification: verificationReducer,
    billing: billingReducer,
    ledger: ledgerReducer,
    payments: paymentReducer,
    reconciliation: reconciliationReducer,
    dashboard: dashboardReducer,
    reports: reportReducer,
    notifications: notificationReducer,
    auditLogs: auditLogReducer,
    settings: settingsReducer,
    // area: areaReducer,
    item: itemReducer,
          brand:
        brandReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
