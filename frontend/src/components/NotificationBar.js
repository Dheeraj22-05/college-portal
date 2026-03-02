import { useEffect, useState } from "react";

const NotificationBar = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchNotification = async () => {
      const res = await fetch("http://localhost:5000/api/notifications/latest");
      const data = await res.json();
      setMessage(data?.message || "Welcome to the portal.");
    };
    fetchNotification();
  }, []);

  return (
    <div className="bg-indigo-50 border-b border-indigo-100 text-indigo-700 text-center py-3 font-medium text-sm tracking-wide">
      {message}
    </div>
  );
};

export default NotificationBar;