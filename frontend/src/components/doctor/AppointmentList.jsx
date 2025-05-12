import React, { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarClock, FileText, Clock } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const AppointmentList = ({ onFollowUp }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const token = localStorage.getItem("token");
  const [appointments, setappointments] = useState([]);

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  useEffect(() => {
    const getAppointments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getAppointmentForDoctorUser?userId=${userId}&docId=${localStorage.getItem(
            "userid"
          )}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.json();
        console.log(data);
        setappointments(data);
      } catch (error) {
        console.error(error);
      }
    };
    getAppointments();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <CalendarClock className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">
          Appointment History ({appointments.length})
        </h3>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <p className="text-gray-500">No appointment history found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.forEach((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="bg-violet-100 p-2 rounded-lg">
                    <Clock className="h-4 w-4 text-violet-600" />
                  </div>
                  <p className="font-medium text-violet-900">
                    {format(parseISO(appointment.createdAt), "dd MMM yyyy")}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs rounded-full ${
                    appointment.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : appointment.status === "scheduled"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {appointment.status || "Completed"}
                </span>
              </div>

              <div className="mt-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-emerald-100 p-2 rounded-lg mt-0.5">
                    <FileText className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </h4>
                    <p
                      className={`text-sm text-gray-600 ${
                        expandedId !== appointment.id &&
                        appointment.note.length > 100
                          ? "line-clamp-2"
                          : ""
                      }`}
                    >
                      {appointment.note}
                    </p>
                    {appointment.note.length > 100 && (
                      <button
                        onClick={() => toggleExpanded(appointment.id)}
                        className="text-blue-500 text-xs mt-1 hover:text-blue-700 transition-colors"
                      >
                        {expandedId === appointment.id
                          ? "Show less"
                          : "Show more"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => onFollowUp(appointment)}
                  className="px-3 py-1.5 bg-blue-100 text-blue-600 text-sm rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                >
                  Schedule Follow-up
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
