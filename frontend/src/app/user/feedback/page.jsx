"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  ArrowLeft,
  User,
  Calendar,
  CheckCircle,
  Star,
  Clock,
  Loader,
} from "lucide-react";
import CustomToast from "@/components/common/CustomToast";
import { useRouter, useSearchParams } from "next/navigation";
import CustomLoader from "@/components/common/CustomLoader";

const StarRating = ({ value, onChange, label }) => {
  return (
    <div className="flex flex-col items-center">
      {label && <p className="mb-2 text-sm text-custom-gray-600">{label}</p>}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none transition-all duration-150"
          >
            <Star
              className={`w-8 h-8 ${
                star <= value
                  ? "fill-custom-orange-500 text-custom-orange-500"
                  : "text-custom-gray-300"
              } transition-all duration-200 hover:scale-110`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const FeedbackPage = () => {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("id");
  const router = useRouter();
  const token = localStorage.getItem("token");
  const [appointment, setAppointment] = useState(null);
  const [isFetching, setisFetching] = useState(true);
  const [doc, setdoc] = useState(null);
  const questions = [
    {
      id: "q1",
      text: "How satisfied are you with the counselling session you received?",
      type: "radio",
      options: [
        "Very Unsatisfied",
        "Unsatisfied",
        "Moderate",
        "Satisfied",
        "Very Satisfied",
      ],
    },
    {
      id: "q2",
      text: "Did the counsellor listen to your concerns and address them effectively?",
      type: "radio",
      options: [
        "Very Unsatisfied",
        "Unsatisfied",
        "Moderate",
        "Satisfied",
        "Very Satisfied",
      ],
    },
    {
      id: "q3",
      text: "Was the environment comfortable and convenient for you?",
      type: "radio",
      options: ["Yes, completely", "Somewhat", "No, not at all"],
    },
    {
      id: "q4",
      text: "What did you find most helpful about your session?",
      type: "text",
    },
    {
      id: "q5",
      text: "Is there anything you feel could be improved for future sessions?",
      type: "text",
    },
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const [rating, setRating] = useState(3);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);

  const getAppointmentById = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/user/getAppointmentById?id=${appointmentId}`,
        { headers: { Authorization: "Bearer " + token } }
      );
      const data = await res.json();
      const res2 = await fetch(
        `http://localhost:3000/common/getDoc?docId=${data.doc_id}`,
        { headers: { Authorization: "Bearer " + token } }
      );
      const data2 = await res2.json();
      setAppointment(data);
      setdoc(data2.doctor);
      setisFetching(false);
    } catch (e) {
      CustomToast("Error fetching appointment");
      setisFetching(false);
      router.push("/user/appointments");
    }
  };

  useEffect(() => {
    getAppointmentById();
  }, []);

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const submitFeedback = async () => {
    setisSubmitting(true);
    try {
      const res = await fetch("http://localhost:3000/user/setFeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          id: appointmentId,
          stars: rating,
          doctorId: doc.id,
          question1: answers["q1"],
          question2: answers["q2"],
          question3: answers["q3"],
          question4: answers["q4"],
          question5: answers["q5"],
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          router.push("/user/appointments");
        }, 3000);
      } else {
        console.error("Failed to submit rating");
        CustomToast("Failed to submit rating");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      CustomToast("Failed to submit rating");
    }
    setisSubmitting(false);
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case "radio":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label
                key={option}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={() => handleAnswerChange(question.id, option)}
                  className="form-radio h-5 w-5 text-custom-orange-500"
                />
                <span className="text-custom-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      case "text":
        return (
          <textarea
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            rows={4}
            className="w-full p-3 border border-custom-gray-300 rounded-lg focus:ring-2 focus:ring-custom-orange-300 focus:border-transparent transition duration-200"
            placeholder="Your answer..."
          />
        );
      default:
        return null;
    }
  };

  if (isFetching) {
    return <CustomLoader text={"Loading your wellness journey..."} />;
  }

  return (
    <div className="page-transition py-6 max-w-3xl mx-auto">
      {submitted ? (
        <div className="bg-custom-white rounded-2xl shadow-xl p-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-custom-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-custom-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-custom-gray-800 mb-4">
            Thank You for Your Feedback!
          </h2>
          <p className="text-custom-gray-600 mb-8">
            Your feedback helps us improve our services.
          </p>
          <p className="text-sm text-custom-gray-500">
            Redirecting to appointments page...
          </p>
        </div>
      ) : (
        <>
          <button
            onClick={() => router.push("/user/appointments")}
            className="flex items-center text-custom-orange-600 mb-6 hover:text-custom-orange-700 transition duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Appointments
          </button>

          <div className="bg-custom-white rounded-2xl shadow-lg p-6 mb-8 border border-custom-orange-100">
            <div className="flex items-start gap-4">
              <div className="bg-custom-orange-100 h-[72px] w-[72px] rounded-full">
                {doc.img != null ? (
                  <img src={doc.img} className="h-full w-full rounded-full" />
                ) : (
                  <User className="h-10 w-10 text-custom-orange-600" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-custom-orange-900">
                  {doc.name}
                </h2>
                <p className="text-custom-gray-600">{doc.desc}</p>
                <div className="flex items-center gap-6 mt-3">
                  <p className="text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-custom-gray-500" />
                    {format(appointment.createdAt, "dd MMM yyyy")}
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4 text-custom-gray-500" />
                    {format(appointment.createdAt, "h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {currentStep === 0 && (
            <div className="bg-custom-white rounded-2xl shadow-md p-8 mb-8 feedback-question">
              <h3 className="text-xl font-bold text-center text-custom-orange-800 mb-6">
                How was your overall experience?
              </h3>
              <StarRating
                value={rating}
                onChange={setRating}
                label="Rate your overall experience"
              />
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNext}
                  className="bg-custom-orange-500 text-custom-white px-6 py-2 rounded-md font-semibold shadow-sm hover:bg-custom-orange-600 transition-all duration-200 hover:-translate-y-[1.5px] focus:outline-none focus:ring-2 focus:ring-custom-orange-300 focus:ring-opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {currentStep > 0 && currentStep <= questions.length && (
            <div className="bg-custom-white rounded-2xl shadow-md p-8 mb-8 feedback-question">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-custom-orange-800">
                  Question {currentStep} of {questions.length}
                </h3>
                <span className="text-sm text-custom-gray-500">
                  {Math.round((currentStep / questions.length) * 100)}% Complete
                </span>
              </div>

              <div className="h-2 w-full bg-custom-gray-200 rounded-full mb-8">
                <div
                  className="h-2 bg-custom-orange-500 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${(currentStep / questions.length) * 100}%`,
                  }}
                ></div>
              </div>

              <p className="text-lg mb-6">{questions[currentStep - 1].text}</p>

              {renderQuestion(questions[currentStep - 1])}

              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevious}
                  className="bg-custom-gray-100 text-custom-gray-700 px-6 py-2 rounded-md font-semibold shadow-sm hover:bg-custom-gray-200 transition-all duration-200 hover:-translate-y-[1.5px] focus:outline-none focus:ring-2 focus:ring-custom-gray-300 focus:ring-opacity-50"
                >
                  Previous
                </button>

                {currentStep < questions.length ? (
                  <button
                    onClick={handleNext}
                    className="bg-custom-orange-500 text-custom-white px-6 py-2 rounded-md font-semibold shadow-sm hover:bg-custom-orange-600 transition-all duration-200 hover:-translate-y-[1.5px] focus:outline-none focus:ring-2 focus:ring-custom-orange-300 focus:ring-opacity-50"
                    disabled={!answers[questions[currentStep - 1].id]}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={submitFeedback}
                    disabled={isSubmitting}
                    className="bg-custom-orange-500 text-custom-white px-6 py-2 rounded-md font-semibold shadow-sm hover:bg-custom-orange-600 transition-all duration-200 hover:-translate-y-[1.5px] focus:outline-none focus:ring-2 focus:ring-custom-orange-300 focus:ring-opacity-50"
                  >
                    {isSubmitting ? <Loader /> : <div>Submit Feedback</div>}
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeedbackPage;
