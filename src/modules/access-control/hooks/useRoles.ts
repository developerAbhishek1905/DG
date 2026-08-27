import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  deleteRole,
  getPermissions,
  getRoleById,
  getRoles,
} from "../services/accessControlApi";

import type {
  Permission,
  Role,
} from "../types/accessControl.types";

export function useRoles() {
  const [roles, setRoles] =
    useState<Role[]>([]);

  const [
    permissions,
    setPermissions,
  ] =
    useState<
      Permission[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  const loadData =
    useCallback(async () => {
      try {
        setLoading(true);

        const [
          roleData,
          permissionData,
        ] =
          await Promise.all([
            getRoles(),
            getPermissions(),
          ]);

        setRoles(roleData);

        setPermissions(
          permissionData
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const removeRole =
    async (
      id: string
    ) => {
      const success =
        await deleteRole(id);

      if (success) {
        setRoles(
          (current) =>
            current.filter(
              (role) =>
                role.id !== id
            )
        );
      }

      return success;
    };

  return {
    roles,
    permissions,
    loading,

    refetch: loadData,

    deleteRole:
      removeRole,
  };
}

export function useRoleDetails(
  id?: string
) {
  const [role, setRole] =
    useState<Role | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const loadRole =
      async () => {
        try {
          setLoading(true);

          const data =
            await getRoleById(
              id
            );

          setRole(
            data ?? null
          );
        } finally {
          setLoading(false);
        }
      };

    loadRole();
  }, [id]);

  return {
    role,
    loading,
  };
}