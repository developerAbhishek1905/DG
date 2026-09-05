import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import {
  ComplaintListPage,
  CreateComplaintPage,
  ComplaintDetailsPage,
  EditComplaintPage,
} from "../modules/complaints";
import {
  DealerListPage,
  CreateDealerPage,
  DealerDetailsPage,
  EditDealerPage,
  DealerPerformancePage,
} from "../modules/dealers";
import {
  //   ForgotPasswordPage,
  LoginPage,
  //   ResetPasswordPage,
} from "../modules/auth";
import {
  UserListPage,
  CreateUserPage,
  UserDetailsPage,
  EditUserPage,
} from "../modules/users";
import {
  RoleListPage,
  CreateRolePage,
  RoleDetailsPage,
  EditRolePage,
  PermissionManagementPage,
} from "../modules/access-control";
import {
  AppointmentCalendarPage,
  AppointmentDetailsPage,
  AppointmentListPage,
} from "../modules/appointments";
import { PendingListPage, SLAOverviewPage } from "../modules/pending";
import {
  CancellationDetailsPage,
  CancellationListPage,
} from "../modules/cancellations";
import { ClosurePage, ClosureHistoryPage } from "../modules/closures";
import {
  VerificationDetailsPage,
  VerificationQueuePage,
} from "../modules/verification";
import {
  BillingOverviewPage,
  BillListPage,
  BillDetailsPage,
  RateMasterPage,
} from "../modules/billing";
import {
  DealerLedgerPage,
  LedgerOverviewPage,
  LedgerTransactionPage,
} from "../modules/ledger";
import {
  PaymentListPage,
  PaymentDetailsPage,
  RecordPaymentPage,
} from "../modules/payments";
import {
  ReconciliationPage,
  ReconciliationDetailsPage,
} from "../modules/reconciliation";
import {
  ReportsPage,
  ComplaintReportPage,
  DealerReportPage,
  SLAReportPage,
  CancellationReportPage,
  BillingReportPage,
  PaymentReportPage,
} from "../modules/reports";
import { BrandMasterPage } from "../modules/brandMaster";
import { NotificationCenterPage } from "../modules/notifications";
import { AuditLogPage } from "../modules/auditLogs";
import {
  SettingsPage,
  SLASettingsPage,
  NotificationSettingsPage,
  BillingSettingsPage,
  StatusSettingsPage,
  CancellationReasonPage,
  PendingReasonPage,
  PermissionSettingsPage,
} from "../modules/settings";
import { AreaMasterPage, CreateEditAreaPage } from "../modules/areaMaster";
import { StateMasterPage } from "../modules/stateMaster";
import DistrictMasterPage from "../modules/districtMaster/pages/DistrictMasterPage";
import { CityMasterPage } from "../modules/cityMaster";
import { PincodeMasterPage } from "../modules/pincodeMaster";
import { ProductMasterPage } from "../modules/productMaster";
import { AllocationPage, AllocationHistoryPage } from "../modules/allocation";
import { DashboardPage } from "../modules/dashboard";
import { Navigate } from "react-router-dom";
import {
  CategoryMasterPage,
  CreateEditCategoryPage,
} from "../modules/categoryMaster";
import { ItemMasterPage, CreateEditItemPage } from "../modules/itemMaster";
import { ProductTypeMasterPage } from "../modules/productTypeMaster";

function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
    </div>
  );
}

