import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAppSelector } from "../app/hooks";

/**
 * Access permission needed for each sidebar module (matched by path prefix,
 * longest first). Paths not listed here stay open to every CRM user.
 */
const ROUTE_PERMISSIONS: { path: string; permission: string; exact?: boolean }[] = [
  { path: "/complaints", permission: "complaints.access" },
  { path: "/appointments", permission: "appointments.access" },
  { path: "/verification", permission: "verification.access" },
  { path: "/allocation", permission: "allocation.access", exact: true },
  { path: "/allocation/history", permission: "allocation.access", exact: true },
  { path: "/reason-master", permission: "reason.access" },
  { path: "/users", permission: "users.access" },
  { path: "/roles", permission: "roles.access" },
  { path: "/dealer-activity", permission: "dealers.activity.access" },
  { path: "/dealers", permission: "dealers.access" },
  { path: "/category-master", permission: "category.access" },
  { path: "/brand-master", permission: "brand.access" },
  { path: "/product-type-master", permission: "product_type.access" },
  { path: "/product-master", permission: "product.access" },
  { path: "/state-master", permission: "state.access" },
  { path: "/district-master", permission: "district.access" },
  { path: "/city-master", permission: "city.access" },
  { path: "/pincode-master", permission: "pincode.access" },
  { path: "/area-master", permission: "area.access" },
  { path: "/billing", permission: "billing.access" },
  { path: "/ledger", permission: "ledger.access" },
];

const matches = (pathname: string, rule: { path: string; exact?: boolean }) =>
  rule.exact
    ? pathname === rule.path || pathname === `${rule.path}/`
    : pathname === rule.path || pathname.startsWith(`${rule.path}/`);

/** Extra permission for specific sub-pages (checked in addition to the module access). */
const SUBROUTE_PERMISSIONS: { test: RegExp; permission: string }[] = [
  { test: /^\/dealers\/?$/, permission: "dealers.table" },
  { test: /^\/dealers\/create\/?$/, permission: "dealers.create" },
  { test: /^\/dealers\/[^/]+\/edit\/?$/, permission: "dealers.update" },
  { test: /^\/dealers\/[^/]+\/performance\/?$/, permission: "dealers.performance.view" },
  { test: /^\/dealers\/(?!create)[^/]+\/?$/, permission: "dealers.view" },
  { test: /^\/billing\/?$/, permission: "billing.table" },
  { test: /^\/billing\/[^/]+\/?$/, permission: "billing.view" },
  { test: /^\/ledger\/?$/, permission: "ledger.view" },
  { test: /^\/ledger\/add-entry\/?$/, permission: "ledger.create" },
  { test: /^\/ledger\/transactions\/[^/]+\/?$/, permission: "ledger.transaction.view" },
  { test: /^\/ledger\/(?!add-entry|transactions)[^/]+\/?$/, permission: "ledger.dealer.view" },
  { test: /^\/appointments\/?$/, permission: "appointments.table" },
  { test: /^\/appointments\/calendar\/?$/, permission: "appointments.table" },
  { test: /^\/appointments\/(?!calendar)[^/]+\/?$/, permission: "appointments.view" },
  { test: /^\/pending\/?$/, permission: "pending.table" },
  { test: /^\/cancellations\/?$/, permission: "cancellations.table" },
  { test: /^\/cancellations\/[^/]+\/?$/, permission: "cancellations.view" },
  { test: /^\/closures\/history\/?$/, permission: "closures.table" },
  { test: /^\/complaints\/?$/, permission: "complaints.table" },
  { test: /^\/complaints\/create\/?$/, permission: "complaints.create" },
  { test: /^\/complaints\/[^/]+\/edit\/?$/, permission: "complaints.update" },
  { test: /^\/complaints\/(?!create)[^/]+\/?$/, permission: "complaints.view" },
];

export default function PermissionGuard({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const permissions = useAppSelector((s) => s.auth.user?.role?.permissions) ?? [];

  const rule = [...ROUTE_PERMISSIONS]
    .sort((a, b) => b.path.length - a.path.length)
    .find((r) => matches(pathname, r));

  const sub = SUBROUTE_PERMISSIONS.find((r) => r.test.test(pathname));

  if (
    (!rule || permissions.includes(rule.permission)) &&
    (!sub || permissions.includes(sub.permission))
  ) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto mt-16 max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <ShieldAlert className="mx-auto h-10 w-10 text-red-500" />
      <h2 className="mt-3 text-lg font-semibold text-gray-900">Access denied</h2>
      <p className="mt-1 text-sm text-gray-500">
        You do not have permission to open this page. Please contact your
        administrator.
      </p>
      <Link
        to="/profile"
        className="mt-5 inline-block rounded-lg bg-[#123B7A] px-4 py-2 text-sm font-medium text-white"
      >
        Go to my profile
      </Link>
    </div>
  );
}
