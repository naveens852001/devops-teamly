import React, { useState } from "react";
// import "../../style.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EmployeeLogin = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`${apiUrl}/employee/employee_login`, values)
      .then((result) => {
        if (result.data.Status) {
          localStorage.setItem("valid", true);
          toast.success("Login Successful. Welcome!");
          navigate("/EmpDashboard/employee_detail/" + result.data.id);
        } else {
          toast.error(result.data.error);
          setError(result.data.error);
        }
      })
      .catch((err) => toast.error(err));
  };

  return (
    <div>
      <div className="container" id="container">
        <div className="form-container ">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center p-5 w-full h-full box-border"
          >
            <h1 className="font-montserrat text-2xl ">Sign In As Employee</h1>
            <input
              className="bg-white text-black border border-black rounded-lg px-2.5 py-2 my-2.5 w-full"
              type="email"
              placeholder="Email"
              name="email"
              autoComplete="off"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
            <input
              className="bg-white text-black border border-black rounded-lg px-2.5 py-2 my-2.5 w-full"
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />

            <button
              type="submit"
              className="btn-signin rounded-full text-black text-xs font-bold px-[45px] py-[12px]  uppercase cursor-pointer border border-black">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
