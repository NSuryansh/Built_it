import Peer from "./pages/Peer";
import Entertainment from "./pages/Entertainment";
import Mood from "./pages/Mood";
import Book from "./pages/Book";
import Landing from "./pages/Landing";
import Dinogame from "./pages/dino";
import Landing_user from "./pages/Landing_user";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import { Route, Routes } from "react-router-dom";
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
import AdminDoctorProfile from "./pages/admin/admin_doctor_profile";
import Stress from "./pages/stress";
import Events from "./pages/Events";
import ModifyProfile from "./pages/Modify_profile";
import ResetPassword from "./pages/ResetPassword";
import DoctorResetPassword from "./pages/doctor/ResetPassword_doctor";
import AdminResetPassword from "./pages/admin/admin_reset_password";
import { useEffect } from "react";

export default function App() {
  const SERVER_KEY = import.meta.env.VITE_PUBLIC_VAPID_KEY;

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = atob(base64);
    return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
  };

  const convertedVapidKey = urlBase64ToUint8Array(SERVER_KEY);

  const subscribeToPush = async () => {
    console.log(SERVER_KEY);
    console.log(import.meta.env);
    console.log(convertedVapidKey)
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });
    console.log("Push Subscription:", JSON.stringify(subscription));

    // saveSubscription(subscription)
    const res = await fetch("https://built-it-xjiq.onrender.com/save-subscription", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: { "Content-Type": "application/json" },
    });

    const resp = await res.json();

    // console.log(resp)
    // console.log(resp);

    // const res2 = await fetch("http:/built-it-xjiq.onrender.com/send-notification", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     message:"HI
    //   }),
    //   headers:{"Content-type":"Application/json"}
    // });
    // const data = await res2.json();
    // console.log("Notification Response:", data);
    // return subscription;
  };

  const requestNotificationPermission = async () => {
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");
      } else {
        console.log("Notification permission denied.");
      }
    }
    subscribeToPush();
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className={`min-h-screen h-full flex flex-col ${"bg-white"}`}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/peer" element={<Peer />} />
        <Route path="/mood" element={<Mood />} />
        <Route path="/book" element={<Book />} />
        <Route path="/stress" element={<Stress />} />
        <Route path="/entertainment" element={<Entertainment />} />
        <Route path="/entertainment/dinogame" element={<Dinogame />} />
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
        <Route path="/admin/doctor_profile" element={<AdminDoctorProfile />} />
        <Route path="/admin/event_list" element={<EventsList />} />
        <Route path="/admin/add_event" element={<AddEvent />} />
        <Route path="/admin/add_doctor" element={<AddDoctor />} />
      </Routes>
    </div>
  );
}
