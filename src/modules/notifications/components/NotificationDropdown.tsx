import {
  Bell,
  CheckCheck,
  Settings,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks";

import {
  fetchNotifications,
  readAllNotifications,
} from "../store/notificationSlice";

import NotificationBadge from "./NotificationBadge";
import NotificationItem from "./NotificationItem";

export default function NotificationDropdown() {
  const dispatch =
    useAppDispatch();

  const navigate =
    useNavigate();

  const [
    open,
    setOpen,
  ] =
    useState(false);

  const containerRef =
    useRef<HTMLDivElement>(
      null
    );

  const {
    notifications,
    loading,
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

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

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

  const recentNotifications =
    notifications.slice(
      0,
      6
    );

  return (
    <div
      ref={
        containerRef
      }
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setOpen(
            (value) =>
              !value
          )
        }
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
      >
        <Bell
          size={20}
        />

        <NotificationBadge
          count={
            unreadCount
          }
        />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[380px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <div>
              <h3 className="font-semibold text-gray-900">
                Notifications
              </h3>

              <p className="text-xs text-gray-500">
                {unreadCount} unread
              </p>
            </div>

            {unreadCount >
              0 && (
              <button
                type="button"
                onClick={() =>
                  dispatch(
                    readAllNotifications()
                  )
                }
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#123B7A] hover:underline"
              >
                <CheckCheck
                  size={14}
                />

                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[430px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-sm text-gray-500">
                Loading...
              </div>
            ) : recentNotifications.length ===
              0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              recentNotifications.map(
                (
                  notification
                ) => (
                  <NotificationItem
                    key={
                      notification.id
                    }
                    notification={
                      notification
                    }
                    compact
                    onNavigate={() =>
                      setOpen(
                        false
                      )
                    }
                  />
                )
              )
            )}
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
            <button
              type="button"
              onClick={() => {
                setOpen(
                  false
                );

                navigate(
                  "/notifications"
                );
              }}
              className="text-sm font-medium text-[#123B7A] hover:underline"
            >
              View all notifications
            </button>

            <Settings
              size={16}
              className="text-gray-400"
            />
          </div>
        </div>
      )}
    </div>
  );
}