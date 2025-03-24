import Peer from "./pages/Peer";
import Mood from "./pages/Mood";
import Book from "./pages/Book";
import Landing from "./pages/Landing";
import Landing_user from "./pages/Landing_user";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import { Route, Routes, useLocation } from "react-router-dom";
import DoctorLogin from "./pages/doctor/Login";
import DoctorSignUp from "./pages/doctor/Signup";
import DoctorLanding from "./pages/doctor/Landing";
import DoctorAppointment from "./pages/doctor/Appointment";
import DoctorProfile from "./pages/doctor/Profile";

export default function App() {
  const location = useLocation();
  const isBackgroundPage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/doctor_login" ||
    location.pathname === "/doctor_signup" ||
    location.pathname === "/signup" ||
    location.pathname === "/book";

  return (
    <div
      className={`h-screen flex flex-col ${
        isBackgroundPage ? "bg-cover" : "bg-white"
      }`}
      style={
        isBackgroundPage
          ? { backgroundImage: "url('/assests/Pexels Photo by Loc Dang.png')" }
          : {}
      }
    >
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/peer" element={<Peer />} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/book" element={<Book />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Landing_user />} />
        <Route path="/doctor_login" element={<DoctorLogin />} />
        <Route path="/doctor_signup" element={<DoctorSignUp />} />
        <Route path="/doctor_landing" element={<DoctorLanding />} />
        <Route path="/doctor_profile" element={<DoctorProfile />} />
        <Route path="/doctor_appointments" element={<DoctorAppointment />} />
      </Routes>
    </div>
  );
}
