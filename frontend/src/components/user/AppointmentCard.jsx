import { format } from "date-fns";
import { User, Calendar, CheckCircle, ArrowRight } from "lucide-react";
import { TimeChange } from "../common/TimeChange";
import { useRouter } from "next/navigation";

const AppointmentCard = ({
  appointment,
  feedbackSubmitted,
  upcoming = true,
}) => {
  const router = useRouter();

  const handleAppointmentClick = () => {
    if (upcoming === false && feedbackSubmitted === false) {
      router.push(`/user/feedback?id=${appointment.id}`);
    }
  };

  const hasFeedback = feedbackSubmitted;

  return (
    <div
      onClick={handleAppointmentClick}
      className={`bg-[var(--custom-gray-50)] bg-opacity-80 rounded-xl p-6 transition-all duration-300 
        ${
          !upcoming && !hasFeedback
            ? "hover:bg-[var(--custom-gray-100)] hover:shadow-md cursor-pointer"
            : ""
        }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
        <div className="flex items-center space-x-5">
          <div className="bg-[var(--custom-white)] p-1 rounded-full shadow-md">
            {upcoming ? (
              appointment.doctor.img != null ? (
                <img
                  src={appointment.doctor.img}
                  className="w-10 h-10 object-cover rounded-full"
                />
              ) : (
                <User className="h-7 w-7 text-[var(--custom-gray-600)]" />
              )
            ) : appointment.doc.img != null ? (
              <img
                src={appointment.doc.img}
                className="h-10 w-10 object-cover rounded-full"
              />
            ) : (
              <User className="h-10 w-10 text-[var(--custom-gray-600)]" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-[var(--custom-orange-900)] text-lg">
              {upcoming ? appointment.doctor.name : appointment.doc.name}
            </h3>
            <p className="text-sm text-[var(--custom-gray-600)] mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {format(
                upcoming
                  ? TimeChange(new Date(appointment.dateTime).getTime())
                  : appointment.createdAt,
                "dd MMM yyyy, h:mm a"
              )}
            </p>
            <p className="text-xs text-[var(--custom-gray-500)] mt-1">
              {upcoming ? appointment.doctor.desc : appointment.doc.desc}
            </p>
          </div>
        </div>
        <div className="flex items-center self-center gap-4">
          {upcoming === false ? (
            hasFeedback ? (
              <span className="text-[var(--custom-green-600)] font-semibold text-sm flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Feedback Submitted
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/user/feedback/${appointment.id}`);
                }}
                className="bg-[var(--custom-orange-500)] text-[var(--custom-white)] px-4 py-2 rounded-md text-sm font-semibold 
                  hover:-translate-y-[1.5px] transition-all duration-200 flex items-center gap-2"
              >
                Give Feedback <ArrowRight className="w-4 h-4" />
              </button>
            )
          ) : (
            <span className="bg-[var(--custom-blue-100)] text-[var(--custom-blue-800)] px-3 py-1 rounded-full text-sm font-medium">
              Upcoming
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
