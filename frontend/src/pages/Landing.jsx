import React from "react";

export default function Landing() {
    return (
        <div className="flex flex-col items-center justify-center mt-[60px]">
            <div
                className="text-[60px] font-extrabold text-[var(--landing-text-orange)]" >
                CalmNest
            </div>
            <div
                className="text-[50px] font-bold mt-2 text-[var(--landing-text-black)]">
                Find Peace - Get Support - Thrive
            </div>
            <div
                className="text-[35px] mt-2 flex flex-col items-center text-[var(--landing-text-black)]">
                <p>At CalmNest we provide a safe space for your mental welness journey.</p>
                <p>Wheather you are seeking mindfulness techniques, emotional support, or expert</p>
                <p>guidance, we are here to help</p>
            </div>
            <button className="bg-[var(--landing-bg-orange)] text-white font-semibold px-6 py-2 mt-4 rounded-full shadow-md 
                   hover:bg-transparent transition-colors duration-300 ease-in-out">
                Get Started
            </button>

            <img src="/assests/plates.png" alt="" className="h-[180px]" />
        </div>
    )
}