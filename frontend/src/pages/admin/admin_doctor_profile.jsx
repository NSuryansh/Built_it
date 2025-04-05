import React, { useEffect } from "react";
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
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CustomToast from "../../components/CustomToast";

const AdminDoctorProfile = () => {
  const doctor = {
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
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:3000/getdoctors");
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        CustomToast("Error while fetching data");
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <ToastContainer />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <Link
          to="/admin/doctor_list"
          className="mb-12 inline-flex items-center gap-3 px-6 py-3 text-base font-semibold text-white bg-teal-600 rounded-full hover:bg-teal-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to List
        </Link>
  
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-200">
          {/* Header Section */}
          <div className="bg-teal-600 px-8 py-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.2),transparent)]"></div>
            <div className="flex items-center space-x-8 relative z-10">
              <div className="relative group">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-40 h-40 rounded-full border-4 border-amber-300 object-cover shadow-xl group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 rounded-full bg-coral-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="text-white">
                <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">{doctor.name}</h1>
                <p className="text-amber-200 text-2xl font-medium mt-3 italic">{doctor.field}</p>
              </div>
            </div>
          </div>
  
          {/* Content Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-12 bg-gray-50/50">
            {/* Left Column */}
            <div className="space-y-10">
              <h2 className="text-3xl font-bold text-teal-600 flex items-center gap-4 bg-purple-100/50 p-3 rounded-lg shadow-sm">
                <User className="w-7 h-7 text-coral-500" />
                Contact Information
              </h2>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 space-y-6 transform hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center space-x-4 text-gray-800 hover:text-coral-500 transition-colors duration-200">
                  <Mail className="w-6 h-6 text-coral-500" />
                  <span className="text-lg font-medium">{doctor.contact.email}</span>
                </div>
                <div className="flex items-center space-x-4 text-gray-800 hover:text-coral-500 transition-colors duration-200">
                  <Phone className="w-6 h-6 text-coral-500" />
                  <span className="text-lg font-medium">{doctor.contact.phone}</span>
                </div>
                <div className="flex items-center space-x-4 text-gray-800 hover:text-coral-500 transition-colors duration-200">
                  <MapPin className="w-6 h-6 text-coral-500" />
                  <span className="text-lg font-medium">{doctor.contact.address}</span>
                </div>
              </div>
  
              <h2 className="text-3xl font-bold text-teal-600 flex items-center gap-4 bg-purple-100/50 p-3 rounded-lg shadow-sm">
                <GraduationCap className="w-7 h-7 text-coral-500" />
                Educational Qualification
              </h2>
              <ul className="space-y-5">
                {doctor.education.map((edu, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-4 text-gray-800 bg-white p-4 rounded-xl shadow-md hover:shadow-xl hover:bg-amber-50 transition-all duration-300"
                  >
                    <span className="w-3 h-3 bg-coral-500 rounded-full"></span>
                    <span className="text-lg">{edu}</span>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Right Column */}
            <div className="space-y-10">
              <h2 className="text-3xl font-bold text-teal-600 flex items-center gap-4 bg-purple-100/50 p-3 rounded-lg shadow-sm">
                <Briefcase className="w-7 h-7 text-coral-500" />
                Professional Information
              </h2>
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 bg-amber-100/50 p-2 rounded-lg">Work Experience</h3>
                <ul className="space-y-5">
                  {doctor.experience.map((exp, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-4 text-gray-800 bg-white p-4 rounded-xl shadow-md hover:shadow-xl hover:bg-amber-50 transition-all duration-300"
                    >
                      <span className="w-3 h-3 bg-coral-500 rounded-full"></span>
                      <span className="text-lg">{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>
  
              <h2 className="text-3xl font-bold text-teal-600 flex items-center gap-4 bg-purple-100/50 p-3 rounded-lg shadow-sm">
                <Certificate className="w-7 h-7 text-coral-500" />
                Certifications
              </h2>
              <ul className="space-y-5">
                {doctor.certifications.map((cert, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-4 text-gray-800 bg-white p-4 rounded-xl shadow-md hover:shadow-xl hover:bg-amber-50 transition-all duration-300"
                  >
                    <Award className="w-6 h-6 text-coral-500" />
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
