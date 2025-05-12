import React, { useEffect, useState } from "react";
import {
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Calendar,
  UserRound,
  Stethoscope,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PacmanLoader from "react-spinners/PacmanLoader";

const UserProfile = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [fetched, setfetched] = useState(null);

  useEffect(() => {
    if (userId) {
      const getUserById = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/getUserById?userId=${userId}`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          const data = await response.json();
          setUser(data.user);
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

  if (fetched === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <PacmanLoader color="#004ba8" radius={6} height={20} width={5} />
        <p className="mt-6 text-gray-700 font-medium animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-100/50 overflow-hidden">
      <div className="py-6 px-6 sm:px-8 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user.username}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Patient ID: {user.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-blue-500" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Roll No.</p>
                <p className="font-medium">{user.rollNo}</p>
              </div>
              <div className="bg-blue-50/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Gender</p>
                <p className="font-medium">{user.gender}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                  <p className="font-medium">{user.mobile}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Alternate Number</p>
                  <p className="font-medium">{user.alt_mobile}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">
                    Academic Program
                  </p>
                  <p className="font-medium">{user.acadProg}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Stethoscope className="h-5 w-5 mr-2 text-blue-500" />
              Medical Information
            </h3>

            <div className="bg-blue-50/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-500">
                  Last Check-up
                </span>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                  Recent
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                <span className="font-medium">May 15, 2024</span>
              </div>
            </div>

            <div className="bg-blue-50/50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 mb-2">
                Health Notes
              </p>
              <p className="text-sm text-gray-700">
                Patient has a history of mild hypertension. Regular follow-ups
                recommended every 3 months. No known allergies to medications.
              </p>
            </div>

            <div className="flex space-x-2 mt-4">
              <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium text-sm hover:bg-blue-600 hover:text-white transition-colors">
                Update Info
              </button>
              <button className="flex-1 px-4 py-2 bg-violet-100 text-violet-700 rounded-lg font-medium text-sm hover:bg-violet-600 hover:text-white transition-colors">
                View Medical Records
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
