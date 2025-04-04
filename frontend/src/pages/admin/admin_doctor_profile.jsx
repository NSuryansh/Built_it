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
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <ToastContainer />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/admin/doctor_list"
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-12">
            <div className="flex items-center space-x-8">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <div className="text-white">
                <h1 className="text-3xl font-bold">{doctor.name}</h1>
                <p className="text-blue-100 text-lg">{doctor.field}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span>{doctor.contact.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Phone className="w-5 h-5 text-blue-500" />
                  <span>{doctor.contact.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <span>{doctor.contact.address}</span>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 pt-6">
                <GraduationCap className="w-5 h-5 text-blue-500" />
                Educational Qualification
              </h2>
              <ul className="space-y-2">
                {doctor.education.map((edu, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-3 text-gray-600"
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>{edu}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                Professional Information
              </h2>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">
                  Work Experience
                </h3>
                <ul className="space-y-2">
                  {doctor.experience.map((exp, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-3 text-gray-600"
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 pt-6">
                <Certificate className="w-5 h-5 text-blue-500" />
                Certifications
              </h2>
              <ul className="space-y-2">
                {doctor.certifications.map((cert, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-3 text-gray-600"
                  >
                    <Award className="w-5 h-5 text-blue-500" />
                    <span>{cert}</span>
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
