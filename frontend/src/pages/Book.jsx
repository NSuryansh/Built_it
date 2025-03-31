import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../utils/profile";
import Navbar from "../components/Navbar";
import PacmanLoader from "react-spinners/PacmanLoader";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import DoctorSelectionStep from "../components/DoctorSelection";
import BookingFormStep from "../components/BookingForm";

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
          className: "custom-toast",
        });
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
      toast("Appointment Requested", {
        position: "bottom-right",
        autoClose: 3000,
        className: "custom-toast",
      });
      setStep(1);
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
        className: "custom-toast",
      });
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
            isAuthenticated={isAuthenticated}
          />
        )}
      </div>
      <Footer color={"orange"} />
    </div>
  );
};

export default Book;