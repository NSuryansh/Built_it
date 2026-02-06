import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  Briefcase,
  GraduationCap,
  ArrowLeft,
  Clock,
  AlignCenterVertical as Certificate,
  FileText,
  StarIcon,
  UserX,
  Calendar,
  CalendarCog,
  Edit2,
  Check,
  X
} from "lucide-react";
import AdminNavbar from "../../components/admin/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CustomToast from "../../components/common/CustomToast";
import { checkAuth } from "../../utils/profile";
import SessionExpired from "../../components/common/SessionExpired";
import CustomLoader from "../../components/common/CustomLoader";
import { format } from "date-fns";

const AdminDoctorProfile = () => {
  const search = useLocation().search;
  const navigate = useNavigate();
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [referralData, setReferralData] = useState({
    rollNo: "",
    referredBy: "",
    reason: "",
  });
  const [fetched, setfetched] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [doctor, setDoctor] = useState({
    name: "",
    field: "",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
    contact: {
      email: "",
      phone: "",
      address: "",
    },
    experience: "",
    education: [],
    certifications: [],
    weekOffs: [],
    avgRating: 0,
  });
  const token = localStorage.getItem("token");
  const [leave, setLeave] = useState(null);
  const [leaves, setLeaves] = useState(null);
  const [isEditingWeekOffs, setIsEditingWeekOffs] = useState(false);
  const [tempWeekOffs, setTempWeekOffs] = useState(doctor.weekOffs);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleWeekOffToggle = (day) => {
    setTempWeekOffs((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const saveWeekOffs = () => {
    // Logic to update backend here
    doctor.weekOffs = tempWeekOffs;
    setIsEditingWeekOffs(false);
  };

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
        const doctorId = search.split("=")[1];
        const response = await fetch(
          `http://localhost:3000/api/common/getDoc?docId=${doctorId}`,
          {
            headers: { Authorization: "Bearer " + token },
          },
        );
        const data = await response.json();
        let certifications = [];
        data.certifications.map((certification) => {
          certifications.push(certification.certification);
        });
        if (certifications.length === 0) {
          certifications = ["None"];
        }
        let educations = [];
        data.education.map((education) => {
          educations.push(education.education);
        });
        if (educations.length === 0) {
          educations = ["None"];
        }
        setDoctor({
          ...doctor,
          name: data.doctor.name,
          contact: {
            email: data.doctor.email,
            phone: data.doctor.mobile,
            address: data.doctor.address,
            office_address: data.doctor.office_address,
          },
          experience:
            data.doctor.experience != null
              ? data.doctor.experience.split(" ")[0]
              : "",
          field: data.doctor.desc,
          certifications: certifications,
          education: educations,
          weekOffs: data.doctor.weekOff,
          avgRating: data.doctor.avgRating,
        });
        setProfileImage(data.doctor.img);
        setfetched(true);
      } catch (e) {
        console.error(e);
        CustomToast("Error fetching Therapist details", "green");
        setfetched(false);
      }
    };
    fetchData();
  }, []);

  const fetchLeave = async () => {
    const doctorId = search.split("=")[1];
    if (!doctorId) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/doc_admin/latestLeave?doc_id=${doctorId}`,
        { headers: { Authorization: "Bearer " + token } },
      );
      const data = await response.json();
      setLeave(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching leave details:", error);
      CustomToast("Error leave details", "green");
    }
  };

  useEffect(() => {
    fetchLeave();
  }, []);

  const fetchLeaves = async () => {
    const docId = search.split("=")[1];
    if (!docId) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/doc_admin/leaves?doc_id=${docId}`,
        {
          headers: { Authorization: "Bearer " + token },
        },
      );
      const data = await response.json();
      console.log(data);
      setLeaves(data);
    } catch (error) {
      console.error(error);
      CustomToast("Error in fetching leaves", "blue");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleClosePopup = () => {
    navigate("/admin/login");
  };

  const handleReferralSubmit = (e) => {
    e.preventDefault();
    if (referralSub()) {
      setShowReferralForm(false);
      setReferralData({ rollNo: "", referredBy: "", reason: "" });
      // CustomToast("Referral submitted successfully", "green");
    }
  };

  const referralSub = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/referrals",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            roll_no: String(referralData.rollNo),
            doctor_id: search.split("=")[1],
            referred_by: referralData.referredBy,
            reason: referralData.reason,
          }),
        },
      );
      const data = await response.json();

      if (data.message === "User with given roll number not found") {
        CustomToast("User with given roll number not found", "green");
        return false;
      }
      CustomToast("Referral created successfully", "green");
      await fetch("http://localhost:3000/api/common/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          userType: "doc",
          userid: Number(search.split("=")[1]),
          message: "A new referral has been added",
        }),
      });
      return true;
    } catch (err) {
      console.error("Error adding event:", err);
      CustomToast("Internal error while adding referral", "green");
      return false;
    }
  };

  const calculateLeaveDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isAuthenticated === null || fetched === null) {
    return <CustomLoader color="green" text="Loading your dashboard..." />;
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="green" />;
  }

  return (
    <div className="min-h-screen bg-green-50">
      <AdminNavbar />
      <ToastContainer />

      <main className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        {/* Back Button - Simplified */}
        <Link
          to="/admin/doctor_list"
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-white border border-green-200 rounded-lg hover:bg-green-50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-green-200 overflow-hidden">
          {/* Header Section - Toned Down */}
          <div className="bg-green-900 p-8 md:p-12 relative">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-8">
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-24 h-24 lg:w-28 lg:h-28 rounded-full border-4 border-green-800 object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-green-800 flex items-center justify-center border-2 border-green-700">
                    <User className="w-12 h-12 text-green-500" />
                  </div>
                )}
              </div>

              <div className="text-center sm:text-left mt-4 sm:mt-0">
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  {doctor.name}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <span className="text-green-400 font-medium">
                    {doctor.field}
                  </span>
                  <span className="text-green-600">|</span>
                  <div className="flex items-center text-yellow-500">
                    <span className="text-sm font-bold mr-1">
                      {doctor.avgRating != 0.0
                        ? parseFloat(doctor.avgRating).toPrecision(2)
                        : "N/A"}
                    </span>
                    <StarIcon size={14} fill="currentColor" />
                  </div>
                </div>
                {leave && leave.length > 0 && (
                  <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                    <UserX className="h-3 w-3 mr-1.5" />
                    On Leave until{" "}
                    {format(new Date(leave[0].date_end), "dd MMM")}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-green-100">
            {/* Left & Middle Column (Main Info) */}
            <div className="lg:col-span-2 p-6 md:p-10 space-y-10">
              {/* Contact Info */}
              <section>
                <div className="flex items-center gap-2 mb-6 text-green-800">
                  <User className="w-5 h-5 text-indigo-500" />
                  <h2 className="text-lg font-bold">Contact Details</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Mail, label: doctor.contact.email },
                    { icon: Phone, label: doctor.contact.phone },
                    { icon: MapPin, label: doctor.contact.address },
                    { icon: MapPin, label: doctor.contact.office_address },
                  ].map((info, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl bg-green-50 border border-green-100"
                    >
                      <info.icon className="w-4 h-4 mt-1 text-green-400" />
                      <span className="text-sm text-green-600 break-all">
                        {info.label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section>
                <div className="flex items-center gap-2 mb-6 text-green-800">
                  <GraduationCap className="w-5 h-5 text-indigo-500" />
                  <h2 className="text-lg font-bold">
                    Education & Qualifications
                  </h2>
                </div>
                <div className="space-y-2">
                  {doctor.education.map((edu, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 text-sm text-green-600 bg-white border border-green-100 rounded-lg"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                      {edu}
                    </div>
                  ))}
                </div>
              </section>

              {/* Week Offs Section - EDITABLE */}
              <section className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-indigo-900">
                    <CalendarCog className="w-5 h-5" />
                    <h2 className="text-lg font-bold">Weekly Offs</h2>
                  </div>
                  {!isEditingWeekOffs ? (
                    <button
                      onClick={() => setIsEditingWeekOffs(true)}
                      className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={saveWeekOffs}
                        className="p-1.5 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingWeekOffs(false);
                          setTempWeekOffs(doctor.weekOffs);
                        }}
                        className="p-1.5 bg-green-200 text-green-600 rounded-md hover:bg-green-300"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {isEditingWeekOffs ? (
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day}
                        onClick={() => handleWeekOffToggle(day)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          tempWeekOffs.includes(day)
                            ? "bg-indigo-600 text-white"
                            : "bg-white text-green-500 border border-green-200"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {doctor.weekOffs.map((day, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white border border-indigo-200 text-indigo-700 rounded-full text-xs font-semibold shadow-sm"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Right Column (Experience & Certificates) */}
            <div className="p-6 md:p-10 bg-green-50/50 space-y-10">
              <section>
                <div className="flex items-center gap-2 mb-6 text-green-800">
                  <Briefcase className="w-5 h-5 text-indigo-500" />
                  <h2 className="text-lg font-bold">Experience</h2>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-green-200 shadow-sm text-center">
                  <div className="text-4xl font-black text-indigo-600">
                    {doctor.experience}
                  </div>
                  <div className="text-xs font-bold text-green-400 uppercase tracking-widest mt-1">
                    Years Practice
                  </div>
                  <div className="mt-4 pt-4 border-t border-green-50 flex items-center justify-center gap-2 text-green-500 text-xs">
                    <Clock size={14} /> Practicing since{" "}
                    {new Date().getFullYear() - parseInt(doctor.experience)}
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-6 text-green-800">
                  <Award className="w-5 h-5 text-indigo-500" />
                  <h2 className="text-lg font-bold">Certifications</h2>
                </div>
                <div className="space-y-3">
                  {doctor.certifications.map((cert, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 text-sm text-green-600"
                    >
                      <Award className="w-4 h-4 text-orange-400 shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Referral & Leave Section - Streamlined */}
          <div className="border-t border-green-100 p-6 md:p-10 bg-green-50/30">
            <div className="flex flex-col items-center gap-6">
              <button
                onClick={() => setShowReferralForm(!showReferralForm)}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-900 text-white rounded-full text-sm font-bold hover:bg-green-800 transition-all shadow-md"
              >
                <FileText size={16} />
                {showReferralForm ? "Cancel Referral" : "Create New Referral"}
              </button>

              {showReferralForm && (
                <div className="w-full max-w-2xl bg-white p-6 rounded-xl border border-green-200 shadow-xl animate-in fade-in slide-in-from-bottom-4">
                  {/* Simplified Form Inputs */}
                  <form
                    onSubmit={handleReferralSubmit}
                    className="grid grid-cols-1 gap-4"
                  >
                    <input
                      placeholder="Patient Roll No."
                      className="w-full p-3 bg-green-50 border border-green-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                    <textarea
                      placeholder="Reason for referral..."
                      className="w-full p-3 bg-green-50 border border-green-200 rounded-lg text-sm h-28 focus:ring-2 focus:ring-indigo-500 outline-none"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
                    >
                      Submit Referral
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Leave History - Simplified to a List/Table view */}
            <div className="mt-12">
              <h3 className="text-lg font-bold text-green-800 mb-6 flex items-center gap-2">
                <Calendar className="text-red-500" /> Leave History
              </h3>
              <div className="overflow-hidden rounded-xl border border-green-200 bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-green-50 text-green-500 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="px-6 py-3">Dates</th>
                      <th className="px-6 py-3">Duration</th>
                      <th className="px-6 py-3">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-100">
                    {leaves.map((l, i) => (
                      <tr
                        key={i}
                        className="hover:bg-green-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-green-700">
                          {format(new Date(l.date_start), "dd MMM")} -{" "}
                          {format(new Date(l.date_end), "dd MMM yyyy")}
                        </td>
                        <td className="px-6 py-4 text-green-500">
                          {calculateLeaveDuration(l.date_start, l.date_end)}{" "}
                          days
                        </td>
                        <td className="px-6 py-4 text-green-500 italic">
                          "{l.reason || "Personal"}"
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {leaves.length === 0 && (
                  <div className="p-8 text-center text-green-400 text-sm italic">
                    No leave records found for this doctor.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDoctorProfile;
