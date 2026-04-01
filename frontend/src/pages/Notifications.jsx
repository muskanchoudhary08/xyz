import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  clearNotifications,
} from "../utils/notifications";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = () => {
    setNotifications(getNotifications());
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = (notificationId) => {
    markNotificationAsRead(notificationId);
    loadNotifications();
  };

  const handleClearAll = () => {
    clearNotifications();
    loadNotifications();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>
          <p className="text-slate-500">Stay updated with your latest activity.</p>
        </div>

        <button
          onClick={handleClearAll}
          className="rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Clear All
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm text-slate-600">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.notificationId}
              className={`rounded-2xl border p-4 ${
                notif.isRead ? "bg-white" : "bg-sky-50"
              }`}
            >
              <h2 className="font-semibold text-slate-800">{notif.title}</h2>
              <p className="text-slate-600">{notif.message}</p>
              <p className="mt-1 text-sm text-slate-400">
                {notif.type} • {notif.createdAt}
              </p>

              {!notif.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notif.notificationId)}
                  className="mt-3 rounded-lg bg-sky-500 px-3 py-1 text-white hover:bg-sky-600"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}