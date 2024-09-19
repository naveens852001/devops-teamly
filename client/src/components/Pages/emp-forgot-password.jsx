import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function EmpForgotPassword() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:10000" ;
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/emp-forgot-password`, { email });
      if (response.data.message) {
        toast.success("Password reset link has been sent to your email.");
        navigate("/");
      } else {
        toast.error("No account found with this email.");
      }
    } catch (error) {
      console.error('Error:', error); 
      toast.error("An error occurred. Please try again.");
    }
  };
  
  
  return (
    <div className="container mx-auto my-10 p-6 max-w-lg bg-gray-200 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

export default EmpForgotPassword;
