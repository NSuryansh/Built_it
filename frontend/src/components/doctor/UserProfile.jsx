import React, { useEffect, useState } from "react";
import {
  User as UserIcon,
  Phone,
  Mail,
  Book,
  PhoneCallIcon,
  FileText,
  User,
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
  const [docs, setDocs] = useState(null);
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [referralData, setReferralData] = useState({
    referredTo: "",
    reason: "",
  });

  useEffect(() => {
    if (userId) {
      const getUserById = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/doc/getUserById?userId=${userId}`,
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

  const fetchDoctors = async () => {
    const doc_id = localStorage.getItem("userid");
    console.log(doc_id);
    try {
      const response = await fetch(
        `http://localhost:3000/api/doc/getDocs?doc_id=${doc_id}`,
        { headers: { Authorization: "Bearer " + token } }
      );
      const data = await response.json();
      setDocs(data);
    } catch (error) {
      console.error(error);
      CustomToast("Error while fetching doctors", "blue");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSaveRoom = async () => {
    if (roomNumber != "") {
      try {
        const response = await fetch(
          `http://localhost:3000/api/doc/changeRoomNo?user_Id=${userId}&roomNo=${roomNumber}`,
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

  const handleReferralSubmit = (e) => {
    e.preventDefault();
    if (referralSub()) {
      setShowReferralForm(false);
      setReferralData({ referredTo: "", reason: "" });
      // CustomToast("Referral submitted successfully", "blue");
    }
  };

  const referralSub = async () => {
    const doc_email = localStorage.getItem("user_email");
    try {
      const response = await fetch(
        "http://localhost:3000/api/doc/create-referral",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            roll_no: String(user.rollNo),
            referred_by: doc_email,
            referred_to: referralData.referredTo,
            reason: referralData.reason,
          }),
        }
      );
      const data = await response.json();

      if (data.message === "User with given roll number not found") {
        CustomToast("User with given roll number not found", "blue");
        return false;
      }
      CustomToast("Referral created successfully", "blue");
      await fetch("http://localhost:3000/api/common/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          userType: "doc",
          userid: referralData.referredTo,
          message: "A new referral has been added",
        }),
      });
      return true;
    } catch (err) {
      console.error("Error adding event:", err);
      CustomToast("Internal error while adding referral", "blue");
      return false;
    }
  };

  if (fetched === null) {
    return <CustomLoader color="blue" text="Loading your dashboard..." />;
  }

  return (
    <div className="bg-[var(--custom-white)] rounded-xl shadow-sm border border-[var(--custom-blue-100)]/50 overflow-hidden">
      <div className="py-6 px-3 sm:px-8 sm:py-8">
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
                      Emergency Contact Number
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
        <div className="sm:px-6 md:px-8 lg:px-[60px] pt-6">
          {/* Referral Button */}
          <button
            onClick={() => setShowReferralForm(!showReferralForm)}
            className="mx-auto w-fit flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[var(--custom-blue-500)] to-[var(--custom-blue-700)] text-[var(--custom-white)] rounded-full font-semibold text-sm shadow-md hover:shadow-xl hover:from-[var(--custom-blue-600)] hover:to-[var(--custom-blue-800)] transition-all duration-300 transform hover:scale-105 overflow-hidden"
          >
            <FileText className="w-5 h-5 group-hover:animate-pulse" />
            {showReferralForm ? "Close Referral" : "Create Referral"}
            <div className="absolute inset-0 bg-[var(--custom-blue-600)] opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
          </button>

          {/* Referral Form */}
          {showReferralForm && docs != null && (
            <div className="mt-8 bg-[var(--custom-white)]/90 backdrop-blur-lg p-4 rounded-2xl shadow-2xl border border-[var(--custom-blue-200)]/50 transition-all duration-500 ease-in-out transform animate-slide-in">
              <form onSubmit={handleReferralSubmit} className="space-y-6">
                <div className="space-y-6">
                  {/* Referred By */}
                  <div className="relative">
                    <label className="block text-[var(--custom-gray-700)] font-semibold mb-2 tracking-wide">
                      Referred To
                    </label>
                    <div>
                      <select
                        name="date"
                        value={referralData.referredTo}
                        onChange={(e) =>
                          setReferralData({
                            ...referralData,
                            referredTo: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-[var(--custom-blue-200)] focus:border-[var(--custom-blue-400)] focus:ring-2 focus:ring-[var(--custom-blue-200)] transition-all duration-200 outline-none bg-[var(--custom-white)]"
                        required
                      >
                        <option value="">Select Therapist</option>
                        {docs.map((doc, i) => {
                          return (
                            <option key={i} value={doc.id}>
                              {doc.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="relative">
                    <label className="block text-[var(--custom-gray-700)] font-semibold mb-2 tracking-wide">
                      Reason
                    </label>
                    <textarea
                      value={referralData.reason}
                      onChange={(e) =>
                        setReferralData({
                          ...referralData,
                          reason: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-[var(--custom-gray-50)]/50 border border-[var(--custom-blue-300)] rounded-lg focus:ring-2 focus:ring-[var(--custom-blue-400)] focus:border-[var(--custom-blue-500)] outline-none h-36 resize-none transition-all duration-300 shadow-sm hover:shadow-md"
                      required
                    />
                    <div className="absolute inset-y-0 right-3 top-10 flex items-start pointer-events-none">
                      <FileText className="w-5 h-5 text-[var(--custom-blue-500)] opacity-60" />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="relative w-full bg-gradient-to-r from-[var(--custom-blue-500)] to-[var(--custom-blue-700)] text-[var(--custom-white)] py-3 px-6 rounded-lg font-semibold  overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:from-[var(--custom-blue-600)] hover:to-[var(--custom-blue-800)] group"
                >
                  <span className="relative ">Done</span>
                  <div className="absolute inset-0 bg-[var(--custom-blue-600)] opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-lg"></div>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
