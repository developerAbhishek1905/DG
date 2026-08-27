import {
  BellOff,
} from "lucide-react";

import NotificationItem from "./NotificationItem";

import type {
  Notification,
} from "../types/notification.types";

interface Props {
  notifications: Notification[];

  loading?: boolean;
}

export default function NotificationList({
  notifications,
  loading = false,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <p className="text-sm text-gray-500">
          Loading notifications...
        </p>
      </div>
    );
  }

  if (
    notifications.length ===
    0
  ) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <BellOff
            size={21}
          />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-gray-900">
          No notifications
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          You're all caught up.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {notifications.map(
        (notification) => (
          <NotificationItem
            key={
              notification.id
            }
            notification={
              notification
            }
          />
        )
      )}
    </div>
  );
}