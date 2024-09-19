import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
import { UserContext } from "../../UserContext";

function Login() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const { setUserId } = useContext(UserContext);

  axios.defaults.withCredentials = true;

  async function logUser(e) {
    e.preventDefault();
    const { email, password } = data;
    try {
      const result = await axios.post(`${apiUrl}/login`, { email, password });
      if (result.data.Status) {
        localStorage.setItem("valid", true);
        toast.success(`Login Successful. Welcome!`);
        const id = result.data.id;
        setUserId(id);
        navigate(`/dashboard`);
      } else {
        toast.error("Failed To Login");
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div>
      <div className="container" id="container">
        <div className="form-container ">
          <form
            className="flex flex-col items-center justify-center p-5  w-full  h-full box-border"
            onSubmit={logUser}
          >
            <h2 className="font-montserrat text-2xl  ">Sign In As Admin</h2>
            <input
              className="bg-white text-black border border-black rounded-lg px-2.5 py-2 my-2.5 w-full"
              type="email"
              placeholder="Email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <input
              className="bg-white text-black border border-black rounded-lg px-2.5 py-2 my-2.5 w-full"
              type="password"
              placeholder="Password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <button
              type="submit"
              className="btn-signin rounded-full text-black text-xs font-bold px-[45px] py-[12px]  uppercase cursor-pointer border border-black">
              Sign In
            </button>

            {/* Add Forgot Password link */}
            <Link
              to="/forgot-password"
              className="mt-2 text-sm text-gray-800 no-underline  hover:text-black">
              Forgot Password?
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
