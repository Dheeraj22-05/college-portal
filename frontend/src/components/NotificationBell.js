import { useEffect, useState, useRef } from "react";
import { authorizedFetch } from "../utils/api";

const NotificationBell = () => {

  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);

  const previousUnreadRef = useRef(0);
  const notificationSoundRef = useRef(null);

  useEffect(() => {

    notificationSoundRef.current = new Audio("/notification.mp3");

    const fetchNotifications = async () => {
      const data = await authorizedFetch("notifications");

      const newUnread = data.filter(n => !n.is_read).length;

      if (newUnread > previousUnreadRef.current) {
        notificationSoundRef.current.play().catch(() => {});
      }

      previousUnreadRef.current = newUnread;
      setNotifications(data);
    };

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);

  }, []);

  const markAsRead = async (id) => {
    await authorizedFetch(`notifications/read/${id}`, "PUT");

    // refresh after marking
    const updated = await authorizedFetch("notifications");
    setNotifications(updated);
    previousUnreadRef.current = updated.filter(n => !n.is_read).length;
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setShow(!show)}
        className="relative text-xl"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {show && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl p-4 max-h-96 overflow-y-auto z-50">
          {notifications.length === 0 && (
            <p className="text-center text-gray-500">
              No notifications
            </p>
          )}

          {notifications.map(n => (
            <div
              key={n.id}
              className={`p-3 mb-2 rounded-lg cursor-pointer ${
                n.is_read
                  ? "bg-gray-100"
                  : "bg-blue-200 animate-pulse"
              }`}
              onClick={() => markAsRead(n.id)}
            >
              <p className="text-sm">{n.message}</p>
              <p className="text-xs text-gray-500">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;