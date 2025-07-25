import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import CustomToast from "../common/CustomToast";

const ProgressPage = ({ isLandingPage }) => {
  const [scores, setScores] = useState({});

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch("/api/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: localStorage.getItem("userid") }),
        });
        const data = await response.json();
        console.log(data.error);
        if (data.error === "User not found") {
          setScores({
            mental_health_score: 11,
            stress_score: 11,
            academic_performance_score: 11,
            sleep_quality_score: 11,
          });
        } else if (!response.ok) {
          throw new Error(`HTTP error!!!!! status: ${response.status}`);
        } else {
          // const data = await response.json();
          // console.log(data);
          setScores({
            mental_health_score: data.mental_health_score || 0,
            stress_score: 10 - data.stress_score || 0,
            academic_performance_score: data.academic_performance_score || 0,
            sleep_quality_score: data.sleep_quality_score || 0,
          });
        }
      } catch (error) {
        console.log(error);
        // if(data.error == "User not found"){
        //     setScores({
        //     mental_health_score: 0,
        //     stress_score: 0,
        //     academic_performance_score:  0,
        //     sleep_quality_score: 0,
        //   });}else{
        console.error("Error in fetching scores: ", error.message);
        CustomToast("Error while fetching scores");
        // }
      }
    };

    fetchScores();
  }, []);

  const calculateHappinessScore = () => {
    const scoreValues = Object.values(scores);
    if (scoreValues.length === 0) return 0;
    const filteredScores = scoreValues.filter((score) => score !== 11);
    const total = filteredScores.reduce((sum, value) => sum + value, 0);
    return Math.round(total / filteredScores.length);
  };

  return (
    <div className="bg-[var(--custom-white)] h-full rounded-2xl shadow-lg">
      <div
        className={
          isLandingPage
            ? "rounded-2xl p-4 sm:p-8 md:p-4 bg-[var(--custom-white)]"
            : "p-4 bg-[var(--custom-peach)]"
        }
      >
        <h2
          className={
            isLandingPage
              ? "text-2xl font-bold text-[var(--custom-black)]"
              : "text-2xl font-bold text-[var(--custom-orange-500)]"
          }
        >
          {isLandingPage ? "Your Happiness Score" : "Your Feelings"}
        </h2>
      </div>

      <div className="p-8 pt-5 flex justify-center items-center w-full">
        <div className="max-w-2xl w-full">
          <ProgressBar
            label="Mental Health"
            value={scores.mental_health_score}
          />
          <ProgressBar label="Stress" value={scores.stress_score} />
          <ProgressBar
            label="Academics"
            value={scores.academic_performance_score}
          />
          <ProgressBar
            label="Sleep Quality"
            value={scores.sleep_quality_score}
          />

          <div className="mt-8 text-center">
            <div className="text-6xl font-bold text-[var(--custom-gray-800)] mb-2">
              {calculateHappinessScore()}
            </div>
            <div className="text-[var(--custom-gray-600)]">
              Your Happiness Score
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
