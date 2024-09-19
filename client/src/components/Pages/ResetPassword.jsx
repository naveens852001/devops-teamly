import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function ResetPassword() {
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:10000"
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    setToken(token);
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    console.log('Submitting password reset', { newPassword, token }); // Log the data being sent

    try {
      const response = await axios.post(`${apiUrl}/reset-password`, { newPassword, token }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response:', response); // Log the response for debugging
      if (response.status === 200) {
        toast.success("Password has been reset successfully.");
        navigate('/');
      } else {
        toast.error("Failed to reset password.");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto my-10 p-6 max-w-lg bg-gray-200 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-600">New Password</label>
          <input
            type="password"
            id="new-password"
            name="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-600">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
