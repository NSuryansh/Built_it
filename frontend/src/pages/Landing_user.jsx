import React from "react";
import ProgressPage from "../components/ProgressPage";
import Calender from "../components/Calender";
import EventsDisplay from "../components/EventsDisplay";
import ProgressBar from "../components/ProgressBar";

export default function Landing_user() {
    return (
        <div className="flex overflow-hidden">
            <div className="h-screen min-w-[33.33vw]"><Calender/></div>
            <div className="h-screen min-w-[33.33vw]"><ProgressPage/></div>
            <div className="h-screen min-w-[33.33vw] overflow-y-auto"><EventsDisplay/></div>
        </div>
    )
}