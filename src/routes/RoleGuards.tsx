import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../modules/auth";
import { getHomePath } from "../utils/panelPath";

/** Only dealer users may enter the Dealer Panel. */
export function DealerOnly({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (user?.role?.code !== "DEALER") {
    return <Navigate to={getHomePath(user?.role?.code)} replace />;
  }
  return <>{children}</>;
}

/** Dealer users are kept out of the CRM panel. */
export function CrmOnly({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (user?.role?.code === "DEALER") {
    return <Navigate to={getHomePath("DEALER")} replace />;
  }
  return <>{children}</>;
}

/** Sends logged-in users to the home page of their own panel. */
export function RoleHomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={getHomePath(user?.role?.code)} replace />;
}

/** /dealer/ledger -> /dealer/ledger/<own dealerId> */
export function DealerLedgerRedirect() {
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw: any = user?.dealerId;
  const dealerId =
    (typeof raw === "object" ? raw?._id || raw?.id : raw) || user?.dealer?._id;
  if (!dealerId) return <Navigate to="/dealer/appointments" replace />;
  return <Navigate to={`/dealer/ledger/${dealerId}`} replace />;
}

