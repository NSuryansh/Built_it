import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";

const ProgressPage = ({ isLandingPage }) => {
  const [scores, setScores] = useState({
    mentalPeace: 0,
    sleepQuality: 0,
    socialLife: 0,
    passion: 0,
    lessStress: 0,
  });

  useEffect(() => {
    const mockBackendData = {
      mentalPeace: 40,
      sleepQuality: 65,
      socialLife: 87,
      passion: 20,
      lessStress: 90,
    };

    const timeout = setTimeout(() => {
      setScores(mockBackendData);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const calculateHappinessScore = () => {
    const total = Object.values(scores).reduce((sum, value) => sum + value, 0);
    return Math.round(total / Object.keys(scores).length);
  };

  return (
    <div className="bg-[var(--mp-custom-white)] h-full rounded-2xl shadow-lg">  
      <div className={isLandingPage ? "p-4 bg-[var(--custom-white)]" : "p-4 bg-[var(--mp-custom-peach)]"}>
        <h2 className={isLandingPage ? "text-2xl font-bold text-[var(--custom-black)]" : "text-2xl font-bold text-[var(--mp-heading-text)]"}>
          {isLandingPage ? "Your Happiness Score" : "Your Feelings"}
        </h2>
      </div>

      <div className="p-8 flex justify-center items-center w-full">
        <div className="max-w-2xl w-full">
          <ProgressBar label="Mental Peace" value={scores.mentalPeace} />
          <ProgressBar label="Sleep Quality" value={scores.sleepQuality} />
          <ProgressBar label="Social Life" value={scores.socialLife} />
          <ProgressBar label="Passion" value={scores.passion} />
          <ProgressBar label="Less Stress" value={scores.lessStress} />

          <div className="mt-8 text-center">
            <div className="text-6xl font-bold text-[--mp-custom-gray-800] mb-2">
              {calculateHappinessScore()}
            </div>
            <div className="text-[var(--mp-custom-gray-600)]">Your Happiness Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
