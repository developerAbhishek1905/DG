import {
  RotateCcw,
  Search,
} from "lucide-react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import {
  clearUserFilters,
  setUserRole,
  setUserSearch,
  setUserStatus,
} from "../store/userSlice";

import type {
  Role,
} from "../../access-control/types/accessControl.types";

import type {
  UserStatus,
} from "../types/user.types";

interface Props {
  roles: Role[];
}

export default function UserFilters({
  roles,
}: Props) {
  const dispatch =
    useAppDispatch();

  const {
    search,
    status,
    roleId,
  } = useAppSelector(
    (state) => state.users
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(event) =>
              dispatch(
                setUserSearch(
                  event.target.value
                )
              )
            }
            placeholder="Search name, email or phone..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <select
          value={roleId}
          onChange={(event) =>
            dispatch(
              setUserRole(
                event.target.value
              )
            )
          }
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
        >
          <option value="ALL">
            All Roles
          </option>

          {roles.map((role) => (
            <option
              key={role.id}
              value={role.id}
            >
              {role.name}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(event) =>
            dispatch(
              setUserStatus(
                event.target
                  .value as
                  | UserStatus
                  | "ALL"
              )
            )
          }
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
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

          <option value="SUSPENDED">
            Suspended
          </option>
        </select>

        <button
          onClick={() =>
            dispatch(
              clearUserFilters()
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          <RotateCcw size={16} />

          Reset
        </button>
      </div>
    </div>
  );
}