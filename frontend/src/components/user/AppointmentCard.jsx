import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { User, Calendar, CheckCircle, ArrowRight } from "lucide-react";
import { TimeChange } from "../common/TimeChange";

const REASONS = [
  "Man nahi kar raha ab",
  "backchodi kar raha tha haahhaha",
  "Nahi aunga jao jo karna karo",
  "None of the above",
];

const AppointmentCard = ({
  appointment,
  feedbackSubmitted,
  upcoming = true,
  requested = false,
  onAccepted,
  onRejected,
}) => {
  const navigate = useNavigate();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [error, setError] = useState("");

  const handleAppointmentClick = () => {
    if (
      upcoming === false &&
      requested === false &&
      feedbackSubmitted === false
    ) {
      navigate(`/user/feedback?id=${appointment.id}`);
    }
  };

  const hasFeedback = feedbackSubmitted;
  const doctor = appointment.doctor || appointment.doc || {};

  const displayDate =
    upcoming || requested
      ? new Date(appointment.dateTime).getTime()
      : new Date(appointment.createdAt);

  useEffect(() => {
    if (showRejectModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [showRejectModal]);

  const openRejectModal = (e) => {
    e.stopPropagation();
    setSelectedReason("");
    setCustomReason("");
    setError("");
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setError("");
  };

  const submitRejection = () => {
    const reason =
      selectedReason === "None of the above"
        ? customReason.trim()
        : selectedReason;
    if (!reason || reason.length === 0) {
      setError("Please select or type a reason for cancelling.");
      return;
    }
    onRejected && onRejected(appointment, reason);
    setShowRejectModal(false);
  };

  return (
    <>
      <div
        onClick={handleAppointmentClick}
        className={`bg-[var(--custom-gray-50)] bg-opacity-80 rounded-xl p-6 transition-all duration-300 
        ${
          !upcoming && !requested && !hasFeedback
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
                <div className="flex items-center gap-2">
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
                </div>
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
                        openRejectModal(e);
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

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 backdrop-blur-sm"
            onClick={closeRejectModal}
          />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-md shadow-lg z-10">
            <h4 className="text-lg font-semibold mb-3">
              Reason for cancelling
            </h4>

            <label className="block text-sm font-medium mb-2">
              Select reason
            </label>
            <select
              value={selectedReason}
              onChange={(e) => {
                setSelectedReason(e.target.value);
                setError("");
              }}
              className="w-full border rounded-md px-3 py-2 mb-3"
            >
              <option value="">-- Select a reason --</option>
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {selectedReason === "None of the above" && (
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">
                  Please type your reason
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows={4}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Type the reason for cancelling..."
                />
              </div>
            )}

            {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2 rounded-md border"
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                className="px-4 py-2 rounded-md bg-[var(--custom-red-500)] text-white font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentCard;
