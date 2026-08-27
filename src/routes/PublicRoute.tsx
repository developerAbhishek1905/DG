import type {
  ReactNode,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../modules/auth";

interface Props {
  children: ReactNode;
}

export default function PublicRoute({
  children,
}: Props) {
  const {
    isAuthenticated,
  } = useAuth();

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <>{children}</>;
}