import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLogin from './Pages/Login'
import EmployeeLogin from './Pages/EmployeeLogin'
const Start = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get(`${apiUrl}/verify`)
    .then(result => {
      if(result.data.Status) {
        if(result.data.role === "admin") {
          navigate('/dashboard');
        } else {
          navigate('/EmpDashboard/employee_detail/'+result.data.id);
        }
      }
    })
    .catch(err => console.log(err));
  }, []);

  const [isAdmin, setIsAdmin] = useState(true);


  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-t from-[#fffbfbac] to-white">
      <div className="rounded border shadow-md my-5   w-80 h-full flex flex-col justify-between">
        <h2 className="font-montserrat text-3xl text-center my-3">Teamly</h2>
        <div className="flex justify-between items-center mb-6">
        <button
          type="button"
          className={`transition duration-300 ease-in-out mx-4 my-3 px-4 py-2 rounded-full ${
            !isAdmin
              ? 'bg-black text-white'
              : 'bg-gray-200 text-black'
          }`}
          onClick={() => setIsAdmin(false)}
        >
          Employee
        </button>
        <button
          type="button"
          className={`transition duration-300 ease-in-out my-3 mx-4 px-4 py-2 rounded-full ${
            isAdmin
              ? 'bg-black text-white'
              : 'bg-gray-200 text-black'
          }`}
          onClick={() => setIsAdmin(true)}
        >
          Admin
        </button>
      </div>
        <div className="flex-grow">
            {isAdmin ? <AdminLogin /> : <EmployeeLogin />}
          </div>
        </div>
        </div>
   
  );
};

export default Start;
