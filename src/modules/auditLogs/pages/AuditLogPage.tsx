import {
  Activity,
  Download,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  useEffect,
  useMemo,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import AuditLogDetails from "../components/AuditLogDetails";
import AuditLogFilters from "../components/AuditLogFilters";
import AuditLogTable from "../components/AuditLogTable";

import {
  fetchAuditLogs,
} from "../store/auditLogSlice";

export default function AuditLogPage() {
  const dispatch =
    useAppDispatch();

  const {
    logs,
    loading,
    filters,
  } =
    useAppSelector(
      (state) =>
        state.auditLogs
    );

  useEffect(() => {
    dispatch(
      fetchAuditLogs()
    );
  }, [dispatch]);

  const filteredLogs =
    useMemo(() => {
      const search =
        filters.search
          .trim()
          .toLowerCase();

      return logs.filter(
        (log) => {
          const matchesSearch =
            !search ||
            log.user.name
              .toLowerCase()
              .includes(search) ||
            log.user.email
              .toLowerCase()
              .includes(search) ||
            log.description
              .toLowerCase()
              .includes(search) ||
            log.entityId
              ?.toLowerCase()
              .includes(
                search
              ) ||
            log.ipAddress
              ?.toLowerCase()
              .includes(
                search
              );

          const matchesAction =
            filters.action ===
              "ALL" ||
            log.action ===
              filters.action;

          const matchesModule =
            filters.module ===
              "ALL" ||
            log.module ===
              filters.module;

          const matchesUser =
            filters.userId ===
              "ALL" ||
            log.user.id ===
              filters.userId;

          const logDate =
            new Date(
              log.createdAt
            );

          let matchesDate =
            true;

          if (
            filters.dateFrom
          ) {
            const from =
              new Date(
                `${filters.dateFrom}T00:00:00`
              );

            if (
              logDate < from
            ) {
              matchesDate =
                false;
            }
          }

          if (
            filters.dateTo
          ) {
            const to =
              new Date(
                `${filters.dateTo}T23:59:59`
              );

            if (
              logDate > to
            ) {
              matchesDate =
                false;
            }
          }

          return (
            matchesSearch &&
            matchesAction &&
            matchesModule &&
            matchesUser &&
            matchesDate
          );
        }
      );
    }, [
      logs,
      filters,
    ]);

  const uniqueUsers =
    new Set(
      logs.map(
        (log) =>
          log.user.id
      )
    ).size;

  const securityEvents =
    logs.filter(
      (log) =>
        log.module ===
          "AUTH" ||
        log.module ===
          "ROLES_PERMISSIONS" ||
        log.module ===
          "USERS"
    ).length;

  const handleExport = () => {
    const headers = [
      "Date",
      "User",
      "Email",
      "Role",
      "Action",
      "Module",
      "Description",
      "Entity",
      "IP Address",
    ];

    const rows =
      filteredLogs.map(
        (log) => [
          log.createdAt,
          log.user.name,
          log.user.email,
          log.user.role,
          log.action,
          log.module,
          log.description,
          log.entityId ??
            "",
          log.ipAddress ??
            "",
        ]
      );

    const escape =
      (value: unknown) =>
        `"${String(
          value ?? ""
        ).replaceAll(
          '"',
          '""'
        )}"`;

    const csv = [
      headers
        .map(escape)
        .join(","),

      ...rows.map(
        (row) =>
          row
            .map(escape)
            .join(",")
      ),
    ].join("\n");

    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      "audit-logs.csv";

    link.click();

    URL.revokeObjectURL(
      url
    );
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#123B7A]">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Audit Logs
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Track system activities,
            user actions and important
            changes across the
            application.
          </p>
        </div>

        <button
          type="button"
          onClick={
            handleExport
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Download
            size={16}
          />

          Export Logs
        </button>
      </div>

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          icon={<Activity />}
          label="Total Activities"
          value={logs.length}
        />

        <StatCard
          icon={<Users />}
          label="Active Users"
          value={uniqueUsers}
        />

        <StatCard
          icon={<ShieldCheck />}
          label="Security Events"
          value={
            securityEvents
          }
        />

        <StatCard
          icon={<Activity />}
          label="Filtered Results"
          value={
            filteredLogs.length
          }
        />
      </div>

      {/* FILTERS */}

      <AuditLogFilters />

      {/* RESULT */}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {
              filteredLogs.length
            }
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900">
            {logs.length}
          </span>{" "}
          activities
        </p>
      </div>

      {/* TABLE */}

      <AuditLogTable
        logs={
          filteredLogs
        }
        loading={
          loading
        }
      />

      {/* DETAILS DRAWER */}

      <AuditLogDetails />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#123B7A]">
          {icon}
        </div>
      </div>
    </div>
  );
}