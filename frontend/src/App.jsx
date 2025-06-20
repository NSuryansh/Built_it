import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { messaging, getToken } from "./firebase";
import { getMessaging, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import Landing from "./pages/user/landing";
import Peer from "./pages/user/peer";
import Mood from "./pages/user/mood";
import Book from "./pages/user/book";
import Stress from "./pages/user/stress";
import Entertainment from "./pages/user/entertainment";
import Dinogame from "./pages/user/dino";
import Events from "./pages/user/events";
import Login from "./pages/user/login";
import SignUp from "./pages/user/signup";
import ResetPassword from "./pages/user/reset_password";
import ModifyProfile from "./pages/user/modify_profile";
import UserAppointments from "./pages/user/appointments";
import FeedbackPage from "./pages/user/feedback";
import Dashboard from "./pages/user/dashboard";
import DoctorLogin from "./pages/doctor/login";
import DoctorResetPassword from "./pages/doctor/reset_password";
import DoctorDashboard from "./pages/doctor/dashboard";
import DoctorProfile from "./pages/doctor/profile";
import DoctorAppointment from "./pages/doctor/appointments";
import DoctorPeer from "./pages/doctor/peer";
import DoctorLeave from "./pages/doctor/leave";
import DoctorBook from "./pages/doctor/book";
import History from "./pages/doctor/history";
import UserDetail from "./pages/doctor/user";
import AdminLogin from "./pages/admin/login";
import AdminResetPassword from "./pages/admin/reset_password";
import AdminDashboard from "./pages/admin/dashboard";
import DoctorsList from "./pages/admin/doctor_list";
import AdminDoctorProfile from "./pages/admin/doctor_profile";
import EventsList from "./pages/admin/event_list";
import AddEvent from "./pages/admin/add_event";
import AddDoctor from "./pages/admin/add_doctor";
import AdminAppointments from "./pages/admin/appointments";
import ErrorBoundaryFallback from "./pages/easter_egg/error_boundary_fallback";
import AdminUser from "./pages/admin/user";
import LoadingPage from "./pages/sso/loading_page";

export default function App() {
  const SERVER_KEY = import.meta.env.VITE_PUBLIC_VAPID_KEY;

  //   const firebaseConfig = {
  //     apiKey: "AIzaSyAmaUTaZr1rp_2kYzu4jEOo859YEA4OVls",
  //     authDomain: "vitality-71a0e.firebaseapp.com",
  //     projectId: "vitality-71a0e",
  //     messagingSenderId: "908490427241",
  //     appId: "1:908490427241:web:e4b7f255fddae0f4cb4bf8",
  //   };

  //   const app = initializeApp(firebaseConfig);
  // const messaging = getMessaging(app);

  // onMessage(messaging, (payload) => {
  //   console.log('Foreground message received:', payload);
  //   if (Notification.permission === "granted") {
  //     new Notification(payload.notification.title, {
  //       body: payload.notification.body,
  //       icon: '/icon.png',
  //     });
  //   }
  // });

  onMessage(messaging, async (payload) => {
    console.log("Foreground message received:", payload);

    if (Notification.permission === "granted" && "serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        registration.showNotification(payload.notification.title, {
          body: payload.notification.body,
          icon: "https://res.cloudinary.com/dt7a9meug/image/upload/v1745488000/final-logo_l1fg7i.jpg",
        });
        console.log("sent");
      } else {
        console.error("No service worker registration found.");
      }
    }
  });

  const [type, setType] = useState(null);
  const userType = localStorage.getItem("user_type");

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = atob(base64);
    return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
  };

  useEffect(() => {
    setType(localStorage.getItem("userType"));
  }, []);
  const convertedVapidKey = urlBase64ToUint8Array(SERVER_KEY);

  const subscribeToPush = async (userid, userType) => {
    // await requestNotificationPermission();

    const registration = await navigator.serviceWorker.ready;

    const fcmToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_PUBLIC_VAPID_KEY,
    });

    if (fcmToken) {
      console.log("FCM Token:", fcmToken);

      const res = await fetch(
        "http://localhost:3000/common/save-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: userid,
            subscription: fcmToken,
            userType: userType,
          }),
        }
      );
    }

    // return subscription;
  };

  // useEffect(() => {
  //   const userid = localStorage.getItem("userid");
  //   const userType = localStorage.getItem("userType")
  //   if (userid) {
  //     subscribeToPush(userid, userType);
  //   }
  // }, []);

  const requestNotificationPermission = async (userid, userType) => {
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
    subscribeToPush(userid, userType);
  };

  useEffect(() => {
    setTimeout(() => {
      const userid = localStorage.getItem("userid");
      const userType = localStorage.getItem("user_type");
      console.log(userType, "USER type");
      requestNotificationPermission(userid, userType);
    }, 4000);
  }, [type]);

  return (
    <div className={`min-h-screen h-full flex flex-col ${"bg-white"}`}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/sso" element={<LoadingPage />} />
        <Route path="/user/peer" element={<Peer />} />
        <Route path="/user/mood" element={<Mood />} />
        <Route path="/user/book" element={<Book />} />
        <Route path="/user/stress" element={<Stress />} />
        <Route path="/user/entertainment" element={<Entertainment />} />
        <Route path="/user/entertainment/dinogame" element={<Dinogame />} />
        <Route path="/user/events" element={<Events />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/signup" element={<SignUp />} />
        <Route path="/user/reset_password" element={<ResetPassword />} />
        <Route path="/user/modify_profile" element={<ModifyProfile />} />
        <Route path="/user/appointments" element={<UserAppointments />} />
        <Route path="/user/feedback" element={<FeedbackPage />} />
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route
          path="/doctor/reset_password"
          element={<DoctorResetPassword />}
        />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
        <Route path="/doctor/appointments" element={<DoctorAppointment />} />
        <Route path="/doctor/peer" element={<DoctorPeer />} />
        <Route path="/doctor/leave" element={<DoctorLeave />} />
        <Route path="/doctor/book" element={<DoctorBook />} />
        <Route path="/doctor/history" element={<History />} />
        <Route path="/doctor/user" element={<UserDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/reset_password" element={<AdminResetPassword />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/doctor_list" element={<DoctorsList />} />
        <Route path="/admin/doctor_profile" element={<AdminDoctorProfile />} />
        <Route path="/admin/event_list" element={<EventsList />} />
        <Route path="/admin/add_event" element={<AddEvent />} />
        <Route path="/admin/add_doctor" element={<AddDoctor />} />
        <Route path="/admin/user" element={<AdminUser />} />
        <Route path="/admin/appointments" element={<AdminAppointments />} />
        <Route
          path="/easter_egg"
          element={<ErrorBoundaryFallback userType={userType} />}
        />
      </Routes>
    </div>
  );
}
