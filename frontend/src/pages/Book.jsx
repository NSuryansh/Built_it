import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../utils/profile";
import Navbar from "../components/Navbar";
import SessionExpired from "../components/SessionExpired";
import PacmanLoader from "react-spinners/PacmanLoader";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import {
  Phone,
  Mail,
  User,
  Stethoscope,
  Calendar,
  Clock,
  FileText,
  ArrowLeft,
  Check,
} from "lucide-react";

const Book = () => {
  // step 1: select a doctor; step 2: booking form
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    // booking details provided by the user
    name: "",
    email: "",
    phone: "",
    note: "",
    // you can add a preferred date if needed:
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
        const res = await fetch(
          "https://built-it-xjiq.onrender.com/getdoctors"
        );
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        toast("Error while fetching data", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "custom-toast",
        });
      }
    };
    fetchDoctors();
  }, []);

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
    // construct the request payload – you can include doctor details and booking details here
    const payload = {
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      ...formData,
    };
    const user_id = localStorage.getItem("userid");

    try {
      const res = await fetch("https://built-it-xjiq.onrender.com/requests", {
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
      console.log(respData);
      // alert("Booking Confirmed!");
      setStep(1);
      // Optionally, clear form and selected doctor
      setSelectedDoctor(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        note: "",
        date: "",
      });
    } catch (err) {
      console.error("Error submitting booking request:", err);
      toast("Error while booking appointment", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "custom-toast",
      });
    }
  };

  const handleClosePopup = () => {
    navigate("/login");
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
    <div className="min-h-screen bg-[var(--custom-orange-100)] flex flex-col">
      <Navbar />
      <ToastContainer />
      <div className="h-full min-h-screen my-auto mx-2 md:mx-10 flex justify-center items-center mb-5">
        {step === 1 && (
          <DoctorSelectionStep
            doctors={doctors}
            onSelect={handleDoctorSelect}
          />
        )}
        {step === 2 && (
          <BookingFormStep
            formData={formData}
            handleChange={handleChange}
            onSubmit={handleSubmit}
            onBack={() => setStep(1)}
            selectedDoctor={selectedDoctor}
          />
        )}
      </div>
      <Footer color={"orange"} />
    </div>
  );
};

export default Book;

// Step 1: Doctor Selection Component
const DoctorSelectionStep = ({ doctors, onSelect }) => {
  return (
    <div className="bg-[var(--custom-white)] w-full max-w-[1200px] p-4 md:p-8 rounded-[20px] border-2 border-[var(--custom-orange-200)] shadow-xl">
      <div className="flex items-center justify-center gap-3 mb-4 md:mb-8">
        <Stethoscope className="w-8 h-8 text-[var(--custom-orange-500)]" />
        <h2 className="text-center font-bold text-3xl text-[var(--custom-orange-500)] uppercase">
          Select a Doctor
        </h2>
      </div>

      {doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-[var(--custom-orange-50)] hover:bg-[var(--custom-orange-100)] p-3 md:p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-[var(--custom-orange-200)] hover:border-[var(--custom-orange-300)]"
              onClick={() => onSelect(doctor)}
            >
              <div className="flex items-start gap-2 md:gap-4">
                <div className="bg-[var(--custom-orange-200)] rounded-full p-3 group-hover:bg-[var(--custom-orange-300)] transition-colors duration-300">
                  <User className="w-6 h-6 text-[var(--custom-orange-700)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[var(--custom-orange-800)] group-hover:text-[var(--custom-orange-900)] transition-colors duration-300">
                    {doctor.name}
                  </h3>
                  <p className="mt-3 text-sm text-[var(--custom-orange-700)] line-clamp-2">
                    {doctor.desc ? doctor.desc : "No description available."}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[var(--custom-orange-700)]">
                      <Phone className="w-4 h-4" />
                      <span>{doctor.mobile}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--custom-orange-700)]">
                      <Mail className="w-4 h-4" />
                      <span>{doctor.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-[var(--custom-orange-300)] mx-auto mb-4" />
          <p className="text-xl font-semibold text-[var(--custom-orange-700)]">
            No doctors available at the moment.
          </p>
          <p className="mt-2 text-[var(--custom-orange-600)]">
            Please check back later or contact support for assistance.
          </p>
        </div>
      )}
    </div>
  );
};

// Step 2: Booking Form Component
const BookingFormStep = ({
  formData,
  handleChange,
  onSubmit,
  onBack,
  selectedDoctor,
}) => {
  return (
    <div className="bg-gradient-to-b from-[var(--custom-orange-50)] to-white w-full max-w-[1200px] p-8 rounded-[20px] border-2 border-[var(--custom-orange-200)] shadow-xl">
      <div className="flex items-center justify-center gap-3 mb-8">
        <Stethoscope className="w-8 h-8 text-[var(--custom-orange-500)]" />
        <h2 className="text-center text-3xl font-bold text-[var(--custom-orange-500)] uppercase">
          Booking Details
        </h2>
      </div>

      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--custom-orange-100)] rounded-full">
          <User className="w-5 h-5 text-[var(--custom-orange-700)]" />
          <span className="text-[var(--custom-orange-800)] font-medium">
            {selectedDoctor.name}
          </span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group">
            <label className="flex items-center gap-2 text-[var(--custom-orange-800)] font-medium mb-2">
              <User className="w-4 h-4" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-[var(--custom-orange-200)] focus:border-[var(--custom-orange-400)] focus:ring-2 focus:ring-[var(--custom-orange-200)] transition-all duration-200 outline-none"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="group">
            <label className="flex items-center gap-2 text-[var(--custom-orange-800)] font-medium mb-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-[var(--custom-orange-200)] focus:border-[var(--custom-orange-400)] focus:ring-2 focus:ring-[var(--custom-orange-200)] transition-all duration-200 outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="group">
            <label className="flex items-center gap-2 text-[var(--custom-orange-800)] font-medium mb-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-[var(--custom-orange-200)] focus:border-[var(--custom-orange-400)] focus:ring-2 focus:ring-[var(--custom-orange-200)] transition-all duration-200 outline-none"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="group">
            <label className="flex items-center gap-2 text-[var(--custom-orange-800)] font-medium mb-2">
              <Calendar className="w-4 h-4" />
              <Clock className="w-4 h-4" />
              Preferred Date & Time
            </label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-[var(--custom-orange-200)] focus:border-[var(--custom-orange-400)] focus:ring-2 focus:ring-[var(--custom-orange-200)] transition-all duration-200 outline-none"
              required
            />
          </div>
        </div>

        <div className="group">
          <label className="flex items-center gap-2 text-[var(--custom-orange-800)] font-medium mb-2">
            <FileText className="w-4 h-4" />
            Brief Note about Your Problem
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-[var(--custom-orange-200)] focus:border-[var(--custom-orange-400)] focus:ring-2 focus:ring-[var(--custom-orange-200)] transition-all duration-200 outline-none min-h-[150px] resize-y"
            placeholder="Please describe your symptoms or concerns..."
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-[var(--custom-orange-200)]">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white border-2 border-[var(--custom-orange-400)] text-[var(--custom-orange-600)] font-semibold hover:bg-[var(--custom-orange-50)] transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Doctors
          </button>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-[var(--custom-orange-500)] text-white font-semibold hover:bg-[var(--custom-orange-600)] transform hover:scale-[1.02] transition-all duration-200"
          >
            <Check className="w-4 h-4" />
            Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};
