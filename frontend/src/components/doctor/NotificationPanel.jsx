import React, { useEffect, useState } from "react";
import { CircleAlert } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CustomToast from "../common/CustomToast";

const DoctorNotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const [chats, setChats] = useState();
  const [referrals, setreferrals] = useState([]);
  const docId = localStorage.getItem("userid");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getchats = async () => {
      if (docId) {
        try {
          const response = await fetch(
            `https://built-it.onrender.com/user_doc/chatContacts?userId=${docId}`,
            { headers: { Authorization: "Bearer " + token } }
          );
          const contacts = await response.json();
          setChats(contacts);
        } catch (error) {
          console.error("Error fetching contacts:", error);
          CustomToast("Error while fetching data", "blue");
          return [];
        }
      }
    };
    getchats();
  }, [docId]);

  useEffect(() => {
    const getUsers = async () => {
      if (chats) {
        try {
          const response = await fetch(
            "https://built-it.onrender.com/doc/getFeelings",
            {
              headers: { Authorization: "Bearer " + token },
            }
          );
          if (!response.ok) throw new Error("Failed to fetch feelings");
          const data = await response.json();
          // console.log(data, "hello")
          const filteredData = [];
          console.log(data);
          for (let i = 0; i < data.length; i++) {
            const scores = calculateHappinessScore(data[i]);
            const sum =
              scores.reduce((acc, curr) => acc + curr, 0) / scores.length;
            // console.log(sum);
            if (sum <= 3) {
              console.log(data[i].user.id, data[i].user.username);
              if (chats.map((chat) => chat.id).includes(data[i].user.id)) {
                filteredData.push({
                  userId: data[i].user.id,
                  username: data[i].user.username,
                  inChat: "Yes",
                });
              } else {
                filteredData.push({
                  userId: data[i].user.id,
                  username: data[i].user.username,
                  inChat: "No",
                });
              }
            }
          }
          setNotifications(filteredData);
        } catch (error) {
          console.error("Error fetching users:", error);
          CustomToast("Error fetching users", "blue");
        }
      }
    };
    getUsers();
  }, [chats]);

  useEffect(() => {
    const getReferrals = async () => {
      try {
        const response = await fetch(
          `https://built-it.onrender.com/doc/get-referrals?doctor_id=${docId}`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch referrals");
        const data = await response.json();
        console.log(data);
        setreferrals(data.referrals);
      } catch (error) {
        console.error("Error fetching users:", error);
        CustomToast("Error fetching users", "blue");
      }
    };
    getReferrals();
  }, []);

  const calculateHappinessScore = (record) => {
    let scores = [];
    const stress = record.less_stress_score;
    const sleep = record.sleep_quality;
    const acad = record.passion;
    const mental = record.mental_peace;
    if (stress != 11) scores.push(stress);
    if (sleep != 11) scores.push(sleep);
    if (acad != 11) scores.push(acad);
    if (mental != 11) scores.push(mental);

    return scores;
  };

  const handleAccept = async (notif) => {
    navigate(`/doctor/peer?userId=${notif.userId}&username=${notif.username}`);
  };

  return (
    <div className="absolute top-14 right-5 w-80 bg-[var(--custom-white)] shadow-xl border rounded-lg p-4 z-50">
      <ToastContainer />
      {referrals.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-auto">
          <h2 className="text-sm font-semibold text-[var(--custom-gray-800)] mb-2">
            Referrals
          </h2>
          {referrals.map((referral) => (
            <div
              key={referral.id}
              className="flex justify-between items-center p-3 bg-[var(--custom-gray-50)] rounded-lg shadow-sm"
            >
              <div>
                <p className="font-semibold text-[var(--custom-gray-900)] text-md">
                  {referral.username}
                </p>
                <p className="text-sm text-[var(--custom-gray-600)]">
                  {referral.referred_by} has referred them beacuse of{" "}
                  {referral.reason}
                </p>
                <div className="flex gap-2">
                  {referral.inChat === "Yes" ? (
                    <div className="text-[var(--custom-green-600)] hover:bg-[var(--custom-green-100)] px-2 p-1 rounded-full transition">
                      Chat
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAccept(referral)}
                      className="text-[var(--custom-red-600)] hover:bg-[var(--custom-red-100)] px-2 p-1 rounded-full transition"
                    >
                      Chat
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {notifications.length > 0 ? (
        <div className="space-y-3 max-h-80 mt-4 overflow-auto">
          <h2 className="text-sm font-semibold text-[var(--custom-gray-800)] mb-2">
            Care Alerts
          </h2>
          {notifications.map((notif) => (
            <div
              key={notif.userId}
              className="flex justify-between items-center p-3 bg-[var(--custom-gray-50)] rounded-lg shadow-sm"
            >
              <div>
                <p className="font-semibold text-[var(--custom-gray-900)] text-md">
                  {notif.username}
                </p>
                <p className="text-sm text-[var(--custom-gray-600)]">
                  {notif.inChat === "Yes"
                    ? "Already in chat flagged for potential support."
                    : "Not in chat flagged for potential support."}
                </p>
                <div className="flex gap-2">
                  {notif.inChat === "Yes" ? (
                    <div className="text-[var(--custom-green-600)] hover:bg-[var(--custom-green-100)] px-2 p-1 rounded-full transition">
                      Chat
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAccept(notif)}
                      className="text-[var(--custom-red-600)] hover:bg-[var(--custom-red-100)] px-2 p-1 rounded-full transition"
                    >
                      Chat
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {notifications.length === 0 && referrals.length === 0 ? (
        <p className="text-sm text-[var(--custom-gray-500)]">
          No new notifications
        </p>
      ) : null}
    </div>
  );
};

export default DoctorNotificationPanel;
