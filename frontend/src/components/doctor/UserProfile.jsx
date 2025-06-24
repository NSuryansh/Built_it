import React, { useEffect, useState } from "react";
import {
  User as UserIcon,
  Phone,
  Mail,
  Book,
  PhoneCallIcon,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomToast from "../common/CustomToast";
import CustomLoader from "../common/CustomLoader";

const UserProfile = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [fetched, setfetched] = useState(null);
  const [roomNumber, setRoomNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (userId) {
      const getUserById = async () => {
        try {
          const response = await fetch(
            `https://built-it.onrender.com/api/doc/getUserById?userId=${userId}`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const data = await response.json();
          setUser(data.user);
          setRoomNumber(data.user.roomNo);
          setfetched(true);
        } catch (error) {
          setfetched(false);
          navigate("/doctor/history");
          CustomToast("User not found", "blue");
        }
      };
      getUserById();
    }
  }, [userId, navigate]);

  const handleSaveRoom = async () => {
    if (roomNumber != "") {
      try {
        const response = await fetch(
          `https://built-it.onrender.com/api/doc/changeRoomNo?user_Id=${userId}&roomNo=${roomNumber}`,
          { method: "POST", headers: { Authorization: "Bearer " + token } }
        );
        const data = await response.json();
        CustomToast("Room number updated successfully", "blue");
        setIsSaved(true);
        setIsEditing(false);
      } catch (e) {
        console.error(e);
        CustomToast("Error changing room number", "blue");
        setIsSaved(false);
      }
    } else {
      CustomToast("Provide a room number", "blue");
    }
  };

  if (fetched === null) {
    return <CustomLoader color="blue" text="Loading your dashboard..." />;
  }

  return (
    <div className="bg-[var(--custom-white)] rounded-xl shadow-sm border border-[var(--custom-blue-100)]/50 overflow-hidden">
      <div className="py-6 px-6 sm:px-8 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--custom-gray-900)]">
              {user.username}
            </h2>
            <p className="text-sm text-[var(--custom-gray-500)] mt-1">
              Patient ID: {user.id}
            </p>
          </div>
          <div className="">
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="Room #"
                  className="border border-[var(--custom-gray-300)] rounded px-2 py-1 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-[var(--custom-blue-500)]"
                  autoFocus
                />
                <button
                  onClick={handleSaveRoom}
                  className="bg-[var(--custom-blue-500)] text-[var(--custom-white)] rounded px-3 py-1 text-sm hover:bg-[var(--custom-blue-600)] transition-colors duration-200"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                {roomNumber && (
                  <span className="text-sm text-[var(--custom-gray-700)] mr-2">
                    Room: <span className="font-medium">{roomNumber}</span>
                  </span>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[var(--custom-blue-500)] hover:text-[var(--custom-blue-700)] text-sm"
                >
                  {roomNumber ? "Edit" : "Add Room #"}
                </button>
                {isSaved && (
                  <span className="ml-2 text-[var(--custom-green-500)] text-xs animate-fade-in-out">
                    Saved!
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--custom-gray-900)] mb-4 flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-[var(--custom-blue-500)]" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[var(--custom-blue-50)]/50 rounded-lg p-3">
                <p className="text-xs text-[var(--custom-gray-500)] mb-1">
                  Roll No.
                </p>
                <p className="font-medium">{user.rollNo}</p>
              </div>
              <div className="bg-[var(--custom-blue-50)]/50 rounded-lg p-3">
                <p className="text-xs text-[var(--custom-gray-500)] mb-1">
                  Gender
                </p>
                <p className="font-medium">{user.gender}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0">
                <div className="flex items-center w-full sm:w-1/2">
                  <Mail className="h-5 w-5 text-[var(--custom-blue-500)] mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs text-[var(--custom-gray-500)] mb-0.5">
                      Email
                    </p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center w-full sm:w-1/2">
                  <Phone className="h-5 w-5 text-[var(--custom-blue-500)] mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs text-[var(--custom-gray-500)] mb-0.5">
                      Phone
                    </p>
                    <p className="font-medium">{user.mobile}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0">
                <div className="flex items-center w-full sm:w-1/2">
                  <PhoneCallIcon className="h-5 w-5 text-[var(--custom-blue-500)] mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs text-[var(--custom-gray-500)] mb-0.5">
                      Alternate Number
                    </p>
                    <p className="font-medium">{user.alt_mobile}</p>
                  </div>
                </div>
                <div className="flex items-center w-full sm:w-1/2">
                  <Book className="h-5 w-5 text-[var(--custom-blue-500)] mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs text-[var(--custom-gray-500)] mb-0.5">
                      Academic Program
                    </p>
                    <p className="font-medium">{user.acadProg}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
