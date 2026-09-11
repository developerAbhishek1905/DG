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
    token,
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

          console.log(response)

        const {
          user,
          token,
        } = response.data;

        localStorage.setItem(
          "token",
          token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        dispatch(
          loginSuccess({
            user,
            token,
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
        "token"
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

    token,

    isAuthenticated,

    loading,

    error,

    login,

    logout,

    clearError,
  };
}