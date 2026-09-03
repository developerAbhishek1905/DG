import { useAppSelector } from "../app/hooks";

export const usePermission = () => {
  const permissions = useAppSelector((state) => {
    const role = state.auth.user?.role;
    if (role && typeof role === "object" && "permissions" in role) {
      return (role as { permissions?: string[] }).permissions ?? [];
    }
    return [];
  });

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  return {
    permissions,
    hasPermission,
  };
};