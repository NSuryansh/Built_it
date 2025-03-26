import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, UserPlus } from "lucide-react";
import AdminNavbar from "../../components/admin/admin_navbar";
import Footer from "../../components/Footer";
import PacmanLoader from "react-spinners/PacmanLoader";
import { checkAuth } from "../../utils/profile";
import PacmanLoader from "react-spinners/PacmanLoader";

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
      const res = await fetch("https://built-it-xjiq.onrender.com/getdoctors");
      const resp = await res.json();
      setDoc(resp);
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    console.log(doctors);
  }, [doctors]);

  const handleDelete = async (doctorId) => {
    try {
      const res = await fetch("https://built-it-xjiq.onrender.com/deletedoc", {
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
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <PacmanLoader color="#ff4800" radius={6} height={20} width={5} />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="space-y-6 md:min-w-5xl max-w-7xl mx-auto mb-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[var(--custom-primary-green-900)]">
            Doctors List
          </h1>
          <Link
            to="/admin/add_doctor"
            className="flex items-center gap-2 bg-[var(--custom-primary-green-600)] text-[var(--custom-white)] px-4 py-2 rounded-lg hover:bg-[var(--custom-primary-green-700)] transition-colors"
          >
            <UserPlus size={20} />
            Add New Doctor
          </Link>
        </div>

        <div className="bg-[var(--custom-white)] rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--custom-primary-green-100)]">
              <tr>
                <th className="px-6 py-4 text-left text-[var(--custom-primary-green-900)]">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-[var(--custom-primary-green-900)]">
                  Specialty
                </th>
                <th className="px-6 py-4 text-left text-[var(--custom-primary-green-900)]">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-[var(--custom-primary-green-900)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--custom-primary-green-100)]">
              {doctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="hover:bg-[var(--custom-primary-green-50)]"
                >
                  <td className="px-6 py-4">{doctor.name}</td>
                  <td className="px-6 py-4">{doctor.specialty}</td>
                  <td className="px-6 py-4">{doctor.email}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(doctor.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer color={"green"} />
    </div>
  );
};

export default DoctorsList;
