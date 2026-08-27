import {
  Bell,
  CheckCheck,
  Search,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useMemo,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import NotificationList from "../components/NotificationList";

import {
  fetchNotifications,
  readAllNotifications,
  removeAllNotifications,
  setNotificationSearch,
  setNotificationStatus,
  setNotificationType,
} from "../store/notificationSlice";

import type {
  NotificationType,
} from "../types/notification.types";

const types: NotificationType[] =
  [
    "COMPLAINT",
    "ALLOCATION",
    "APPOINTMENT",
    "SLA",
    "CANCELLATION",
    "CLOSURE",
    "VERIFICATION",
    "BILLING",
    "PAYMENT",
    "RECONCILIATION",
    "SYSTEM",
  ];

export default function NotificationCenterPage() {
  const dispatch =
    useAppDispatch();

  const {
    notifications,
    loading,
    filters,
  } =
    useAppSelector(
      (state) =>
        state.notifications
    );

  useEffect(() => {
    if (
      notifications.length ===
      0
    ) {
      dispatch(
        fetchNotifications()
      );
    }
  }, [
    dispatch,
    notifications.length,
  ]);

  const unreadCount =
    useMemo(
      () =>
        notifications.filter(
          (
            notification
          ) =>
            !notification.isRead
        ).length,
      [notifications]
    );

  const filteredNotifications =
    useMemo(() => {
      const search =
        filters.search
          .trim()
          .toLowerCase();

      return notifications.filter(
        (
          notification
        ) => {
          const matchesSearch =
            !search ||
            notification.title
              .toLowerCase()
              .includes(
                search
              ) ||
            notification.message
              .toLowerCase()
              .includes(
                search
              );

          const matchesType =
            filters.type ===
              "ALL" ||
            notification.type ===
              filters.type;

          const matchesStatus =
            filters.status ===
              "ALL" ||
            (filters.status ===
              "READ" &&
              notification.isRead) ||
            (filters.status ===
              "UNREAD" &&
              !notification.isRead);

          return (
            matchesSearch &&
            matchesType &&
            matchesStatus
          );
        }
      );
    }, [
      notifications,
      filters,
    ]);

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#123B7A]">
              <Bell
                size={21}
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Notifications
              </h1>

              <p className="text-sm text-gray-500">
                {unreadCount} unread
                notification
                {unreadCount !==
                1
                  ? "s"
                  : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={
              unreadCount ===
              0
            }
            onClick={() =>
              dispatch(
                readAllNotifications()
              )
            }
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck
              size={16}
            />

            Mark All Read
          </button>

          <button
            type="button"
            disabled={
              notifications.length ===
              0
            }
            onClick={() => {
              const confirmed =
                window.confirm(
                  "Are you sure you want to clear all notifications?"
                );

              if (
                confirmed
              ) {
                dispatch(
                  removeAllNotifications()
                );
              }
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2
              size={16}
            />

            Clear All
          </button>
        </div>
      </div>

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total"
          value={
            notifications.length
          }
        />

        <StatCard
          label="Unread"
          value={
            unreadCount
          }
        />

        <StatCard
          label="Critical"
          value={
            notifications.filter(
              (item) =>
                item.priority ===
                "CRITICAL"
            ).length
          }
        />
      </div>

      {/* FILTERS */}

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={
                filters.search
              }
              onChange={(
                event
              ) =>
                dispatch(
                  setNotificationSearch(
                    event
                      .target
                      .value
                  )
                )
              }
              placeholder="Search notifications..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#123B7A]"
            />
          </div>

          <select
            value={
              filters.type
            }
            onChange={(
              event
            ) =>
              dispatch(
                setNotificationType(
                  event.target
                    .value as
                    | NotificationType
                    | "ALL"
                )
              )
            }
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          >
            <option value="ALL">
              All Types
            </option>

            {types.map(
              (type) => (
                <option
                  key={
                    type
                  }
                  value={
                    type
                  }
                >
                  {type.replaceAll(
                    "_",
                    " "
                  )}
                </option>
              )
            )}
          </select>

          <select
            value={
              filters.status
            }
            onChange={(
              event
            ) =>
              dispatch(
                setNotificationStatus(
                  event.target
                    .value as
                    | "ALL"
                    | "READ"
                    | "UNREAD"
                )
              )
            }
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
          >
            <option value="ALL">
              All Notifications
            </option>

            <option value="UNREAD">
              Unread
            </option>

            <option value="READ">
              Read
            </option>
          </select>
        </div>
      </div>

      {/* RESULT INFO */}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-900">
            {
              filteredNotifications.length
            }
          </span>{" "}
          notification
          {filteredNotifications.length !==
          1
            ? "s"
            : ""}
        </p>
      </div>

      {/* LIST */}

      <NotificationList
        notifications={
          filteredNotifications
        }
        loading={
          loading
        }
      />
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}