export { default as RoleListPage } from "./pages/RoleListPage";

export { default as CreateRolePage } from "./pages/CreateRolePage";

export { default as EditRolePage } from "./pages/EditRolePage";

export { default as RoleDetailsPage } from "./pages/RoleDetailsPage";

export { default as PermissionManagementPage } from "./pages/PermissionManagementPage";

export {
  useRoles,
  useRoleDetails,
} from "./hooks/useRoles";

export {
  PERMISSIONS,
  PERMISSION_LIST,
} from "./constants/permission.constants";

export type {
  Role,
  RoleFormData,
  Permission,
  RoleStatus,
  DataScope,
} from "./types/accessControl.types";