import React, { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  Search, 
  User, 
  Calendar, 
  FileText, 
  CheckCircle, 
  X,
  Loader
} from "lucide-react";
import DoctorNavbar from "../../components/doctor/Navbar"; // Adjust path if needed
import Footer from "../../components/common/Footer";       // Adjust path if needed
import CustomToast from "../../components/common/CustomToast";
import { checkAuth } from "../../utils/profile";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../../components/common/CustomLoader";

const DoctorEmergency = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [users, setUsers] = useState([]); // List of all students
  const [filteredUsers, setFilteredUsers] = useState([]); // Search results
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form State
  const [dateTime, setDateTime] = useState("");
  const [reason, setReason] = useState("Medical Emergency");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const doctorId = localStorage.getItem("userid");

  // 1. Check Authentication
  useEffect(() => {
    const verify = async () => {
      const auth = await checkAuth("doc");
      setIsAuthenticated(auth);
    };
    verify();
  }, []);

  // 2. Fetch Users (Students) and Set Default Time
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Adjust this URL if your route prefix is different (e.g., /api/admin/getUsers)
        const res = await fetch("http://localhost:3000/api/doc_admin/getUsers", {
          headers: { Authorization: "Bearer " + token },
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        } else {
          console.error("Failed to load users");
        }
      } catch (e) {
        console.error("Error fetching users", e);
      }
    };

    if (isAuthenticated) {
        fetchUsers();
    }
    
    // Set default time to current local time formatted for input
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setDateTime(now.toISOString().slice(0, 16));
  }, [isAuthenticated, token]);

  // 3. Handle User Search
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers([]);
      return;
    }
    const lower = searchQuery.toLowerCase();
    const results = users.filter(
      (u) =>
        u.username?.toLowerCase().includes(lower) ||
        u.email?.toLowerCase().includes(lower) ||
        u.rollNo?.toLowerCase().includes(lower)
    );
    setFilteredUsers(results);
  }, [searchQuery, users]);

  // 4. Submit Function
  const handleBookEmergency = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) {
      CustomToast("Please select a patient from the search bar", "red");
      return;
    }
    if (!dateTime) {
      CustomToast("Please select a date and time", "red");
      return;
    }

    setLoading(true);

    try {
      // Sending request to the backend route you provided
      const res = await fetch("http://localhost:3000/api/doc/emergencyBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          doctorId: parseInt(doctorId),
          dateTime: new Date(dateTime).toISOString(), // Formatting date for backend
          reason: reason,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        CustomToast("Emergency Appointment Booked Successfully!", "green");
        // Reset specific fields
        setSelectedUser(null);
        setSearchQuery("");
        setReason("Medical Emergency");
      } else {
        CustomToast(data.message || "Booking Failed", "red");
      }
    } catch (error) {
      console.error(error);
      CustomToast("Network Error: Ensure server is running", "red");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => navigate("/doctor/login");

  if (isAuthenticated === null) return <CustomLoader text="Loading Emergency Portal..." />;
  if (!isAuthenticated) return <SessionExpired handleClosePopup={handleClosePopup} theme="red" />;

  return (
    <div className="min-h-screen bg-red-50 flex flex-col font-sans">
      <DoctorNavbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-10 p-8 bg-gradient-to-r from-red-600 to-red-700 rounded-3xl shadow-xl text-white">
            <div className="p-4 bg-white/20 rounded-full animate-pulse">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-extrabold tracking-tight">Emergency Booking Portal</h1>
              <p className="text-red-100 mt-2 text-lg">
                Immediate appointment scheduling for urgent, critical, or high-priority cases.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Patient Search */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-red-100 h-full">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center border-b pb-4 border-gray-100">
                  <Search className="w-6 h-6 mr-3 text-red-500" />
                  Find Student
                </h2>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by Name, Email, or Roll No..."
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all text-gray-700 placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 p-1 bg-gray-100 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Search Results */}
                <div className="mt-4 overflow-y-auto max-h-[500px] space-y-2 pr-1 custom-scrollbar">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => {
                          setSelectedUser(user);
                          setSearchQuery(""); // Clear query on selection
                        }}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 group ${
                          selectedUser?.id === user.id 
                            ? "bg-red-50 border-red-500 shadow-sm" 
                            : "border-gray-100 hover:bg-gray-50 hover:border-red-200"
                        }`}
                      >
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg ${
                           selectedUser?.id === user.id ? "bg-red-500 text-white" : "bg-red-100 text-red-600"
                        }`}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-gray-900 truncate group-hover:text-red-600 transition-colors">
                            {user.username}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          {user.rollNo && (
                            <span className="inline-block mt-1 text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {user.rollNo}
                            </span>
                          )}
                        </div>
                        {selectedUser?.id === user.id && (
                          <CheckCircle className="w-6 h-6 text-red-500 ml-auto" />
                        )}
                      </div>
                    ))
                  ) : searchQuery ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 font-medium">No students found.</p>
                        <p className="text-xs text-gray-400 mt-1">Try searching by roll number</p>
                    </div>
                  ) : (
                    <div className="text-center py-12 px-4 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                        <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">Start typing to search for a student</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Booking Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleBookEmergency} className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-t-red-600 h-full flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
                  Appointment Details
                </h2>

                {/* Selected User Display */}
                <div className="mb-8">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Selected Patient
                  </label>
                  {selectedUser ? (
                    <div className="flex items-center gap-5 p-5 bg-gradient-to-r from-red-50 to-white border border-red-200 rounded-2xl relative group">
                      <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center border-4 border-red-100 shadow-sm text-red-600 font-bold text-2xl">
                        {selectedUser.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{selectedUser.username}</h3>
                        <p className="text-gray-600 text-sm">{selectedUser.email}</p>
                        <p className="text-sm font-semibold text-red-600 mt-1">
                          Roll No: {selectedUser.rollNo || "N/A"}
                        </p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setSelectedUser(null)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 bg-white rounded-full p-1 hover:bg-red-50 transition-all"
                        title="Remove selection"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="p-8 border-2 border-dashed border-red-200 rounded-2xl flex flex-col items-center justify-center text-red-400 bg-red-50/50">
                      <AlertTriangle className="w-10 h-10 mb-2 opacity-50" />
                      <p className="font-medium">No patient selected</p>
                      <p className="text-xs opacity-70">Use the search panel on the left</p>
                    </div>
                  )}
                </div>

                {/* Date & Time Input */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Emergency Date & Time
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                    </div>
                    <input
                      type="datetime-local"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all font-medium text-gray-800 bg-gray-50/30"
                      required
                    />
                  </div>
                </div>

                {/* Reason Input */}
                <div className="mb-8 flex-grow">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Reason / Severity
                  </label>
                  <div className="relative h-full group">
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                    </div>
                    <textarea
                      rows="4"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Describe the nature of the emergency..."
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all resize-none text-gray-800 bg-gray-50/30"
                      required
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !selectedUser}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-all transform active:scale-[0.98] ${
                    loading || !selectedUser
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                      : "bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-red-500/40 hover:-translate-y-1"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader className="w-6 h-6 animate-spin" />
                      Processing Booking...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-6 h-6" />
                      Confirm Emergency Appointment
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer color="red" />
    </div>
  );
};

export default DoctorEmergency;