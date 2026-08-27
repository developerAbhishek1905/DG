import {
  AlertTriangle,
  BadgeCheck,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  CreditCard,
  FileCheck2,
  FileText,
  Info,
  ReceiptText,
  Store,
  Trash2,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAppDispatch,
} from "../../../app/hooks";

import {
  readNotification,
  removeNotification,
} from "../store/notificationSlice";

import type {
  Notification,
  NotificationType,
} from "../types/notification.types";

interface Props {
  notification: Notification;

  compact?: boolean;

  onNavigate?: () => void;
}

const iconMap: Record<
  NotificationType,
  React.ElementType
> = {
  COMPLAINT:
    FileText,

  ALLOCATION:
    Store,

  APPOINTMENT:
    CalendarDays,

  SLA:
    Clock3,

  CANCELLATION:
    AlertTriangle,

  CLOSURE:
    FileCheck2,

  VERIFICATION:
    BadgeCheck,

  BILLING:
    ReceiptText,

  PAYMENT:
    CreditCard,

  RECONCILIATION:
    CircleDollarSign,

  SYSTEM:
    Info,
};

export default function NotificationItem({
  notification,
  compact = false,
  onNavigate,
}: Props) {
  const dispatch =
    useAppDispatch();

  const navigate =
    useNavigate();

  const Icon =
    iconMap[
      notification.type
    ];

  const handleOpen =
    async () => {
      if (
        !notification.isRead
      ) {
        await dispatch(
          readNotification(
            notification.id
          )
        );
      }

      if (
        notification.actionUrl
      ) {
        navigate(
          notification.actionUrl
        );

        onNavigate?.();
      }
    };

  const handleDelete = (
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    dispatch(
      removeNotification(
        notification.id
      )
    );
  };

  const date =
    new Date(
      notification.createdAt
    );

  return (
    <div
      onClick={
        handleOpen
      }
      className={`group relative cursor-pointer border-b border-gray-100 transition hover:bg-gray-50 ${
        notification.isRead
          ? "bg-white"
          : "bg-blue-50/50"
      } ${
        compact
          ? "px-4 py-3"
          : "px-5 py-4"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex shrink-0 items-center justify-center rounded-lg ${
            compact
              ? "h-9 w-9"
              : "h-10 w-10"
          } ${
            notification.priority ===
            "CRITICAL"
              ? "bg-red-100 text-red-600"
              : notification.priority ===
                "HIGH"
              ? "bg-amber-100 text-amber-600"
              : "bg-blue-50 text-[#123B7A]"
          }`}
        >
          <Icon
            size={
              compact
                ? 17
                : 19
            }
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p
                  className={`text-sm text-gray-900 ${
                    notification.isRead
                      ? "font-medium"
                      : "font-semibold"
                  }`}
                >
                  {
                    notification.title
                  }
                </p>

                {!notification.isRead && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                )}
              </div>

              <p
                className={`mt-1 text-gray-500 ${
                  compact
                    ? "line-clamp-2 text-xs leading-5"
                    : "text-sm leading-5"
                }`}
              >
                {
                  notification.message
                }
              </p>
            </div>

            {!compact && (
              <button
                type="button"
                title="Delete notification"
                onClick={
                  handleDelete
                }
                className="rounded-md p-1.5 text-gray-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
              >
                <Trash2
                  size={15}
                />
              </button>
            )}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              {
                notification.type
              }
            </span>

            <span className="text-gray-300">
              •
            </span>

            <span className="text-[11px] text-gray-400">
              {date.toLocaleString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute:
                    "2-digit",
                }
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}