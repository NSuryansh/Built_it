import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate(); // Initialize navigate function

  // Fetch users from API
  const getUsers = async () => {
    try {
      const response = await fetch(
        "https://built-it-xjiq.onrender.com/getUsers"
      ); // Adjust endpoint if needed
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleAccept = (notif) => {
    navigate(`/peer?userId=${notif.id}&username=${notif.username}`);
  };

  return (
    <div className="absolute top-14 right-5 w-80 bg-white shadow-xl border rounded-lg p-4 z-50">
      <h2 className="text-sm font-semibold text-gray-800 mb-2">
        Notifications
      </h2>
      <div className="space-y-3 max-h-80 overflow-auto">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm"
            >
              <div>
                <p className="text-sm text-gray-600">
                  Do you want to chat with
                </p>
                <p className="font-semibold text-gray-900">{notif.username}?</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(notif)}
                  className="text-green-600 hover:bg-green-100 p-2 rounded-full transition"
                >
                  <Check size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No new notifications</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
