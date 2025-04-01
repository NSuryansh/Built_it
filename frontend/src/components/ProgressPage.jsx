import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import { toast } from "react-toastify"; // Ensure toast is imported if you're using it

const ProgressPage = ({ isLandingPage }) => {
  const [scores, setScores] = useState({});

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch("http://localhost:3000/scores-bot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: localStorage.getItem("userid") }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        setScores({
          mental_health_score: data.mental_health_score || 0,
          stress_score: data.stress_score || 0,
          academic_performance_score: data.academic_performance_score || 0,
          sleep_quality_score: data.sleep_quality_score || 0,
        });
      } catch (error) {
        console.error("Error in fetching scores: ", error.message);
        toast("Error while processing your message", {
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

    fetchScores();
  }, []);

  const calculateHappinessScore = () => {
    const scoreValues = Object.values(scores);
    if (scoreValues.length === 0) return 0;
    const filteredScores = scoreValues.filter(score => score !== 11);
    const total = filteredScores.reduce((sum, value) => sum + value, 0);
    return Math.round(total / filteredScores.length);
  };

  return (
    <div className="bg-[var(--mp-custom-white)] h-full rounded-2xl shadow-lg">
      <div
        className={
          isLandingPage
            ? "p-4 bg-[var(--custom-white)]"
            : "p-4 bg-[var(--mp-custom-peach)]"
        }
      >
        <h2
          className={
            isLandingPage
              ? "text-2xl font-bold text-[var(--custom-black)]"
              : "text-2xl font-bold text-[var(--mp-heading-text)]"
          }
        >
          {isLandingPage ? "Your Happiness Score" : "Your Feelings"}
        </h2>
      </div>

      <div className="p-8 flex justify-center items-center w-full">
        <div className="max-w-2xl w-full">
          <ProgressBar
            label="Mental Health"
            value={scores.mental_health_score}
          />
          <ProgressBar label="Stress" value={scores.stress_score} />
          <ProgressBar
            label="Academic Performance"
            value={scores.academic_performance_score}
          />
          <ProgressBar
            label="Sleep Quality"
            value={scores.sleep_quality_score}
          />

          <div className="mt-8 text-center">
            <div className="text-6xl font-bold text-[--mp-custom-gray-800] mb-2">
              {calculateHappinessScore()}
            </div>
            <div className="text-[var(--mp-custom-gray-600)]">
              Your Happiness Score
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
