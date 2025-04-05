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
  AlignCenterVertical as Certificate,
} from "lucide-react";
import AdminNavbar from "../../components/admin/admin_navbar";
import { Link, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CustomToast from "../../components/CustomToast";

const AdminDoctorProfile = () => {
  const search = useLocation().search;
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
    experience: [
      "10+ years of specialized cardiac care",
      "Former Chief of Cardiology at NYC Heart Center",
      "Published researcher in cardiovascular medicine",
    ],

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
        let education = [];
        data.education.map((education) => {
          education.push(education.education);
        });
        if (education.length === 0) {
          education = ["None"];
        }
        setDoctor({
          ...doctor,
          name: data.doctor.name,
          contact: {
            email: data.doctor.email,
            phone: data.doctor.mobile,
            address: data.doctor.address + " " + data.doctor.city,
          },
          field: data.doctor.desc,
          certifications: certifications,
          education: education,
        });
      } catch (e) {
        console.error(e);
        CustomToast("Error fetching doctor details");
      }
    };
    fetchData();
  }, []);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[50px] gap-x-[30px] p-[60px] bg-gray-50/50 rounded-b-[2rem]">
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
              <div className="space-y-[20px]">
                <h3 className="text-xl font-semibold text-gray-800 bg-yellow-100/50 p-[10px] rounded-lg">
                  Work Experience
                </h3>
                <ul className="space-y-[20px]">
                  {doctor.experience.map((exp, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-[15px] text-gray-800 bg-white/70 backdrop-blur-md p-[20px] rounded-xl shadow-md hover:shadow-xl hover:bg-yellow-50 transition-all duration-[300ms]"
                    >
                      <span className="w-[10px] h-[10px] bg-coral-500 rounded-full"></span>
                      <span className="text-lg">{exp}</span>
                    </li>
                  ))}
                </ul>
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
        </div>
      </main>
    </div>
  );
};

export default AdminDoctorProfile;
