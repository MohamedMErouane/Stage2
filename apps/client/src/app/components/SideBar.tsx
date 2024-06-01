"use client";
import React, { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { CiVideoOn } from "react-icons/ci";
import { PiStudentBold } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { MdDashboard, MdExitToApp } from "react-icons/md";
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import { FaComments } from "react-icons/fa";
import { BiMessageSquareDots } from "react-icons/bi";
import { IoMdSchool } from "react-icons/io";
import NavItem from "./NavItem";
import { useSession } from "next-auth/react";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div
      className="fixed left-0 top-0 h-full w-64 text-white opacity-50"
      style={{
        backgroundImage: 'url("/bg.jpg")', // Replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >  <div className="absolute inset-0 bg-black opacity-75">
      <Disclosure as="nav" className="h-full flex flex-col">
        {({ open }) => (
          <>
            <div className="flex justify-between items-center p-4">
              <IoMdSchool size={60} />
              <Disclosure.Button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 focus:outline-none focus:ring"
              >
                <GiHamburgerMenu className="h-6 w-6" />
              </Disclosure.Button>
            </div>
            <Disclosure.Panel className={`flex flex-col ${!isOpen ? 'hidden' : 'block'}`}>
              <NavItem icon={<MdDashboard />} label="Dashboard" href="/home" />
              <NavItem icon={<CgProfile />} label="Profile" href={`/profile/${session?.user.username}`} />
              <NavItem icon={<CiVideoOn />} label="Video Rooms" href="/study" />
              <NavItem icon={<FaComments />} label="Chat Rooms" href="/chat" />
              <NavItem icon={<BiMessageSquareDots />} label=" Goals" href="/todo" />
              <NavItem icon={<LeaderboardOutlinedIcon />} label="States" href="/states" />
              <NavItem icon={<PiStudentBold />} label="Leaderboard" href="/leaderboard" />
              <NavItem icon={<MdExitToApp />} label="Logout" href="/api/auth/signout" />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
    </div>
  );
};

export default SideBar;
