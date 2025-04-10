import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../utils/profile";
import Navbar from "../components/Navbar";
import PacmanLoader from "react-spinners/PacmanLoader";
import Footer from "../components/Footer";
import { motion } from 'framer-motion';
import { ToastContainer } from "react-toastify";
import DoctorSelectionStep from "../components/DoctorSelection";
import BookingFormStep from "../components/BookingForm";
import CustomToast from "../components/CustomToast";

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

  const navigate = useNavigate();
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

  // On form submission, send the booking request to the backend's requests API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);

    const lowerCaseEmail = formData.email.toLowerCase();
    const [address, domain] = lowerCaseEmail.split("@");

    if (domain != "iiti.ac.in") {
      CustomToast("Please book with your institute email id");
      return;
    }

    let numfound = false;
    for (let i = 0; i < address.length; i++) {
      if (address[i] >= "0" && address[i] <= "9") {
        numfound = true;
      } else if (numfound === true) {
        CustomToast("Please enter a valid email address");
        return;
      }
    }

    const payload = {
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      ...formData,
    };
    const user_id = localStorage.getItem("userid");

    try {
      const res = await fetch("http://localhost:3000/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user_id,
          doctorId: selectedDoctor.id,
          dateTime: formData.date,
          reason: formData.note,
        }),
      });
      const respData = await res.json();
      // alert("Booking Confirmed!");
      CustomToast("Appointment Requested");
      setStep(1);
      setSelectedDoctor(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        note: "",
        date: "",
      });
      setisLoading(false);
    } catch (err) {
      setisLoading(false);
      console.error("Error submitting booking request:", err);
      CustomToast("Error while booking appointment");
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <PacmanLoader color="#ff4800" radius={6} height={20} width={5} />
        <p className="mt-4 text-gray-600">Loading your wellness journey...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-non" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      </div>

      {/* Navbar with Glass Effect */}
      <Navbar className="bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50" />

      {/* Toast Container with Premium Styling */}
      <ToastContainer
        className="z-50"
        toastClassName="rounded-xl shadow-2xl bg-white/95 text-gray-900 border border-gray-100/50 p-5 font-medium backdrop-blur-sm transition-all duration-300 hover:shadow-3xl"
      />

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center px-4 sm:px-8 lg:px-16 py-20 relative z-10">
        <div className="w-full max-w-5xl bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 border border-white/30 transition-all duration-500 hover:shadow-3xl hover:bg-white/50">
          {/* Step Indicator with Luxe Design */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-8 bg-gradient-to-r from-orange-100/50 to-rose-100/50 p-4 rounded-full border border-white/20 shadow-inner">
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-full font-semibold text-white transition-all duration-500 shadow-md ${
                  step === 1
                    ? "bg-gradient-to-br from-orange-500 to-rose-500 scale-110"
                    : "bg-gray-300/80"
                }`}
              >
                1
                {step === 1 && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-orange-400/50 animate-ping"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.2 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
              <div
                className={`w-24 h-2 rounded-full transition-all duration-500 ${
                  step === 2 ? "bg-gradient-to-r from-orange-400 to-rose-400" : "bg-gray-200/50"
                }`}
              />
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-full font-semibold text-white transition-all duration-500 shadow-md ${
                  step === 2
                    ? "bg-gradient-to-br from-orange-500 to-rose-500 scale-110"
                    : "bg-gray-300/80"
                }`}
              >
                2
                {step === 2 && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-rose-400/50 animate-ping"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.2 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Conditional Steps */}
          {step === 1 && (
            <div className="min-h-[60vh] flex items-center justify-center animate-fade-in">
              <div className="text-center px-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-10 bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                  Choose Your Expert
                </h2>
                <DoctorSelectionStep
                  doctors={doctors}
                  onSelect={handleDoctorSelect}
                  className="cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-lg rounded-xl p-4 bg-white/50 backdrop-blur-sm border border-white/20"
                />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="min-h-[60vh] flex items-center justify-center animate-fade-in">
              <div className="text-center w-full px-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-10 bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                  Secure Your Appointment
                </h2>
                <BookingFormStep
                  formData={formData}
                  handleChange={handleChange}
                  onSubmit={handleSubmit}
                  onBack={() => setStep(1)}
                  selectedDoctor={selectedDoctor}
                  isAuthenticated={isAuthenticated}
                  isLoading={isLoading}
                  setisLoading={setisLoading}
                  className="space-y-8 bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-inner"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer with Premium Styling */}
      <Footer
        color="orange"
        className="bg-gradient-to-r from-orange-600 to-rose-600 text-white shadow-lg py-8 border-t border-white/20"
      />
    </div>
);
};

export default Book;
