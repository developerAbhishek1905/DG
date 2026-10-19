import api from "../../../services/api/axios";

import type {
  Notification,
  NotificationResponse,
} from "../types/notification.types";

/*
|--------------------------------------------------------------------------
| Notifications
|--------------------------------------------------------------------------
|
| Notifications come from the backend (remarks DG "sent to dealer").
| Read / dismissed state is a per-browser convenience kept in localStorage.
|
*/

const READ_KEY = "notifications:read";
const DELETED_KEY = "notifications:deleted";

const loadSet = (key: string): Set<string> => {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(key) || "[]"));
  } catch {
    return new Set<string>();
  }
};

const saveSet = (key: string, value: Set<string>) => {
  try {
    localStorage.setItem(key, JSON.stringify([...value]));
  } catch {
    // storage unavailable - state just won't persist
  }
};

let cache: Notification[] = [];

export async function getNotifications(): Promise<NotificationResponse> {
  const response = await api.get("/appointments/dealer-remarks");

  const read = loadSet(READ_KEY);
  const deleted = loadSet(DELETED_KEY);

  cache = ((response.data?.data || []) as Notification[])
    .filter((item) => !deleted.has(item.id))
    .map((item) => ({ ...item, isRead: read.has(item.id) }));

  return {
    notifications: [...cache],
    total: cache.length,
    unreadCount: cache.filter((item) => !item.isRead).length,
  };
}

export async function markNotificationRead(id: string): Promise<Notification> {
  const read = loadSet(READ_KEY);
  read.add(id);
  saveSet(READ_KEY, read);

  const found = cache.find((item) => item.id === id);

  if (found) found.isRead = true;

  return { ...(found as Notification), isRead: true };
}

export async function markAllNotificationsRead() {
  const read = loadSet(READ_KEY);
  cache.forEach((item) => read.add(item.id));
  saveSet(READ_KEY, read);
  cache = cache.map((item) => ({ ...item, isRead: true }));

  return true;
}

export async function deleteNotification(id: string) {
  const deleted = loadSet(DELETED_KEY);
  deleted.add(id);
  saveSet(DELETED_KEY, deleted);
  cache = cache.filter((item) => item.id !== id);

  return true;
}

export async function clearNotifications() {
  const deleted = loadSet(DELETED_KEY);
  cache.forEach((item) => deleted.add(item.id));
  saveSet(DELETED_KEY, deleted);
  cache = [];

  return true;
}
