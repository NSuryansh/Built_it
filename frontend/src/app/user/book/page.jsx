"use client";

import { useState, useEffect } from "react";
import { checkAuth } from "@/utils/profile";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/common/Footer";
import { ToastContainer } from "react-toastify";
import DoctorSelectionStep from "@/app/user/book/components/DoctorSelection";
import BookingFormStep from "@/app/user/book/components/BookingForm";
import CustomLoader from "@/components/common/CustomLoader";
import { fetchDoctors, handleSubmit } from "./controller";

const Book = () => {
  // step 1: select a doctor; step 2: booking form
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [formData, setFormData] = useState({
    // booking details provided by the user
    name: "",
    email: "",
    phone: "",
    note: "",
    date: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // Verify authentication
  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("user");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  // Fetch doctors list from backend
  useEffect(() => {
    fetchDoctors(setDoctors);
  }, []);

  // Populate formData fields if authenticated; allow manual input if not authenticated.
  useEffect(() => {
    if (isAuthenticated) {
      setFormData((prev) => ({
        ...prev,
        name: localStorage.getItem("username") || "",
        email: localStorage.getItem("user_email") || "",
        phone: localStorage.getItem("user_mobile") || "",
      }));
    }
  }, [isAuthenticated]);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isAuthenticated === null) {
    return <CustomLoader text="Loading your wellness journey..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 flex flex-col overflow-hidden">
      <Navbar />
      <ToastContainer />

      <div className="flex-1 flex justify-center items-center px-2 sm:px-6 md:px-10 py-12">
        <div className="w-full max-w-full bg-white/70 backdrop-blur-lg rounded-xl md:rounded-3xl shadow-lg px-2 py-6 md:p-10 border border-orange-200/50 transition-all duration-500 hover:shadow-3xl">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold text-white transition-all duration-300 ${
                  step === 1 ? "bg-orange-500 scale-110" : "bg-gray-300"
                }`}
              >
                1
              </div>
              <div className="w-16 h-1 bg-gray-300 rounded-full" />
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold text-white transition-all duration-300 ${
                  step === 2 ? "bg-orange-500 scale-110" : "bg-gray-300"
                }`}
              >
                2
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="min-h-[40.5rem] flex items-center justify-center animate-fade-in">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Select Your Buddy
                </h2>
                <DoctorSelectionStep
                  doctors={doctors}
                  onSelect={handleDoctorSelect}
                  className="cursor-pointer"
                />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="min-h-[40.5rem] flex items-center justify-center animate-fade-in">
              <div className="text-center w-full">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Book Your Appointment
                </h2>
                <BookingFormStep
                  formData={formData}
                  handleChange={handleChange}
                  onSubmit={(e) =>
                    handleSubmit(
                      e,
                      setisLoading,
                      formData,
                      setStep,
                      setFormData,
                      setSelectedDoctor,
                      selectedDoctor
                    )
                  }
                  onBack={() => setStep(1)}
                  selectedDoctor={selectedDoctor}
                  isAuthenticated={isAuthenticated}
                  isLoading={isLoading}
                  setisLoading={setisLoading}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer color="orange" />
    </div>
  );
};

export default Book;
