import {
  Plus,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import RoleTable from "../components/RoleTable";

import {
  useRoles,
} from "../hooks/useRoles";

import {
  clearRoleFilters,
  setRoleSearch,
  setRoleStatus,
} from "../store/accessControlSlice";

export default function RoleListPage() {
  const navigate =
    useNavigate();

  const dispatch =
    useAppDispatch();

  const {
    roles,
    loading,
    deleteRole,
  } = useRoles();

  const {
    search,
    status,
  } = useAppSelector(
    (state) =>
      state.accessControl
  );

  const filteredRoles =
    roles.filter((role) => {
      const query =
        search.toLowerCase();

      return (
        (role.name
          .toLowerCase()
          .includes(query) ||
          role.code
            .toLowerCase()
            .includes(
              query
            )) &&
        (status === "ALL" ||
          role.status ===
            status)
      );
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Roles & Permissions
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Control what each
            application role can
            access.
          </p>
        </div>

        <button
          onClick={() =>
            navigate(
              "/roles/create"
            )
          }
          className="inline-flex items-center gap-2 rounded-lg bg-[#123B7A] px-4 py-2.5 text-sm text-white"
        >
          <Plus size={18} />

          Create Role
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 md:flex-row">
        <input
          value={search}
          onChange={(event) =>
            dispatch(
              setRoleSearch(
                event.target.value
              )
            )
          }
          placeholder="Search roles..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        />

        <select
          value={status}
          onChange={(event) =>
            dispatch(
              setRoleStatus(
                event.target
                  .value as
                  | "ACTIVE"
                  | "INACTIVE"
                  | "ALL"
              )
            )
          }
          className="rounded-lg border border-gray-300 px-4"
        >
          <option value="ALL">
            All Status
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="INACTIVE">
            Inactive
          </option>
        </select>

        <button
          onClick={() =>
            dispatch(
              clearRoleFilters()
            )
          }
          className="rounded-lg border px-4 text-sm"
        >
          Reset
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          Loading roles...
        </div>
      ) : (
        <RoleTable
          roles={
            filteredRoles
          }
          onDelete={
            deleteRole
          }
        />
      )}
    </div>
  );
}