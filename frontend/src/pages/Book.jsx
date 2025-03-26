import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../utils/profile";
import Navbar from "../components/Navbar";
import SessionExpired from "../components/SessionExpired";
import PacmanLoader from "react-spinners/PacmanLoader";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";

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
    <div className="bg-[var(--custom-white)] w-full max-w-[1200px] p-8 rounded-[10px] border-2 border-[var(--custom-orange-200)]">
      <h2 className="text-center font-bold text-3xl text-[var(--custom-orange-500)] uppercase mb-8">
        Select a Doctor
      </h2>
      {doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-[var(--custom-orange-100)] p-6 rounded-xl shadow hover:shadow-lg cursor-pointer"
              onClick={() => onSelect(doctor)}
            >
              <h3 className="text-xl font-bold text-[var(--custom-orange-800)]">
                {doctor.name}
              </h3>
              <p className="mt-2 text-sm text-[var(--custom-orange-700)]">
                {doctor.desc ? doctor.desc : "No description available."}
              </p>
              <p className="mt-2 text-sm text-[var(--custom-orange-700)]">
                Mobile: {doctor.mobile}
              </p>
              <p className="mt-2 text-sm text-[var(--custom-orange-700)]">
                Email: {doctor.email}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl font-semibold text-[var(--custom-orange-700)]">
          No doctors available.
        </p>
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
    <div className="bg-[var(--custom-orange-100)] border-2 border-[var(--custom-orange-200)] w-full max-w-[1200px] p-8 rounded-[10px]">
      <h2 className="text-center text-3xl font-bold text-[var(--custom-orange-500)] uppercase mb-8">
        Booking Details for {selectedDoctor.name}
      </h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col">
          <label className="font-bold text-lg text-[var(--custom-orange-800)]">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 rounded border border-[var(--custom-orange-800)]"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-lg text-[var(--custom-orange-800)]">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 rounded border border-[var(--custom-orange-800)]"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-lg text-[var(--custom-orange-800)]">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="p-2 rounded border border-[var(--custom-orange-800)]"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-lg text-[var(--custom-orange-800)]">
            Brief Note about Your Problem
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            className="min-h-[150px] p-2 rounded border border-[var(--custom-orange-800)]"
          />
        </div>
        {/* Optional: If you want to let users choose a date */}
        <div className="flex flex-col">
          <label className="font-bold text-lg text-[var(--custom-orange-800)]">
            Preferred Date
          </label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-2 rounded border border-[var(--custom-orange-800)]"
          />
        </div>
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onBack}
            className="bg-[var(--custom-orange-900)] text-white font-bold py-2 px-4 rounded"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-[var(--custom-orange-500)] text-white font-bold py-2 px-4 rounded"
          >
            Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};
