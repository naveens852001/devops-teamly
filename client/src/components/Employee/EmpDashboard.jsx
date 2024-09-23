import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BsSpeedometer2 } from "react-icons/bs";
import { SlCalender } from "react-icons/sl";
import { FaHistory } from "react-icons/fa";
import { MdOnDeviceTraining } from "react-icons/md";
import { MdOutlineEventAvailable } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut, IoMdChatbubbles } from "react-icons/io";

const EmpDashboard = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:10000";
  const [employee, setEmployee] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get(`${apiUrl}/employee/detail/${id}`)
      .then(result => {
        setEmployee(result.data.Result);
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleLogout = () => {
    axios.get(`${apiUrl}/emp_Logout`)
      .then((result) => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate('/'); // Redirect to the homepage or login page
        } else {
          console.log("Logout failed", result.data.Error);
        }
      }).catch(err => {
        console.log("An error occurred during logout", err);
      });
  };

  return (
    <div className="flex min-h-screen max-h-full">
      <nav className="flex-none w-1/5 border-r-2 p-5 border-gray-500 text-white bg-logo-gradient">
        <div className="flex flex-col items-center md:items-start">
          <Link
            to={`employee_detail/${id}`}
            className="text-white text-xl font-bold no-underline mb-6 flex items-center"
          >
            <span className="px-4 text-3xl font-edu hidden sm:inline">Teamly</span>
          </Link>
          <ul className="flex flex-col space-y-8 px-0 list-none">
            <li>
              <Link
                to={`employee_detail/${id}`}
                className={`flex items-center px-2 py-1 rounded no-underline 
                  ${location.pathname.includes(`employee_detail/${id}`) ? 'bg-gray-600 text-white' : 'text-white hover:bg-gray-700'}`}
              >
                <span className="px-2 text-xl"><BsSpeedometer2 /></span>
                <span className="hidden md:inline">EmpDashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to={`chat-teamly/${id}`}
                className={`flex items-center px-2 py-1 rounded no-underline 
                  ${location.pathname.includes(`chat-teamly/${id}`) ? 'bg-gray-600 text-white' : 'text-white hover:bg-gray-700'}`}
              >
                <span className="px-2 text-xl"><IoMdChatbubbles /></span>
                <span className="hidden md:inline">Chat-Teamly</span>
              </Link>
            </li>
            <li>
              <Link
                to={`LeaveReq/${id}`}
                className={`flex items-center px-2 py-1 rounded no-underline 
                  ${location.pathname.includes(`LeaveReq/${id}`) ? 'bg-gray-600 text-white' : 'text-white hover:bg-gray-700'}`}
              >
                <span className="px-2 text-xl"><SlCalender /></span>
                <span className="hidden md:inline">Apply For Leave</span>
              </Link>
            </li>
            <li>
              <Link
                to={`employee_update/${id}`}
                className={`flex items-center px-2 py-1 rounded no-underline 
                  ${location.pathname.includes(`employee_update/${id}`) ? 'bg-gray-600 text-white' : 'text-white hover:bg-gray-700'}`}
              >
                <span className="text-2xl px-2"><CgProfile /></span>
                <span className="hidden md:inline">Update Profile</span>
              </Link>
            </li>
            <li>
              <Link
                to={`EmpHisory/${id}`}
                className={`flex items-center px-2 py-1 rounded no-underline 
                  ${location.pathname.includes(`EmpHisory/${id}`) ? 'bg-gray-600 text-white' : 'text-white hover:bg-gray-700'}`}
              >
                <span className="text-xl px-2"><FaHistory /></span>
                <span className="hidden md:inline">Employment History</span>
              </Link>
            </li>
            <li>
              <Link
                to={`EventSchedule/${id}`}
                className={`flex items-center px-2 py-1 rounded no-underline 
                  ${location.pathname.includes(`EventSchedule/${id}`) ? 'bg-gray-600 text-white' : 'text-white hover:bg-gray-700'}`}
              >
                <span className="px-2 text-2xl"><MdOutlineEventAvailable /></span>
                <span className="hidden md:inline">Event</span>
              </Link>
            </li>
            <li>
              <Link
                to={`TrainingModules/${id}`}
                className={`flex items-center px-2 py-1 rounded no-underline 
                  ${location.pathname.includes(`TrainingModules/${id}`) ? 'bg-gray-600 text-white' : 'text-white hover:bg-gray-700'}`}
              >
                <span className="px-2 text-2xl"><MdOnDeviceTraining /></span>
                <span className="hidden md:inline">Training Module</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center text-white px-2 py-1 hover:bg-gray-700 rounded"
              >
                <span className="text-2xl px-2"><IoIosLogOut /></span>
                <span className="hidden md:inline">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="flex-grow w-3/4 p-4 relative bg-logo-gradient">
        {location.pathname.includes(`/employee_detail/${id}`) && (
          <div className="card centered-card mb-4 w-full mx-auto border border-gray-500 bg-gradient-to-r from-slate-900 to-slate-700 p-4 flex items-center space-x-4 shadow-lg rounded-lg">
            <img
              src={`/images/${employee.image}`}
              alt="Employee"
              className="w-16 h-16 rounded-full object-cover"
            />
            <h4 className="text-lg text-white font-bold">Welcome {employee.name}</h4>
          </div>
        )}
        
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EmpDashboard;
