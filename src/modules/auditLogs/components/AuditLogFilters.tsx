import {
  RotateCcw,
  Search,
} from "lucide-react";

import {
  useMemo,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import {
  resetAuditFilters,
  setAuditAction,
  setAuditDateFrom,
  setAuditDateTo,
  setAuditModule,
  setAuditSearch,
  setAuditUser,
} from "../store/auditLogSlice";

import type {
  AuditAction,
  AuditModule,
} from "../types/auditLog.types";

const actions: AuditAction[] = [
  "CREATE",
  "UPDATE",
  "DELETE",
  "VIEW",
  "LOGIN",
  "LOGOUT",
  "APPROVE",
  "REJECT",
  "ASSIGN",
  "REASSIGN",
  "VERIFY",
  "CANCEL",
  "PAYMENT",
  "EXPORT",
  "STATUS_CHANGE",
];

const modules: AuditModule[] = [
  "AUTH",
  "COMPLAINTS",
  "DEALERS",
  "ALLOCATION",
  "APPOINTMENTS",
  "PENDING_SLA",
  "CANCELLATIONS",
  "CLOSURES",
  "VERIFICATION",
  "BILLING",
  "LEDGER",
  "PAYMENTS",
  "RECONCILIATION",
  "REPORTS",
  "USERS",
  "ROLES_PERMISSIONS",
  "SETTINGS",
  "SYSTEM",
];

export default function AuditLogFilters() {
  const dispatch =
    useAppDispatch();

  const {
    filters,
    logs,
  } =
    useAppSelector(
      (state) =>
        state?.auditLogs
    );

  const users =
    useMemo(() => {
      const map =
        new Map<
          string,
          string
        >();

      logs.forEach(
        (log) => {
          map.set(
            log.user.id,
            log.user.name
          );
        }
      );

      return Array.from(
        map.entries()
      );
    }, [logs]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">

        {/* SEARCH */}

        <div className="relative md:col-span-2">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={
              filters.search
            }
            onChange={(e) =>
              dispatch(
                setAuditSearch(
                  e.target.value
                )
              )
            }
            placeholder="Search user, entity, description..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#123B7A]"
          />
        </div>

        {/* ACTION */}

        <select
          value={
            filters.action
          }
          onChange={(e) =>
            dispatch(
              setAuditAction(
                e.target
                  .value as
                  | AuditAction
                  | "ALL"
              )
            )
          }
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
        >
          <option value="ALL">
            All Actions
          </option>

          {actions.map(
            (action) => (
              <option
                key={action}
                value={action}
              >
                {action.replaceAll(
                  "_",
                  " "
                )}
              </option>
            )
          )}
        </select>

        {/* MODULE */}

        <select
          value={
            filters.module
          }
          onChange={(e) =>
            dispatch(
              setAuditModule(
                e.target
                  .value as
                  | AuditModule
                  | "ALL"
              )
            )
          }
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
        >
          <option value="ALL">
            All Modules
          </option>

          {modules.map(
            (module) => (
              <option
                key={module}
                value={module}
              >
                {module.replaceAll(
                  "_",
                  " "
                )}
              </option>
            )
          )}
        </select>

        {/* USER */}

        <select
          value={
            filters.userId
          }
          onChange={(e) =>
            dispatch(
              setAuditUser(
                e.target.value
              )
            )
          }
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
        >
          <option value="ALL">
            All Users
          </option>

          {users.map(
            ([id, name]) => (
              <option
                key={id}
                value={id}
              >
                {name}
              </option>
            )
          )}
        </select>

        {/* RESET */}

        <button
          type="button"
          onClick={() =>
            dispatch(
              resetAuditFilters()
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          <RotateCcw
            size={16}
          />

          Reset
        </button>

        {/* DATE FROM */}

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            From Date
          </label>

          <input
            type="date"
            value={
              filters.dateFrom
            }
            onChange={(e) =>
              dispatch(
                setAuditDateFrom(
                  e.target.value
                )
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          />
        </div>

        {/* DATE TO */}

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            To Date
          </label>

          <input
            type="date"
            value={
              filters.dateTo
            }
            onChange={(e) =>
              dispatch(
                setAuditDateTo(
                  e.target.value
                )
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          />
        </div>
      </div>
    </div>
  );
}