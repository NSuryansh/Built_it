"use client";

import { useState, useEffect, useRef } from "react";
import { checkAuth } from "@/utils/profile";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/common/Footer";
import { ToastContainer } from "react-toastify";
import DoctorSelectionStep from "@/components/user/DoctorSelection";
import BookingFormStep from "@/components/user/BookingForm";
import CustomLoader from "@/components/common/CustomLoader";
import CustomToast from "@/components/common/CustomToast";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Book = () => {
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorSelectable, setdoctorSelectable] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
    date: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const stepIndicatorRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("user");
      setIsAuthenticated(authStatus);
      console.log("isAuthenticated:", authStatus);
    };
    verifyAuth();
  }, []);

  const fetchDoctors = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "http://localhost:3000/user_admin/getdoctors?user_type=user",
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      const data = await res.json();
      setDoctors(data);
      console.log("Doctors fetched:", data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      CustomToast("Error while fetching data");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const checkPreviousBooking = async () => {
      const userId = localStorage.getItem("userid");
      const token = localStorage.getItem("token");
      if (!userId) return;

      try {
        const res = await fetch(
          `http://localhost:3000/user/isUpcomingAppointment?userId=${userId}`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        );
        const data = await res.json();
       
        if (data.hasUpcomingAppointment) {
          setdoctorSelectable(false);
          CustomToast("You already have an upcoming appointment");
        }
      } catch (err) {
        console.error("Error checking previous bookings:", err);
        CustomToast("Error checking previous bookings");
      }
    };
    checkPreviousBooking();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setFormData((prev) => ({
        ...prev,
        name: localStorage.getItem("username") || "",
        email: localStorage.getItem("user_email") || "",
        phone: localStorage.getItem("user_phone") || "",
      }));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && contentRef.current) {
      

      gsap.fromTo(
        stepIndicatorRef.current.children[0].children,
        { opacity: 0, y: -30, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.3,
          ease: "power3.out",
        }
      );
      if (step === 1) {
        const doctorCards = contentRef.current.querySelectorAll(
          "[class*='doctor'], [class*='card'], [class*='profile'], [class*='item']"
        );
        
        doctorCards.forEach((card, index) => {
          const isOdd = index % 2 !== 0;
          gsap.fromTo(
            card,
            { opacity: 0, x: isOdd ? -200 : 200, scale: 0.9 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 1.2,
              stagger: 0.5,
              ease: "power3.out",
              scrollTrigger: {
                trigger: contentRef.current,
                start: "top 70%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      }
      if (step === 2) {
        const formContainers = contentRef.current.querySelectorAll(
          "form > div, [class*='form'] > div, [class*='group'], [class*='field'], [class*='container']"
        );
        
        formContainers.forEach((container, index) => {
          const isOdd = index % 2 !== 0;
          gsap.fromTo(
            container,
            { opacity: 0, x: isOdd ? -100 : 100, scale: 0.9 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 1.1,
              stagger: 0.5,
              ease: "power3.out",
              scrollTrigger: {
                trigger: contentRef.current,
                start: "top 70%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      }
    }
  }, [isAuthenticated, step, doctors]);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);

    const lowerCaseEmail = formData.email.toLowerCase();
    const [address, domain] = lowerCaseEmail.split("@");

    if (domain != "iiti.ac.in") {
      CustomToast("Please book with your institute email id");
      setisLoading(false);
      return;
    }

    let numfound = false;
    for (let i = 0; i < address.length; i++) {
      if (address[i] >= "0" && address[i] <= "9") {
        numfound = true;
      } else if (numfound === true) {
        CustomToast("Please enter a valid email address");
        setisLoading(false);
        return;
      }
    }

    const user_id = localStorage.getItem("userid");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/user_doc/requests", {
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
    return <CustomLoader text="Loading your wellness journey..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--custom-orange-50)] via-[var(--custom-orange-100)] to-[var(--custom-orange-200)] flex flex-col overflow-hidden">
      <Navbar />
      <ToastContainer />

      <div className="flex-1 flex justify-center items-center px-2 sm:px-6 md:px-10 py-12">
        <div className="w-full max-w-full bg-[var(--custom-white)]/70 backdrop-blur-lg rounded-xl md:rounded-3xl shadow-lg px-2 py-6 md:p-10 border border-[var(--custom-orange-200)]/50 transition-all duration-500 hover:shadow-3xl">
          <div ref={stepIndicatorRef} className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold text-[var(--custom-white)] transition-all duration-300 ${
                  step === 1
                    ? "bg-[var(--custom-orange-500)] scale-110"
                    : "bg-[var(--custom-gray-300)]"
                }`}
              >
                1
              </div>
              <div className="w-16 h-1 bg-[var(--custom-gray-300)] rounded-full" />
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold text-[var(--custom-white)] transition-all duration-300 ${
                  step === 2
                    ? "bg-[var(--custom-orange-500)] scale-110"
                    : "bg-[var(--custom-gray-300)]"
                }`}
              >
                2
              </div>
            </div>
          </div>

          {step === 1 && (
            <div ref={contentRef} className="min-h-[40.5rem] flex items-center justify-center animate-fade-in">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-[var(--custom-gray-900)] mb-6">
                  Select Your Buddy
                </h2>
                <DoctorSelectionStep
                  doctors={doctors}
                  onSelect={handleDoctorSelect}
                  selectable={doctorSelectable}
                />
              </div>
            </div>
          )}
          {step === 2 && (
            <div ref={contentRef} className="min-h-[40.5rem] flex items-center justify-center animate-fade-in">
              <div className="text-center w-full">
                <h2 className="text-3xl font-bold text-[var(--custom-gray-900)] mb-6">
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

      <Footer color="orange" />
    </div>
  );
};

export default Book;