import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {format} from "date-fns";
import { ToastContainer } from "react-toastify";
import CustomToast from "./CustomToast";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate(); // Initialize navigate function
  const userId = localStorage.getItem("userid");

  const getRequests = async () => {
    try {
      const response = await fetch(`http://localhost:3000/getRequests?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch appointment requests");
      const data = await response.json();
      setNotifications(data);
      console.log(userId,data);

    }
    catch(error){
      console.error(error);
    }
  };

  const confirmAppointment = async (notif) => {
    try {
      const res = await fetch(`http://localhost:3000/accept-booking-by-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          doctorId: notif.doctor_id,
          dateTime: notif.dateTime,
          reason: notif.reason,
          id: notif.id
        }),
      });

      if (res.ok) {
        CustomToast("Appointment Confirmed!");
        setTimeout(()=>{
          location.reload();
        },5000);
      } else {
        console.error("Failed to confirm appointment");
      }
    } catch (error) {
      console.error("Error confirming appointment:", error);
    }
  };
  useEffect(() => {
    console.log("hi", notifications)
  }, [notifications])
  
  useEffect(() => {
    getRequests();
  }, []);

  return (
    <div className="absolute top-14 right-5 w-80 bg-white shadow-xl border rounded-lg p-4 z-50">
      <ToastContainer/>
      <h2 className="text-sm font-semibold text-gray-800 mb-2">
        Appointment Requests
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
                {format(new Date(notif.dateTime), "dd MMMM   hh:mm a")}
                </p>
                <p className="font-semibold text-gray-900">Dr. {notif.doctor.name}?</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => confirmAppointment(notif)}
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
