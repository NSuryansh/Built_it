import React from "react";

export default function Landing() {
    return (
        <div className="flex flex-col items-center justify-center mt-[70px]">
            <div
                className="text-[60px] font-extrabold text-[var(--landing-text-orange)]" >
                CalmNest
            </div>
            <div
                className="text-[50px] font-bold mt-2 text-[var(--landing-text-black)]">
                Find Peace - Get Support - Thrive
            </div>
            <div
                className="text-[40px] mt-2 flex flex-col items-center text-[var(--landing-text-black)]">
                <p>At CalmNest we provide a safe space for your mental welness journey.</p>
                <p>Wheather you are seeking mindfulness techniques, emotional support, or expert</p>
                <p>guidance, we are here to help</p>
            </div>
            <button className="border-black">Get Started</button>

            <img src="/assests/plates.png" alt="" className="h-[180px]"/>
        </div>
    )
}