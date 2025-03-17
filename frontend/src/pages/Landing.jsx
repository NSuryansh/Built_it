import React from "react";
import { Link, useLocation } from "react-router-dom";

const Landing = () => {
    const location = useLocation();
    return (
        <div className="flex flex-col items-center justify-center mt-[60px]">
            <div className="text-[60px] font-extrabold text-[var(--landing-text-orange)]">
                CalmNest
            </div>
            <div className="text-[50px] font-bold mt-2 text-[var(--landing-text-black)]">
                Find Peace - Get Support - Thrive
            </div>
            <div className="text-[35px] mt-2 flex flex-col items-center text-[var(--landing-text-black)]">
                <p>At CalmNest we provide a safe space for your mental wellness journey.</p>
                <p>Whether you are seeking mindfulness techniques, emotional support, or expert</p>
                <p>guidance, we are here to help</p>
            </div>
            <Link to="/signup">
                <button className="bg-[var(--landing-text-orange)] text-[var(--landing-text-white)] font-semibold px-6 py-2 mt-4 rounded-full shadow-md hover:bg-[var(--landing-bg-orange)] transition-colors duration-300 ease-in-out cursor-pointer">
                    Get Started
                </button>
            </Link>
            <img src="/assests/plates.png" alt="" className="h-[180px]" />
        </div>
    );
}

export default Landing;
