import React, { useEffect, useState } from "react";
import {
  User as UserIcon,
  Phone,
  Mail,
  Book,
  PhoneCallIcon,
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

        <div className="mt-8">
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
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0">
                <div className="flex items-center w-full sm:w-1/2">
                  <Mail className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center w-full sm:w-1/2">
                  <Phone className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                    <p className="font-medium">{user.mobile}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0">
                <div className="flex items-center w-full sm:w-1/2">
                  <PhoneCallIcon className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">
                      Alternate Number
                    </p>
                    <p className="font-medium">{user.alt_mobile}</p>
                  </div>
                </div>
                <div className="flex items-center w-full sm:w-1/2">
                  <Book className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">
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