function Complaints() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        /> */}

        {/* <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        /> */}

        {/* PRIVATE */}

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/complaints" element={<ComplaintListPage />} />
          <Route path="/complaints/create" element={<CreateComplaintPage />} />
          <Route path="/complaints/:id" element={<ComplaintDetailsPage />} />
          <Route path="/complaints/:id/edit" element={<EditComplaintPage />} />
          <Route path="/dealers" element={<DealerListPage />} />
          <Route path="/dealers/create" element={<CreateDealerPage />} />
          <Route path="/dealers/:id" element={<DealerDetailsPage />} />
          <Route path="/dealers/:id/edit" element={<EditDealerPage />} />
          <Route
            path="/dealers/:id/performance"
            element={<DealerPerformancePage />}
          />

          {/* USERS */}

          <Route path="/users" element={<UserListPage />} />
          <Route path="/users/create" element={<CreateUserPage />} />
          <Route path="/users/:id" element={<UserDetailsPage />} />
          <Route path="/users/:id/edit" element={<EditUserPage />} />

          {/* ROLES */}

          <Route path="/roles" element={<RoleListPage />} />
          <Route path="/roles/create" element={<CreateRolePage />} />
          <Route path="/roles/:id" element={<RoleDetailsPage />} />
          <Route path="/roles/:id/edit" element={<EditRolePage />} />
          <Route
            path="/roles/:id/permissions"
            element={<PermissionManagementPage />}
          />

          <Route path="/allocation/:complaintId" element={<AllocationPage />} />
          <Route
            path="/allocation/history"
            element={<AllocationHistoryPage />}
          />

          <Route path="/appointments" element={<AppointmentListPage />} />
          <Route
            path="/appointments/calendar"
            element={<AppointmentCalendarPage />}
          />
          <Route
            path="/appointments/:id"
            element={<AppointmentDetailsPage />}
          />
          <Route path="/pending" element={<PendingListPage />} />
          <Route path="/pending/sla" element={<SLAOverviewPage />} />
          <Route path="/cancellations" element={<CancellationListPage />} />
          <Route
            path="/cancellations/:id"
            element={<CancellationDetailsPage />}
          />
          <Route path="/closures/history" element={<ClosureHistoryPage />} />
          <Route path="/closures/:complaintId" element={<ClosurePage />} />
          <Route path="/verification" element={<VerificationQueuePage />} />
          <Route
            path="/verification/:id"
            element={<VerificationDetailsPage />}
          />
          <Route path="/billing" element={<BillingOverviewPage />} />
          <Route path="/billing/bills" element={<BillListPage />} />
          <Route path="/billing/rates" element={<RateMasterPage />} />
          <Route path="/billing/:id" element={<BillDetailsPage />} />
          <Route path="/ledger" element={<LedgerOverviewPage />} />
          <Route
            path="/ledger/transactions/:id"
            element={<LedgerTransactionPage />}
          />
          <Route path="/ledger/:dealerId" element={<DealerLedgerPage />} />
          <Route path="/payments" element={<PaymentListPage />} />
          <Route path="/payments/record" element={<RecordPaymentPage />} />
          <Route path="/payments/:id" element={<PaymentDetailsPage />} />
          <Route path="/reconciliation" element={<ReconciliationPage />} />
          <Route
            path="/reconciliation/:id"
            element={<ReconciliationDetailsPage />}
          />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/complaints" element={<ComplaintReportPage />} />
          <Route path="/reports/dealers" element={<DealerReportPage />} />
          <Route path="/reports/sla" element={<SLAReportPage />} />
          <Route
            path="/reports/cancellations"
            element={<CancellationReportPage />}
          />
          <Route path="/reports/billing" element={<BillingReportPage />} />
          <Route path="/reports/payments" element={<PaymentReportPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/sla" element={<SLASettingsPage />} />
          <Route
            path="/settings/notifications"
            element={<NotificationSettingsPage />}
          />
          <Route path="/settings/billing" element={<BillingSettingsPage />} />
          <Route path="/settings/statuses" element={<StatusSettingsPage />} />
          <Route
            path="/settings/cancellation-reasons"
            element={<CancellationReasonPage />}
          />
          <Route
            path="/settings/pending-reasons"
            element={<PendingReasonPage />}
          />
          <Route
            path="/settings/permissions"
            element={<PermissionSettingsPage />}
          />
          <Route path="/category-master" element={<CategoryMasterPage />} />
          <Route path="/brand-master" element={<BrandMasterPage />} />
          <Route
            path="/category-master/create"
            element={<CreateEditCategoryPage />}
          />
          <Route
            path="/category-master/:id/edit"
            element={<CreateEditCategoryPage />}
          />
          <Route path="/product-master" element={<ProductMasterPage />} />
          <Route
            path="/product-type-master"
            element={<ProductTypeMasterPage />}
          />
          <Route path="/item-master" element={<ItemMasterPage />} />
          <Route path="/item-master/create" element={<CreateEditItemPage />} />
          <Route
            path="/item-master/:id/edit"
            element={<CreateEditItemPage />}
          />
          {/* <Route
  element={
    <ProtectedRoute
      permission="notification.view"
    />
  }
>
  <Route
    path="/notifications"
    element={
      <NotificationCenterPage />
    }
  />
</Route> */}

          <Route path="/notifications" element={<NotificationCenterPage />} />

          {/* <Route
  element={
    <ProtectedRoute
      permission="audit.view"
    />
  }
>
  <Route
    path="/audit-logs"
    element={
      <AuditLogPage />
    }
  />
</Route> */}

          <Route path="/state-master" element={<StateMasterPage />} />
          <Route path="/district-master" element={<DistrictMasterPage />} />
          <Route path="/pincode-master" element={<PincodeMasterPage />} />
          <Route path="/city-master" element={<CityMasterPage />} />
          <Route path="/audit-logs" element={<AuditLogPage />} />
          <Route path="/area-master" element={<AreaMasterPage />} />
          <Route path="/area-master/create" element={<CreateEditAreaPage />} />
          <Route
            path="/area-master/:id/edit"
            element={<CreateEditAreaPage />}
          />

          {/* <Route path="/allocation" element={<AllocationPage />} />

          <Route
            path="/complaints/:complaintId/allocation"
            element={<AllocationPage />}
          />

          <Route
            path="/allocation/history"
            element={<AllocationHistoryPage />}
          /> */}
        </Route>
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
