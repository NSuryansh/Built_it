import React from "react";
import { Link, useLocation } from "react-router-dom";

const Landing = () => {
  return (
    <div className="px-2 sm:px-4 min-h-screen flex justify-center items-center overflow-y-hidden">
      <div className="flex flex-col h-full items-center justify-center">
        <div className="text-[45px] sm:text-[55px] font-extrabold text-[var(--landing-bg-orange)]">
          Vitality
        </div>
        <div className="text-[30px] sm:text-[35px] text-center font-bold mt-2 text-[var(--landing-text-black)]">
          Find Peace - Get Support - Thrive
        </div>
        <div className="text-[15px] sm:text-[20px] text-center mt-2 flex flex-col items-center text-[var(--landing-text-black)]">
          <p>
            At Vitality we provide a safe space for your mental wellness
            journey.
          </p>
          <br />
          <p>
            Whether you are seeking mindfulness techniques, emotional support,
            or expert guidance, we are here to help
          </p>
        </div>
        <Link to="/signup">
          <button className="bg-[var(--landing-text-orange)] text-[var(--landing-text-white)] font-semibold px-6 py-2 mt-4 rounded-full shadow-md hover:bg-[var(--landing-bg-orange)] transition-colors duration-300 ease-in-out cursor-pointer">
            Get Started
          </button>
        </Link>
        <img src="/assests/plates.png" alt="" className="hidden md:block" />
      </div>
    </div>
  );
};

export default Landing;
