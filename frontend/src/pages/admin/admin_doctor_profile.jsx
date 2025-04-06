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
  X,
} from "lucide-react";
import AdminNavbar from "../../components/admin/admin_navbar";
import { Link, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CustomToast from "../../components/CustomToast";

const AdminDoctorProfile = () => {
  const search = useLocation().search;
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [referralData, setReferralData] = useState({
    rollNo: "",
    referredBy: "",
    reason: "",
  });

  const [doctor, setDoctor] = useState({
    name: "Dr. Sarah Johnson",
    field: "Cardiologist",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
    contact: {
      email: "dr.sarah@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Medical Center Drive, New York, NY 10001",
    },
    experience: "",
    education: [
      "M.D. from Johns Hopkins School of Medicine",
      "Cardiology Fellowship at Mayo Clinic",
      "Board Certified in Internal Medicine and Cardiology",
    ],
    certifications: [
      "American Board of Internal Medicine",
      "American College of Cardiology Fellow",
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorId = search.split("=")[1];
        const response = await fetch(
          `http://localhost:3000/getDoc?docId=${doctorId}`
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
            address: data.doctor.address + " " + data.doctor.city,
          },
          experience:
            data.doctor.experience.split(" ")[0] != "<Please"
              ? data.doctor.experience.split(" ")[0]
              : "",
          field: data.doctor.desc,
          certifications: certifications,
          education: educations,
        });
      } catch (e) {
        console.error(e);
        CustomToast("Error fetching doctor details");
      }
    };
    fetchData();
  }, []);

  const handleReferralSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    console.log("Referral submitted:", referralData);
    setShowReferralForm(false);
    setReferralData({ rollNo: "", referredBy: "", reason: "" });
    CustomToast("Referral submitted successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <AdminNavbar />
      <ToastContainer />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Back Button */}
        <Link
          to="/admin/doctor_list"
          className="mb-12 inline-flex items-center gap-3 px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-700 rounded-full hover:bg-gradient-to-l hover:shadow-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to List
        </Link>

        {/* Doctor Profile Card */}
        <div className="relative bg-white/70 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-purple-300">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-teal-600 via-teal-500 to-teal-400 px-8 py-14 relative overflow-hidden rounded-t-3xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.2),transparent)]"></div>
            <div className="flex items-center space-x-8 relative z-10">
              <div className="relative group">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-40 h-40 rounded-full border-[6px] border-yellow-400 object-cover shadow-xl group-hover:scale-[1.15] transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 rounded-full bg-coral-400/20 opacity-0 group-hover:opacity-[0.6] transition-opacity duration-500"></div>
              </div>
              <div className="text-white space-y-3">
                <h1 className="text-[3rem] font-extrabold tracking-tight drop-shadow-lg">
                  {doctor.name}
                </h1>
                <p className="text-yellow-200 text-xl font-medium italic">
                  {doctor.field}
                </p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-[50px] gap-x-[30px] p-[60px] bg-gray-50/50 rounded-b-[2rem]">
            {/* Left Column */}
            <div className="space-y-[40px]">
              {/* Contact Information */}
              <h2 className="text-[2rem] font-bold text-teal-600 flex items-center gap-[10px] bg-purple-100/50 p-[20px] rounded-lg shadow-md">
                <User className="w-[30px] h-[30px] text-coral-500 animate-pulse" />
                Contact Information
              </h2>
              <div className="bg-white/60 backdrop-blur-md p-[30px] rounded-xl shadow-lg border border-purple-100 space-y-[20px] transform hover:-translate-y-[5px] transition-transform duration-[300ms]">
                {[
                  { icon: Mail, label: doctor.contact.email },
                  { icon: Phone, label: doctor.contact.phone },
                  { icon: MapPin, label: doctor.contact.address },
                ].map((info, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-[15px] text-gray-800 hover:text-coral-500 transition-colors duration-[200ms]"
                  >
                    {React.createElement(info.icon, {
                      className: "w-[25px] h-[25px] text-coral-500",
                    })}
                    <span className="text-lg font-medium">{info.label}</span>
                  </div>
                ))}
              </div>

              {/* Educational Qualification */}
              <h2 className="text-[2rem] font-bold text-teal-600 flex items-center gap-[10px] bg-purple-100/50 p-[20px] rounded-lg shadow-md">
                <GraduationCap className="w-[30px] h-[30px] text-coral-500 animate-bounce" />
                Educational Qualification
              </h2>
              <ul className="space-y-[20px]">
                {doctor.education.map((edu, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-[15px] text-gray-800 bg-white/70 backdrop-blur-md p-[20px] rounded-xl shadow-md hover:shadow-xl hover:bg-yellow-50 transition-all duration-[300ms]"
                  >
                    <span className="w-[10px] h-[10px] bg-coral-500 rounded-full"></span>
                    <span className="text-lg">{edu}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column */}
            <div className="space-y-[40px]">
              {/* Professional Information */}
              <h2 className="text-[2rem] font-bold text-teal-600 flex items-center gap-[10px] bg-purple-100/50 p-[20px] rounded-lg shadow-md">
                <Briefcase className="w-[30px] h-[30px] text-coral-500 animate-spin-slow" />
                Professional Information
              </h2>
              {/* Work Experience */}
              <div className="bg-white/60 backdrop-blur-md p-[30px] rounded-xl shadow-lg border border-purple-100 transform hover:-translate-y-[5px] transition-transform duration-[300ms]">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Years of Experience
                    </h3>
                    <p className="text-gray-600">Professional Medical Practice</p>
                  </div>
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <div className="absolute inset-0 bg-teal-100 rounded-full"></div>
                    <div className="relative z-10 text-center">
                      <span className="block text-4xl font-bold text-teal-600">
                        {doctor.experience}
                      </span>
                      <span className="text-sm text-gray-600">Years</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Clock className="w-5 h-5 text-teal-500" />
                    <span>
                      Practicing since{" "}
                      {new Date().getFullYear() - parseInt(doctor.experience)}{" "}
                    </span>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <h2 className="text-[2rem] font-bold text-teal-600 flex items-center gap-[10px] bg-purple-100/50 p-[20px] rounded-lg shadow-md">
                <Certificate className="w-[30px] h-[30px] text-coral-500 animate-pulse" />
                Certifications
              </h2>
              <ul className="space-y-[20px]">
                {doctor.certifications.map((cert, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-[15px] text-gray-800 bg-white/70 backdrop-blur-md p-[20px] rounded-xl shadow-md hover:shadow-xl hover:bg-yellow-50 transition-all duration-[300ms]"
                  >
                    <Award className="w-[25px] h-[25px]" />
                    <span className="text-lg">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Referral Section */}
          <div className="p-[60px] pt-0">
            <button
              onClick={() => setShowReferralForm(!showReferralForm)}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white py-4 px-8 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 hover:from-teal-600 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FileText className="w-6 h-6" />
              {showReferralForm ? "Close Referral Form" : "Create Referral"}
            </button>

            {showReferralForm && (
              <div className="mt-8 bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg border border-teal-200">
                <form onSubmit={handleReferralSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
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
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
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
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
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
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent h-32 resize-none"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-800 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Done
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