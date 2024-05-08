// pages/index.tsx


import React from "react";
import SideBar from "../components/SideBar";
import MainContent from "../components/MainContent";
import PomodoroApp from "../components/Pomodoro";

const HomePage = () => {
  return (
    <>
    <SideBar />
    <div className="flex justify-center items-center bg-black">
      <PomodoroApp />
    </div>
    </>
  );
};

export default HomePage;
