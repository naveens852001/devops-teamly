import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
   const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:10000";

    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        position: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/register`, formData);
            if (response.data.Status) {
                toast.success("Registration successful!");
                navigate('/');
            } else {
                toast.error("Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            toast.error("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="container mx-auto my-10 p-6 max-w-lg bg-gray-200 shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-600">Address</label>
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
               
                <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-600">Position</label>
                    <input type="text" id="position" name="position" value={formData.position} onChange={handleChange} required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Registration;
