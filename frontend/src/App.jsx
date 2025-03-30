import Peer from "./pages/Peer";
import Entertainment from "./pages/Entertainment";
import Mood from "./pages/Mood";
import Book from "./pages/Book";
import Landing from "./pages/Landing";
import Landing_user from "./pages/Landing_user";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import { Route, Routes, useLocation } from "react-router-dom";
import DoctorLogin from "./pages/doctor/Login_doctor";
import DoctorLanding from "./pages/doctor/Landing_doctor";
import DoctorAppointment from "./pages/doctor/Appointment_doctor";
import DoctorProfile from "./pages/doctor/Profile_doctor";
import AdminDashboard from "./pages/admin/admin_dashboard";
import AdminLogin from "./pages/admin/admin_login";
import DoctorsList from "./pages/admin/admin_doctor_list";
import EventsList from "./pages/admin/admin_event_list";
import AddEvent from "./pages/admin/admin_add_event";
import AddDoctor from "./pages/admin/admin_add_doctor";
import Appointments from "./pages/Appointments";
import Profile from './pages/admin/admin_doctor_profile'
import Stress from "./pages/stress";
import Events from "./pages/Events";
import ModifyProfile from "./pages/Modify_profile";
import ResetPassword from "./pages/ResetPassword";
import DoctorResetPassword from "./pages/doctor/ResetPassword_doctor";
import AdminResetPassword from "./pages/admin/admin_reset_password";
import { ToastContainer } from "react-toastify";
import { Profiler } from "react";

export default function App() {
  const location = useLocation();
  const isBackgroundPage = location.pathname === "/appointments";

  return (
    <div
      className={`min-h-screen h-full flex flex-col ${
        isBackgroundPage ? "bg-cover" : "bg-white"
      }`}
      style={
        isBackgroundPage
          ? { backgroundImage: "url('/assests/Pexels Photo by Loc Dang.png')" }
          : {}
      }
    >
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/peer" element={<Peer />} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/book" element={<Book />} />
        <Route path="/stress" element={<Stress />} />
        <Route path="/entertainment" element={<Entertainment />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/modify_profile" element={<ModifyProfile />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/dashboard" element={<Landing_user />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route
          path="/doctor/reset_password"
          element={<DoctorResetPassword />}
        />
        <Route path="/doctor/landing" element={<DoctorLanding />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
        <Route path="/doctor/appointments" element={<DoctorAppointment />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/reset_password" element={<AdminResetPassword />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/doctor_list" element={<DoctorsList />} />
        <Route path="/admin/doctor_profile" element={<Profile />} />
        <Route path="/admin/event_list" element={<EventsList />} />
        <Route path="/admin/add_event" element={<AddEvent />} />
        <Route path="/admin/add_doctor" element={<AddDoctor />} />
      </Routes>
    </div>
  );
}
