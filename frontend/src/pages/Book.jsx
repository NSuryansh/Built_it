import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../utils/profile";
import Navbar from "../components/Navbar";
import PacmanLoader from "react-spinners/PacmanLoader";
import Footer from "../components/Footer";
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
  const token = localStorage.getItem("token");
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
        const res = await fetch("http://localhost:3000/getdoctors?user_type=user", {
          headers: { Authorization: "Bearer " + token },
        });
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
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 flex flex-col overflow-hidden">
      {/* Navbar with subtle shadow */}
      <Navbar />

      {/* Toast Container with custom styling */}
      <ToastContainer
        className="z-50"
        toastClassName="rounded-xl shadow-lg bg-white/90 text-gray-800"
      />

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center px-2 sm:px-6 md:px-10 py-12">
        <div className="w-full max-w-full bg-white/70 backdrop-blur-lg rounded-xl md:rounded-3xl shadow-lg px-2 py-6 md:p-10 border border-orange-200/50 transition-all duration-500 hover:shadow-3xl">
          {/* Step Indicator */}
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

          {/* Conditional Steps */}
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
                  onSubmit={handleSubmit}
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

      {/* Footer with matching theme */}
      <Footer
        color="orange"
        className="bg-orange-600/90 text-white shadow-inner"
      />
    </div>
  );
};

export default Book;
