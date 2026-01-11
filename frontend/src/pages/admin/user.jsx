import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  Search,
  User,
  GraduationCap,
  ArrowUpDown,
  ChevronDown,
  MessageSquare, // New Icon
  X, // New Icon
  Star, // New Icon
  Calendar, // New Icon
  Loader,
} from "lucide-react";
import AdminNavbar from "../../components/admin/Navbar";
import CustomToast from "../../components/common/CustomToast";
import { checkAuth } from "../../utils/profile";
import SessionExpired from "../../components/common/SessionExpired";
import Footer from "../../components/common/Footer";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../../components/common/CustomLoader";
import { format } from "date-fns";

// --- Components ---

const FeedbackModal = ({ isOpen, onClose, feedbacks, loading, userName }) => {
  if (!isOpen) return null;

  // Question mapping based on your FeedbackPage.jsx
  const questionsMap = {
    question1: "How satisfied are you with the counselling session?",
    question2: "Did the counsellor listen to your concerns effectively?",
    question3: "Was the environment comfortable and convenient?",
    question4: "What did you find most helpful?",
    question5: "Areas for improvement?",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[var(--custom-green-50)]">
          <div>
            <h2 className="text-xl font-bold text-[var(--custom-green-800)]">
              Feedback History
            </h2>
            <p className="text-sm text-[var(--custom-gray-600)]">
              User: <span className="font-semibold">{userName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-red-500 shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader className="animate-spin h-8 w-8 text-[var(--custom-green-600)]" />
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-10">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No feedback submitted by this user yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  {/* Card Header: Doctor & Rating */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-4 border-b border-gray-100 gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        Therapist {fb.doc?.name || "Unknown Doctor"}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(fb.createdAt), "dd MMM yyyy, h:mm a")}
                      </div>
                    </div>
                    <div className="flex items-center bg-[var(--custom-orange-50)] px-3 py-1 rounded-full border border-[var(--custom-orange-100)]">
                      <div className="flex gap-1 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < fb.stars
                                ? "fill-[var(--custom-orange-500)] text-[var(--custom-orange-500)]"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-[var(--custom-orange-700)]">
                        {fb.stars}/5
                      </span>
                    </div>
                  </div>

                  {/* Q&A Section */}
                  <div className="space-y-3">
                    {Object.keys(questionsMap).map((key) => (
                      <div key={key} className="text-sm">
                        <p className="font-semibold text-[var(--custom-green-700)] mb-1">
                          {questionsMap[key]}
                        </p>
                        <p className="text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          {fb[key] || <span className="italic text-gray-400">No answer provided</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Controls = ({
  searchTerm,
  setSearchTerm,
  filterDegree,
  setFilterDegree,
  degrees,
}) => (
  <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-[var(--custom-primary-green-700)] focus:border-transparent transition-all duration-200 hover:border-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <select
            className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-[var(--custom-primary-green-700)] focus:border-transparent transition-all duration-200 hover:border-gray-300 cursor-pointer"
            value={filterDegree}
            onChange={(e) => setFilterDegree(e.target.value)}
          >
            {degrees.map((degree) => (
              <option key={degree} value={degree}>
                {degree === "all" ? "All Degrees" : degree}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute top-4 right-3 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
      </div>
    </div>
  </div>
);

const DesktopLayout = ({ filteredAndSortedUsers, setSortConfig, onViewFeedback }) => {
  const handleSort = () => {
    setSortConfig((current) => ({
      key: "appointmentsCount",
      direction: current.direction === "desc" ? "asc" : "desc",
    }));
  };
  return (
    <div className="hidden md:block p-4">
      <div className="overflow-x-auto rounded-xl bg-[var(--custom-white)]">
        <table className="min-w-full divide-y divide-[var(--custom-gray-100)]">
          <thead className="bg-[var(--custom-gray-50)]">
            <tr>
              {["User", "Degree", "Therapist", "Appointments", "Actions"].map(
                (header, idx) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-sm font-semibold text-[var(--custom-gray-600)] uppercase tracking-wider"
                    onClick={header === "Appointments" ? handleSort : undefined}
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        header === "Appointments"
                          ? "cursor-pointer hover:text-[var(--custom-green-700)]"
                          : ""
                      }`}
                    >
                      {header}
                      {header === "Appointments" && (
                        <ArrowUpDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--custom-gray-100)]">
            {filteredAndSortedUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-[var(--custom-green-50)] transition-all duration-200 group"
              >
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-medium text-[var(--custom-gray-900)] group-hover:text-[var(--custom-green-900)]">
                    {user.username}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm text-[var(--custom-gray-600)]">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--custom-green-100)] text-[var(--custom-green-800)]">
                      {user.acadProg}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm text-[var(--custom-gray-600)] max-w-md truncate">
                    {user.doctors.map((doc) => doc.name).join(", ")}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-semibold text-[var(--custom-green-900)]">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--custom-green-100)]">
                      {user.appointmentCount}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                   <button 
                     onClick={() => onViewFeedback(user)}
                     className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--custom-green-700)] bg-[var(--custom-green-50)] hover:bg-[var(--custom-green-100)] rounded-lg transition-colors border border-[var(--custom-green-200)]"
                   >
                     <MessageSquare className="h-3.5 w-3.5" />
                     Feedback
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MobileLayout = ({ filteredAndSortedUsers, onViewFeedback }) => (
  <div className="space-y-4 p-4 md:hidden">
    {filteredAndSortedUsers.map((user) => (
      <div
        key={user.id}
        className="bg-[var(--custom-white)] rounded-xl shadow-sm border border-[var(--custom-gray-200)] overflow-hidden hover:border-[var(--custom-green-200)] transition-all duration-200"
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-[var(--custom-green-100)] p-2 rounded-full">
                <User className="h-5 w-5 text-[var(--custom-green-700)]" />
              </div>
              <div>
                <h3 className="font-medium text-[var(--custom-gray-900)]">
                  {user.username}
                </h3>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--custom-green-100)] text-[var(--custom-green-800)]">
                    {user.acadProg}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-[var(--custom-green-100)] px-3 py-1 rounded-full">
                <span className="text-sm font-semibold text-[var(--custom-green-900)]">
                  {user.appointmentCount}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--custom-gray-100)] flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-[var(--custom-gray-600)] max-w-[60%]">
              <GraduationCap className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {user.doctors.map((doc) => doc.name).join(", ")}
              </span>
            </div>
            <button 
                onClick={() => onViewFeedback(user)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--custom-green-700)] bg-[var(--custom-green-50)] hover:bg-[var(--custom-green-100)] rounded-lg transition-colors border border-[var(--custom-green-200)]"
            >
                <MessageSquare className="h-3.5 w-3.5" />
                Feedback
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const AdminUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [userCounts, setUserCounts] = useState([]);
  const [filterDegree, setFilterDegree] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "appointmentsCount",
    direction: "desc",
  });
  const navigate = useNavigate();
  const [fetched, setfetched] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = localStorage.getItem("token");

  // Feedback Modal State
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedUserFeedback, setSelectedUserFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState("");

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("admin");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/doc_admin/getUsers",
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        const data = await res.json();
        setUsersData(data);

        const counts = await Promise.all(
          data.map(async (user) => {
            const userId = user.id;
            try {
              const [countRes, doctorRes] = await Promise.all([
                fetch(
                  `http://localhost:3000/api/admin/appointments-count?id=${userId}`,
                  {
                    headers: { Authorization: "Bearer " + token },
                  }
                ),
                fetch(
                  `http://localhost:3000/api/admin/user-doctors?userId=${userId}`,
                  {
                    headers: { Authorization: "Bearer " + token },
                  }
                ),
              ]);

              const countData = await countRes.json();
              const doctorData = await doctorRes.json();
              setfetched(true);
              return {
                userId,
                appointmentCount: countData.count || 0,
                doctors: doctorData.doctors || [],
              };
            } catch (error) {
              console.error(`Failed to fetch data for user ${userId}:`, error);
              CustomToast("Error fetching user", "green");
              setfetched(false);
              return {
                userId,
                appointmentCount: 0,
                doctors: [],
              };
            }
          })
        );

        setUserCounts(counts);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        CustomToast("Error fetching users.", "green");
      }
    };

    fetchData();
  }, []);

  const fetchFeedback = async (user) => {
    setFeedbackLoading(true);
    setSelectedUserName(user.username);
    setFeedbackModalOpen(true);
    
    try {
        const res = await fetch(`http://localhost:3000/api/doc_admin/user-feedback?userId=${user.id}`, {
            headers: { Authorization: "Bearer " + token },
        });
        const data = await res.json();
        if(res.ok) {
            setSelectedUserFeedback(data);
        } else {
            CustomToast("Failed to fetch feedback", "red");
            setSelectedUserFeedback([]);
        }
    } catch (e) {
        console.error(e);
        CustomToast("Error loading feedback", "red");
    } finally {
        setFeedbackLoading(false);
    }
  };

  const degrees = useMemo(
    () => ["all", ...new Set(usersData.map((user) => user.acadProg))],
    [usersData]
  );

  const filteredAndSortedUsers = useMemo(() => {
    return usersData
      .map((user) => {
        const userData = userCounts.find((u) => u.userId === user.id);
        return {
          ...user,
          appointmentCount: userData?.appointmentCount || 0,
          doctors: userData?.doctors || [],
          degree: user.acadProg,
        };
      })
      .filter((user) => {
        const matchesSearch =
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.doctors.some((doc) =>
            doc.name?.toLowerCase().includes(searchTerm.toLowerCase())
          );

        const matchesDegree =
          filterDegree === "all" || user.degree === filterDegree;

        return matchesSearch && matchesDegree;
      })
      .sort((a, b) => {
        if (sortConfig.key === "appointmentsCount") {
          return sortConfig.direction === "desc"
            ? b.appointmentCount - a.appointmentCount
            : a.appointmentCount - b.appointmentCount;
        }
        return 0;
      });
  }, [usersData, userCounts, searchTerm, filterDegree, sortConfig]);

  const handleClosePopup = () => {
    navigate("/admin/login");
  };

  if (isAuthenticated === null || fetched === null) {
    return <CustomLoader color="green" text="Loading your dashboard..." />;
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="green" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--custom-green-50)] to-[var(--custom-green-100)]">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto py-8 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--custom-white)] rounded-3xl shadow-xl overflow-hidden border border-[var(--custom-green-100)]">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[var(--custom-white)] to-[var(--custom-teal-100)] px-5 py-8 md:px-8 md:py-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <svg viewBox="0 0 200 200" className="fill-[var(--custom-white)]">
                <path d="M0 0 L200 200 M200 0 L0 200" strokeWidth="20" />
              </svg>
            </div>
            <div className="flex items-center relative">
              <Users className="h-14 w-14 text-[var(--custom-green-700)] flex-shrink-0" />
              <div className="ml-6">
                <h1 className="text-[var(--custom-green-700)] text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                  Users Overview
                </h1>
                <p className="text-[var(--custom-teal-700)] mt-1 text-lg opacity-90">
                  Administrative Dashboard
                </p>
              </div>
            </div>
          </div>

          <Controls
            filterDegree={filterDegree}
            setFilterDegree={setFilterDegree}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            degrees={degrees}
          />
          <MobileLayout 
            filteredAndSortedUsers={filteredAndSortedUsers} 
            onViewFeedback={fetchFeedback}
          />
          <DesktopLayout
            filteredAndSortedUsers={filteredAndSortedUsers}
            setSortConfig={setSortConfig}
            onViewFeedback={fetchFeedback}
          />
        </div>
      </div>
      
      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        feedbacks={selectedUserFeedback}
        loading={feedbackLoading}
        userName={selectedUserName}
      />
      
      <Footer color="green" />
    </div>
  );
};

export default AdminUser;