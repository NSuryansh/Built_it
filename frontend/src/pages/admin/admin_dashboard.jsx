import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AdminNavbar from "../../components/admin/admin_navbar";
import Footer from "../../components/Footer";
import { checkAuth } from "../../utils/profile";
import PacmanLoader from "react-spinners/PacmanLoader";
import { ToastContainer, toast } from "react-toastify";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth("admin");
      setIsAuthenticated(authStatus);
    };
    verifyAuth();
  }, []);

  const data = [
    { name: "Jan", appointments: 65 },
    { name: "Feb", appointments: 59 },
    { name: "Mar", appointments: 80 },
    { name: "Apr", appointments: 81 },
    { name: "May", appointments: 56 },
    { name: "Jun", appointments: 55 },
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          "https://built-it-xjiq.onrender.com/getdoctors"
        );
        const data = await response.json();
        console.log(data);
        setDoctors(data); // Set the state with the fetched data
      } catch (error) {
        console.log("Error fetching doctors: ", error);
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "https://built-it-xjiq.onrender.com/events"
        );
        const data = await response.json();

        const upcomingEvents = data.filter(
          (event) => new Date(event.dateTime) > new Date()
        );

        const formattedEvents = upcomingEvents.map((event) => {
          const date = new Date(event.dateTime);
          return {
            id: event.id,
            title: event.title,
            date: date.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            location: event.venue,
            type: event.description ? "Session/Conference" : "Meeting",
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events", error);
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

    fetchEvents();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <PacmanLoader color="#048a81" radius={6} height={20} width={5} />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SessionExpired handleClosePopup={handleClosePopup} />;
  }

  return (
    <div className="flex flex-col">
      <AdminNavbar />
      <ToastContainer />
      <div className="space-y-4 max-w-7xl md:min-w-5xl mx-auto mb-5">
        <h1 className="text-3xl font-bold text-center md:text-left text-[var(--custom-primary-green-900)]">
          Dashboard Overview
        </h1>

        <div className="bg-[var(--custom-white)] p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-[var(--custom-primary-green-800)] mb-4">
            Monthly Appointments
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#048A81" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex flex-row space-x-8">
          <div className="w-1/2 bg-[var(--custom-white)] p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-[var(--custom-primary-green-800)] mb-4">
              Available Doctors
            </h2>
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="p-4 bg-[var(--custom-primary-green-50)] rounded-lg"
                >
                  <h3 className="font-semibold text-[var(--custom-primary-green-900)]">
                    {doctor.name}
                  </h3>
                  <p className="text-[var(--custom-primary-green-600)]">
                    Email: {doctor.email}
                  </p>
                  <p className="text-[var(--custom-primary-green-600)]">
                    Mobile: {doctor.mobile}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-1/2 bg-[var(--custom-white)] p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-[var(--custom-primary-green-800)] mb-4">
              Upcoming Events
            </h2>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-[var(--custom-primary-green-50)] rounded-lg"
                >
                  <h3 className="font-semibold text-[var(--custom-primary-green-900)]">
                    {event.title}
                  </h3>
                  <p className="text-[var(--custom-primary-green-600)]">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer color={"green"} />
    </div>
  );
};

export default AdminDashboard;
