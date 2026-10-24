import type {
  ReactNode,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../modules/auth";
import { getHomePath } from "../utils/panelPath";

interface Props {
  children: ReactNode;
}

export default function PublicRoute({
  children,
}: Props) {
  const {
    isAuthenticated,
    user,
  } = useAuth();

  if (isAuthenticated) {
    return (
      <Navigate
        to={getHomePath(user?.role?.code)}
        replace
      />
    );
  }

  return <>{children}</>;
}