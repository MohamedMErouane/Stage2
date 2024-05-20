"use client"
import React from "react";
import SideBar from "../components/SideBar";
import ActualiteDashboard from "../components/ActualiteDashboard";
import Pomodoro from "../components/Pomodoro";
import { useSession } from 'next-auth/react';

const HomePage: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-gray-800 text-white px-4 py-8">
        <SideBar />
      </div>
      {/* Main content area */}
      <div className="flex-grow flex">
        {/* Pomodoro in top right corner */}
        <div className="fixed top-0 right-0 p-4">
          <div className="p-8 rounded-md bg-white">
            <Pomodoro />
          </div>
        </div>
        {/* ActualiteDashboard in center */}
        <div className="flex-grow flex flex-col mx-auto"> {/* Centered with flex-col */}
          <div className="w-full p-4">
            <ActualiteDashboard />
          </div>
          {session ? (
            session.user && session.user.isAdmin ? (
              <>
                {/* Add any additional admin-only content here */}
              </>
            ) : (
              <div className="flex-grow ">
                <div className="p-8 rounded-md bg-white">
                  {/* Empty content for non-admins (optional) */}
                </div>
              </div>
            )
          ) : (
            <p className="text-red-500 p-4">You do not have permission to add actualités.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
