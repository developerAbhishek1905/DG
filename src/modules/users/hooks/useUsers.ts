import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  AppUser,
} from "../types/user.types";

import {
  deleteUser,
  getUserById,
  getUsers,
} from "../services/userApi";

export function useUsers() {
  const [users, setUsers] =
    useState<AppUser[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadUsers =
    useCallback(async () => {
      try {
        setLoading(true);

        setError(null);

        const data =
          await getUsers();

        setUsers(data);
      } catch {
        setError(
          "Unable to load users."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const removeUser = async (
    id: string
  ) => {
    const success =
      await deleteUser(id);

    if (success) {
      setUsers((current) =>
        current.filter(
          (user) =>
            user.id !== id
        )
      );
    }

    return success;
  };

  return {
    users,
    loading,
    error,

    refetch: loadUsers,

    deleteUser: removeUser,
  };
}

export function useUserDetails(
  id?: string
) {
  const [user, setUser] =
    useState<AppUser | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const loadUser =
      async () => {
        try {
          setLoading(true);

          const data =
            await getUserById(id);

          setUser(
            data ?? null
          );
        } finally {
          setLoading(false);
        }
      };

    loadUser();
  }, [id]);

  return {
    user,
    loading,
  };
}