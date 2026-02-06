import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ToastContainer } from "react-toastify";
import CustomToast from "../common/CustomToast";
import { TimeChange } from "../common/TimeChange";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate(); 
  const userId = Number(localStorage.getItem("userid"));
  const token = localStorage.getItem("token");
  const [loadingId, setLoadingId] = useState(null);
  const deleteRequest = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/user/deleteRequest?id=${id}&userId=${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token },
        }
      );
      if (!response.ok) throw new Error("Failed to delete requests");
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  const getRequests = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/user/getRequests?userId=${userId}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch appointment requests");
      const data = await response.json();
      const now = new Date();
      let notifs = [];
      data.forEach((request) => {
        if (new Date(request.dateTime) > now) {
          notifs.push(request);
        } else {
          deleteRequest(request.id);
        }
      });
      setNotifications(notifs);
    } catch (error) {
      console.error(error);
    }
  };

    const confirmAppointment = async (notif) => {
    try {
      setLoadingId(notif.id);
      const isoDate = new Date(adjustedMs).toISOString();

      const payload = {
        userId: userId, 
        doctorId: notif.doctor_id, 
        dateTime: isoDate,
        reason: notif.reason,
        id: notif.id,
      };

      const res = await fetch(`http://localhost:3000/api/user/accept-booking-by-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(payload),
      });

      const resBody = await res.json().catch(() => ({}));

      if (res.ok) {
        CustomToast("Appointment Confirmed!");
        await fetch("http://localhost:3000/api/common/send-notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            userType: "doc",
            userid: userId,
            message: "User accepted the appointment!",
          }),
        });
        getRequests();
      } else {
        console.error("Failed to confirm appointment:", res.status, resBody);
        CustomToast("Failed to confirm appointment: " + (resBody.message || res.status));
      }
    } catch (error) {
      console.error("Error confirming appointment:", error);
      CustomToast("Error confirming appointment");
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <div className="absolute top-14 right-5 w-80 bg-[var(--custom-white)] shadow-xl border-2 border-[var(--custom-orange-100)] rounded-lg p-4 z-50">
      <ToastContainer />
      <h2 className="text-sm font-semibold text-[var(--custom-gray-800)] mb-2">
        Appointment Requests
      </h2>
      <div className="space-y-3 max-h-80 overflow-auto">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="flex justify-between items-center p-3 bg-[var(--custom-gray-50)] rounded-lg shadow-sm"
            >
              <div>
                <p className="text-sm text-[var(--custom-gray-600)]">
                  {format(
                    (new Date(notif.dateTime).getTime()),
                    "dd MMMM   hh:mm a"
                  )}
                </p>
                <p className="font-semibold text-[var(--custom-gray-900)]">
                  Therapist {notif.doctor.name}?
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => confirmAppointment(notif)}
                  className="text-[var(--custom-green-600)] hover:bg-[var(--custom-green-100)] p-2 rounded-full transition"
                >
                  <Check size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-[var(--custom-gray-500)]">
            No new notifications
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
