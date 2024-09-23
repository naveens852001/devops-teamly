import React, { useContext, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../UserContext";
import {
  BsSpeedometer2,
  BsPeopleFill,
  BsCreditCard2FrontFill,
} from "react-icons/bs";
import { SlCalender } from "react-icons/sl";
import { MdOutlineEventAvailable } from "react-icons/md";
import { PiChalkboardSimpleDuotone } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut, IoMdChatbubbles } from "react-icons/io";
import "./CSS/responsive.css";

const Dashboard = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:10000";
  const navigate = useNavigate();
  const { userId, setUserId } = useContext(UserContext);
  const location = useLocation();

  const handleLogout = () => {
    axios.get(`${apiUrl}/logout`).then((result) => {
      if (result.data.Status) {
        localStorage.removeItem("valid");
        sessionStorage.removeItem("userId");
        setUserId(null);
        navigate("/");
      }
    });
  };

  const menuItems = [
    { to: "/dashboard", icon: <BsSpeedometer2 />, label: "Dashboard" },
    { to: "/dashboard/chat-teamly", icon: <IoMdChatbubbles />, label: "Chat-Teamly" },
    { to: "/dashboard/employee", icon: <BsPeopleFill />, label: "Manage Employees" },
    { to: "/dashboard/leave_request", icon: <SlCalender />, label: "Leave Requests" },
    { to: "/dashboard/payroll", icon: <BsCreditCard2FrontFill />, label: "Payroll" },
    { to: "/dashboard/EventScheduler", icon: <MdOutlineEventAvailable />, label: "Event Schedule" },
    { to: "/dashboard/empenroll", icon: <PiChalkboardSimpleDuotone />, label: "Employee Onboarding" },
    { to: `/dashboard/editAdmin/${userId}`, icon: <CgProfile />, label: "Profile" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/5 h-full border-r-2 border-gray-500 text-white overflow-hidden bg-gradient-to-tr from-[#084720] via-[#003f42] to-[#013147]">
        <div className="flex flex-col p-3 items-center sm:items-start overflow-y-auto">
          <Link
            to="/dashboard"
            className="flex items-center pb-3 mb-4 hover:bg-gray-300 text-white no-underline font-edu"
          >
            <span className="ml-2 text-3xl font-bold hidden sm:inline">Teamly</span>
          </Link>
          <ul className="flex flex-col space-y-5 px-0 list-none">
  {menuItems.map((item) => (
    <li key={item.label}>
      <Link
        to={item.to}
        className={`flex items-center px-2 py-1 rounded no-underline 
          ${location.pathname === item.to ? 'bg-gray-600 h-10  ' : 'text-white hover:bg-gray-700'}`}
      >
        <span className="px-2 icons text-xl">{item.icon}</span>
        <span className="hidden sm:inline">{item.label}</span>
      </Link>
    </li>
  ))}
  <div className="mt-auto">
    <Link
      className="flex items-center text-white px-2 py-1 hover:bg-gray-700 rounded no-underline"
      onClick={handleLogout}
    >
      <span className="text-xl icons px-2"><IoIosLogOut /></span>
      <span className="hidden sm:inline">Logout</span>
    </Link>
  </div>
  <hr className="border-t border-gray-300 my-4 mx-4" />
</ul>

          <div className="mt-4 contact-admin-line pt-4 px-2 text-center text-xs">
            To Add More Admins,<br /> Please Contact the Super Admin.
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className="flex-1 p-0 h-screen overflow-hidden px-3 py-3 relative"
        style={{
          backgroundColor: "rgb(0, 0, 0)",
          backgroundImage: `
            radial-gradient(at 55% 53%, rgb(20, 184, 166) 0, transparent 50%),
            radial-gradient(at 61% 77%, rgb(7, 89, 133) 0, transparent 93%),
            radial-gradient(at 20% 1%, rgb(5, 150, 105) 0, transparent 48%),
            radial-gradient(at 4% 40%, rgb(120, 53, 15) 0, transparent 92%),
            radial-gradient(at 49% 8%, rgb(71, 85, 105) 0, transparent 6%),
            radial-gradient(at 12% 52%, rgb(147, 51, 234) 0, transparent 42%)
          `,
        }}
      >
        <div className="absolute inset-0 backdrop-blur-md bg-black/30" />
        <div className="relative z-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
