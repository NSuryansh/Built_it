import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { User, Calendar, CheckCircle, ArrowRight } from "lucide-react";
import { TimeChange } from "../common/TimeChange";

const AppointmentCard = ({
  appointment,
  feedbackSubmitted,
  upcoming = true,
  requested = false,
  onAccepted,
  onRejected
}) => {
  const navigate = useNavigate();

  const handleAppointmentClick = () => {
    // only navigate to feedback screen for past appointments with no feedback
    if (upcoming === false && requested === false && feedbackSubmitted === false) {
      navigate(`/user/feedback?id=${appointment.id}`);
    }
  };

  const hasFeedback = feedbackSubmitted;
  const doctor = appointment.doctor || appointment.doc || {};

  const displayDate = (upcoming || requested)
    ? TimeChange(new Date(appointment.dateTime).getTime())
    : new Date(appointment.createdAt);

  return (
    <div
      onClick={handleAppointmentClick}
      className={`bg-[var(--custom-gray-50)] bg-opacity-80 rounded-xl p-6 transition-all duration-300 
        ${!upcoming && !requested && !hasFeedback
          ? "hover:bg-[var(--custom-gray-100)] hover:shadow-md cursor-pointer"
          : ""
        }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
        <div className="flex items-center space-x-5">
          <div className="bg-[var(--custom-white)] p-1 rounded-full shadow-md">
            {doctor?.img ? (
              <img
                src={doctor.img}
                alt={doctor?.name || "doctor"}
                className="w-10 h-10 object-cover rounded-full"
              />
            ) : (
              <User className="h-7 w-7 text-[var(--custom-gray-600)]" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-[var(--custom-orange-900)] text-lg">
              {doctor?.name || "Unknown Doctor"}
            </h3>
            <p className="text-sm text-[var(--custom-gray-600)] mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {format(new Date(displayDate), "dd MMM yyyy, h:mm a")}
            </p>
            <p className="text-xs text-[var(--custom-gray-500)] mt-1">
              {doctor?.desc}
            </p>
          </div>
        </div>
        <div className="flex items-center self-center gap-4">
          {upcoming === false && requested === false ? (
            hasFeedback ? (
              <span className="text-[var(--custom-green-600)] font-semibold text-sm flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Feedback Submitted
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/user/feedback/${appointment.id}`);
                }}
                className="bg-[var(--custom-orange-500)] text-[var(--custom-white)] px-4 py-2 rounded-md text-sm font-semibold 
                  hover:-translate-y-[1.5px] transition-all duration-200 flex items-center gap-2"
              >
                Give Feedback <ArrowRight className="w-4 h-4" />
              </button>
            )
          ) : (
            <div className="flex items-center gap-2">
              {upcoming ? (
                <span className="bg-[var(--custom-blue-100)] text-[var(--custom-blue-800)] px-3 py-1 rounded-full text-sm font-medium">
                  Upcoming
                </span>
              ) : appointment.forDoctor ? (
                <span className="bg-[var(--custom-yellow-100)] text-[var(--custom-yellow-800)] px-3 py-1 rounded-full text-sm font-medium">
                  Requested
                </span>
              ) : (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAccepted && onAccepted(appointment);
                    }}
                    className="bg-[var(--custom-green-500)] text-white px-3 py-1 rounded-md text-sm font-semibold hover:opacity-90"
                  >
                    Accept
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRejected && onRejected(appointment);
                    }}
                    className="bg-[var(--custom-red-500)] text-white px-3 py-1 rounded-md text-sm font-semibold hover:opacity-90"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
