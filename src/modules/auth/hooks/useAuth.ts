import {
  useCallback,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import {
  loginApi,
} from "../services/authApi";

import {
  clearAuthError,
  loginFailure,
  loginStart,
  loginSuccess,
  logoutSuccess,
} from "../store/authSlice";

import type {
  LoginCredentials,
} from "../types/auth.types";

export function useAuth() {
  const dispatch =
    useAppDispatch();

  const {
    user,
    accessToken,
    isAuthenticated,
    loading,
    error,
  } = useAppSelector(
    (state) => state.auth
  );

  const login = useCallback(
    async (
      credentials: LoginCredentials
    ) => {
      try {
        dispatch(loginStart());

        const response =
          await loginApi(
            credentials
          );

        const {
          user,
          accessToken,
        } = response.data;

        localStorage.setItem(
          "accessToken",
          accessToken
        );

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        dispatch(
          loginSuccess({
            user,
            accessToken,
          })
        );

        return {
          success: true,
        };
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Login failed";

        dispatch(
          loginFailure(message)
        );

        return {
          success: false,
          message,
        };
      }
    },
    [dispatch]
  );

  const logout = useCallback(
    () => {
      localStorage.removeItem(
        "accessToken"
      );

      localStorage.removeItem(
        "user"
      );

      dispatch(
        logoutSuccess()
      );
    },
    [dispatch]
  );

  const clearError =
    useCallback(() => {
      dispatch(
        clearAuthError()
      );
    }, [dispatch]);

  return {
    user,

    accessToken,

    isAuthenticated,

    loading,

    error,

    login,

    logout,

    clearError,
  };
}