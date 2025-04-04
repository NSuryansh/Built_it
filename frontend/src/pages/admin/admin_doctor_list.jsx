import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, UserPlus } from "lucide-react";
import AdminNavbar from "../../components/admin/admin_navbar";
import Footer from "../../components/Footer";
import PacmanLoader from "react-spinners/PacmanLoader";
import { checkAuth } from "../../utils/profile";
import { ToastContainer } from "react-toastify";
import CustomToast from "../../components/CustomToast";

const DoctorsList = () => {
  const [doctors, setDoc] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("admin");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await fetch("http://localhost:3000/getdoctors");
      const resp = await res.json();
      setDoc(resp);
    };

    fetchDoctors();
  }, []);

  const handleDelete = async (doctorId) => {
    try {
      const res = await fetch("http://localhost:3000/deletedoc", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doctorID: doctorId }),
      });
      const resp = await res.json();
      // Optionally, you can update your state to remove the deleted doctor
      setDoc((prevDoctors) =>
        prevDoctors.filter((doctor) => doctor.id !== doctorId)
      );
    } catch (error) {
      console.error("Error deleting doctor:", error);
      CustomToast("Error while fetching data");
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <PacmanLoader color="#048a81" radius={6} height={20} width={5} />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <AdminNavbar />
      <ToastContainer />
  
      <div className="w-full max-w-7xl mx-auto p-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-green-900">Doctors Directory</h1>
            <p className="text-md text-green-700">Effortlessly manage registered doctors</p>
          </div>
          <Link
            to="/admin/add_doctor"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transition-transform transform hover:scale-105"
          >
            <UserPlus size={20} />
            Add Doctor
          </Link>
        </div>
  
        {/* Table View for Desktop */}
        <div className="hidden sm:block bg-white rounded-3xl shadow-xl overflow-hidden border border-green-100 animate-fade-in-up">
          <table className="w-full text-sm text-left">
            <thead className="bg-green-100 text-green-900 font-semibold">
              <tr>
                <th className="px-6 py-5">Name</th>
                <th className="px-6 py-5">Specialty</th>
                <th className="px-6 py-5">Email</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-50">
              {doctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="hover:bg-green-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{doctor.name}</td>
                  <td className="px-6 py-4 text-gray-600">{doctor.desc}</td>
                  <td className="px-6 py-4 text-gray-600">{doctor.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-5">
                      <button
                        onClick={() => handleDelete(doctor.id)}
                        className="p-2 text-red-600 hover:text-red-700 transition-colors rounded-full hover:bg-red-50"
                        title="Delete Doctor"
                      >
                        <Trash2 size={18} />
                      </button>
                      <Link
                        to={`/admin/doctor_profile?id=${doctor.id}`}
                        className="text-green-700 font-semibold hover:text-green-900 transition-colors underline"
                        title="View Profile"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Mobile Card View */}
        <div className="sm:hidden space-y-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="backdrop-blur-sm bg-white/80 border border-green-100 rounded-2xl shadow-lg p-5 space-y-4 animate-fade-in-up"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-green-900">{doctor.name}</h3>
                  <p className="text-sm text-green-700">{doctor.desc}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDelete(doctor.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                  <Link
                    to={`/admin/doctor_profile?id=${doctor.id}`}
                    className="text-green-700 font-semibold hover:text-green-900"
                    title="View"
                  >
                    View
                  </Link>
                </div>
              </div>
              <div className="pt-3 border-t border-green-100 text-sm text-gray-600">
                <span className="font-medium">Email:</span> {doctor.email}
              </div>
            </div>
          ))}
        </div>
      </div>
  
      <Footer color="green" />
    </div>
  );
  
  
};

export default DoctorsList;
