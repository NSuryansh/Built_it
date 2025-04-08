import React, { useEffect, useState } from "react";
import { CircleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DoctorNotificationPanel = () => {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate(); // Initialize navigate function

    // Fetch users from API
    const getUsers = async () => {
        try {
            const response = await fetch("http://localhost:3000/getFeelings");
            if (!response.ok) throw new Error("Failed to fetch feelings");
            const data = await response.json();
            // console.log(data, "hello")
            const filteredData = [];
            for (let i = 0; i < data.length; i++) {
                const scores = calculateHappinessScore(data[i]);
                const sum = scores.reduce((acc, curr) => acc + curr, 0) / scores.length;
                // console.log(sum);
                if (sum <= 3) {
                    console.log(data[i].user.id, data[i].user.username)
                    filteredData.push({ userId: data[i].user.id, username: data[i].user.username });
                }
            }
            setNotifications(filteredData);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

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

    useEffect(() => {
        getUsers();
    }, []);

    const handleAccept = (notif) => {
        navigate(`/doctor/peer?userId=${notif.userId}&username=${notif.username}`);
    };

    return (
        <div className="absolute top-14 right-5 w-80 bg-white shadow-xl border rounded-lg p-4 z-50">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
                Care Alerts
            </h2>
            <div className="space-y-3 max-h-80 overflow-auto">
                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <div
                            key={notif.userId}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm"
                        >
                            <div>
                                <p className="font-semibold text-gray-900 text-md">{notif.username}</p>
                                <p className="text-sm text-gray-600">
                                    flagged for potential support.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAccept(notif)}
                                    className="text-red-600 hover:bg-red-100 p-2 rounded-full transition"
                                >
                                    <CircleAlert size={26} />
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

export default DoctorNotificationPanel;
