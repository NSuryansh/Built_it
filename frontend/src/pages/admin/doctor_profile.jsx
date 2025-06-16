import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import AdminNavbar from "../../components/admin/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CustomToast from "../../components/common/CustomToast";
import { checkAuth } from "../../utils/profile";
import SessionExpired from "../../components/common/SessionExpired";
import CustomLoader from "../../components/common/CustomLoader";

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
    avgRating: 0,
  });
  const token = localStorage.getItem("token");

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
          `https://built-it.onrender.com/common/getDoc?docId=${doctorId}`,
          { headers: { Authorization: "Bearer " + token } }
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
          avgRating: data.doctor.avgRating,
        });
        setProfileImage(data.doctor.img);
        setfetched(true);
      } catch (e) {
        console.error(e);
        CustomToast("Error fetching doctor details", "green");
        setfetched(false);
      }
    };
    fetchData();
  }, []);

  const handleClosePopup = () => {
    window.location.href = "https://hms-sso.vercel.app";
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
        "https://built-it.onrender.com/admin/referrals",
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
        }
      );
      const data = await response.json();

      if (data.message === "User with given roll number not found") {
        CustomToast("User with given roll number not found", "green");
        return false;
      }
      CustomToast("Referral created successfully", "green");
      await fetch("https://built-it.onrender.com/common/send-notification", {
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

  if (isAuthenticated === null || fetched === null) {
    return <CustomLoader color="green" text="Loading your dashboard..." />;
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} theme="green" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--custom-gray-100)] via-[var(--custom-gray-200)] to-[var(--custom-gray-300)]">
      <AdminNavbar />
      <ToastContainer />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-14">
        {/* Back Button */}
        <Link
          to="/admin/doctor_list"
          className="mb-12 inline-flex items-center gap-3 px-6 py-3 font-semibold text-[var(--custom-white)] bg-gradient-to-r from-[var(--custom-green-500)] to-[var(--custom-green-700)] rounded-full hover:bg-gradient-to-l hover:shadow-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to List
        </Link>

        {/* Doctor Profile Card */}
        <div className="relative bg-[var(--custom-white)]/70 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-[var(--custom-purple-300)]">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-[var(--custom-green-600)] via-[var(--custom-green-500)] to-[var(--custom-green-400)] py-8 sm:px-8 md:py-14 relative overflow-hidden rounded-t-3xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.2),transparent)]"></div>
            <div className="flex flex-col sm:flex-row items-center sm:space-x-8 relative">
              <div className="relative group">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 border-[var(--custom-yellow-300)] object-cover shadow-xl group-hover:scale-[1.15] transition-transform duration-500 ease-out"
                  />
                ) : (
                  <User className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-[6px] border-[var(--custom-yellow-400)] text-[var(--custom-yellow-400)] transform transition-all duration-300 group-hover:scale-110" />
                )}
                <div className="absolute inset-0 rounded-full bg-coral-400/20 opacity-0 group-hover:opacity-[0.6] transition-opacity duration-500"></div>
              </div>
              <div className="text-[var(--custom-white)]">
                <h1 className="md:text-[2.5rem] text-[2rem] text-center sm:text-start lg:text-[3rem] font-extrabold tracking-tight drop-shadow-lg">
                  {doctor.name.toUpperCase()}
                </h1>
                <div className="flex">
                  <p className="text-[var(--custom-yellow-200)] text-xl font-medium italic">
                    {`${doctor.field} (${
                      doctor.avgRating != 0.0
                        ? parseFloat(doctor.avgRating).toPrecision(2)
                        : "Unrated"
                    }`}
                  </p>
                  {doctor.avgRating != 0.0 && (
                    <div className="flex">
                      <p>&nbsp;</p>
                      <StarIcon
                        fill="#FFF085"
                        className="text-[var(--custom-yellow-200)]"
                      />
                    </div>
                  )}
                  <p className="text-[var(--custom-yellow-200)] text-xl font-medium italic">
                    )
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-[50px] gap-x-[30px] p-4 sm:p-[60px] bg-[var(--custom-gray-50)]/50 rounded-b-[2rem]">
            {/* Left Column */}
            <div className="space-y-5 md:space-y-10">
              {/* Contact Information */}
              <h2 className="text-[1.5rem] md:text-[2rem] font-bold text-[var(--custom-green-600)] flex items-center gap-[10px] bg-[var(--custom-purple-100)]/50 p-[20px] rounded-lg shadow-md">
                <User className="w-[30px] h-[30px] text-coral-500 animate-pulse" />
                Contact Information
              </h2>
              <div className="bg-[var(--custom-white)]/60 backdrop-blur-md p-[30px] rounded-xl shadow-lg border border-[var(--custom-purple-100)] space-y-[20px] transform hover:-translate-y-[5px] transition-transform duration-[300ms]">
                {[
                  { icon: Mail, label: doctor.contact.email },
                  { icon: Phone, label: doctor.contact.phone },
                  { icon: MapPin, label: doctor.contact.address },
                  { icon: MapPin, label: doctor.contact.office_address },
                ].map((info, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 md:space-x-[15px] text-[var(--custom-gray-800)] hover:text-coral-500 transition-colors duration-[200ms]"
                  >
                    {<info.icon className="!w-6 !h-6 text-coral-500" />}
                    <span className="text-md sm:text-lg font-medium">
                      {info.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Educational Qualification */}
              <h2 className="text-[1.5rem] md:text-[2rem] font-bold text-[var(--custom-green-600)] flex items-center gap-[10px] bg-[var(--custom-purple-100)]/50 p-[20px] rounded-lg shadow-md">
                <GraduationCap className="w-[30px] h-[30px] text-coral-500" />
                Educational Qualification
              </h2>
              <ul className="space-y-[20px]">
                {doctor.education.map((edu, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-[15px] text-[var(--custom-gray-800)] bg-[var(--custom-white)]/70 backdrop-blur-md p-[20px] rounded-xl shadow-md hover:shadow-xl hover:bg-[var(--custom-yellow-50)] transition-all duration-[300ms]"
                  >
                    <GraduationCap className="w-[25px] h-[25px]" />
                    <span className="text-lg">{edu}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column */}
            <div className="space-y-5 md:space-y-10">
              {/* Professional Information */}
              <h2 className="text-[1.5rem] md:text-[2rem] font-bold text-[var(--custom-green-600)] flex items-center gap-[10px] bg-[var(--custom-purple-100)]/50 p-[20px] rounded-lg shadow-md">
                <Briefcase className="w-[30px] h-[30px] text-coral-500 animate-spin-slow" />
                Professional Information
              </h2>
              {/* Work Experience */}
              <div className="bg-[var(--custom-white)]/60 backdrop-blur-md p-[30px] rounded-xl shadow-lg border border-[var(--custom-purple-100)] transform hover:-translate-y-[5px] transition-transform duration-[300ms]">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-[var(--custom-gray-800)]">
                      Years of Experience
                    </h3>
                    <p className="text-[var(--custom-gray-600)]">
                      Professional Medical Practice
                    </p>
                  </div>
                  <div className="relative mt-4 sm:mt-0 w-32 h-32 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[var(--custom-green-100)] rounded-full"></div>
                    <div className="relative  text-center">
                      <span className="block text-4xl font-bold text-[var(--custom-green-600)]">
                        {doctor.experience}
                      </span>
                      <span className="text-sm text-[var(--custom-gray-600)]">
                        Years
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-[var(--custom-gray-200)]">
                  <div className="flex items-center space-x-3 text-[var(--custom-gray-600)]">
                    <Clock className="w-5 h-5 text-[var(--custom-green-500)]" />
                    <span>
                      Practicing since{" "}
                      {new Date().getFullYear() - parseInt(doctor.experience)}{" "}
                    </span>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <h2 className="text-[1.5rem] md:text-[2rem] font-bold text-[var(--custom-green-600)] flex items-center gap-[10px] bg-[var(--custom-purple-100)]/50 p-[20px] rounded-lg shadow-md">
                <Certificate className="w-[30px] h-[30px] text-coral-500 animate-pulse" />
                Certifications
              </h2>
              <ul className="space-y-[20px]">
                {doctor.certifications.map((cert, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-[15px] text-[var(--custom-gray-800)] bg-[var(--custom-white)]/70 backdrop-blur-md p-[20px] rounded-xl shadow-md hover:shadow-xl hover:bg-[var(--custom-yellow-50)] transition-all duration-[300ms]"
                  >
                    <Award className="w-[25px] h-[25px]" />
                    <span className="text-lg">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Referral Section */}
          <div className="px-4 sm:px-6 md:px-8 lg:px-[60px] pt-0 pb-4 md:pb-8">
            {/* Referral Button */}
            <button
              onClick={() => setShowReferralForm(!showReferralForm)}
              className="mx-auto w-fit flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[var(--custom-green-500)] to-[var(--custom-green-700)] text-[var(--custom-white)] rounded-full font-semibold text-sm shadow-md hover:shadow-xl hover:from-[var(--custom-green-600)] hover:to-[var(--custom-green-800)] transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <FileText className="w-5 h-5 group-hover:animate-pulse" />
              {showReferralForm ? "Close Referral" : "Create Referral"}
              <div className="absolute inset-0 bg-[var(--custom-green-600)] opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
            </button>

            {/* Referral Form */}
            {showReferralForm && (
              <div className="mt-8 bg-[var(--custom-white)]/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-[var(--custom-green-200)]/50 transition-all duration-500 ease-in-out transform animate-slide-in">
                <form onSubmit={handleReferralSubmit} className="space-y-6">
                  <div className="space-y-6">
                    {/* Roll No. */}
                    <div className="relative">
                      <label className="block text-[var(--custom-gray-700)] font-semibold mb-2 tracking-wide">
                        Roll No.
                      </label>
                      <input
                        type="text"
                        value={referralData.rollNo}
                        onChange={(e) =>
                          setReferralData({
                            ...referralData,
                            rollNo: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-[var(--custom-gray-50)]/50 border border-[var(--custom-green-300)] rounded-lg focus:ring-2 focus:ring-[var(--custom-green-400)] focus:border-[var(--custom-green-500)] outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                        required
                      />
                      <div className="absolute inset-y-0 right-3 top-8 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-[var(--custom-green-500)] opacity-60" />
                      </div>
                    </div>

                    {/* Referred By */}
                    <div className="relative">
                      <label className="block text-[var(--custom-gray-700)] font-semibold mb-2 tracking-wide">
                        Referred By
                      </label>
                      <input
                        type="text"
                        value={referralData.referredBy}
                        onChange={(e) =>
                          setReferralData({
                            ...referralData,
                            referredBy: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-custom-gray-50/50 border border-[var(--custom-green-300)] rounded-lg focus:ring-2 focus:ring-[var(--custom-green-400)] focus:border-[var(--custom-green-500)] outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                        required
                      />
                      <div className="absolute inset-y-0 right-3 top-8 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-[var(--custom-green-500)] opacity-60" />
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
                        className="w-full px-4 py-3 bg-[var(--custom-gray-50)]/50 border border-[var(--custom-green-300)] rounded-lg focus:ring-2 focus:ring-[var(--custom-green-400)] focus:border-[var(--custom-green-500)] outline-none h-36 resize-none transition-all duration-300 shadow-sm hover:shadow-md"
                        required
                      />
                      <div className="absolute inset-y-0 right-3 top-10 flex items-start pointer-events-none">
                        <FileText className="w-5 h-5 text-[var(--custom-green-500)] opacity-60" />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="relative w-full bg-gradient-to-r from-[var(--custom-green-500)] to-[var(--custom-green-700)] text-[var(--custom-white)] py-3 px-6 rounded-lg font-semibold  overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:from-[var(--custom-green-600)] hover:to-[var(--custom-green-800)] group"
                  >
                    <span className="relative ">Done</span>
                    <div className="absolute inset-0 bg-[var(--custom-green-600)] opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-lg"></div>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDoctorProfile;
