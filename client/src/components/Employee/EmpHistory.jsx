import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const EmploymentForm = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:10000";
    const { id } = useParams();
    const [employments, setEmployments] = useState([
        { companyName: '', jobTitle: '', startDate: '', endDate: '', jobDescription: '', userId: id }
    ]);
    const [previousEmployments, setPreviousEmployments] = useState([]);

    useEffect(() => {
        axios.get(`${apiUrl}/employee/employment_history/${id}`)
            .then(result => {
                if (result.data.Status) {
                    setPreviousEmployments(result.data.Result);
                } else {
                    toast.error('Failed to get employment history.');
                }
            });
    }, [id]);

    const handleInputChange = (index, event) => {
        const values = [...employments];
        values[index][event.target.name] = event.target.value;
        setEmployments(values);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const employment = employments[0];
        if (new Date(employment.startDate) >= new Date(employment.endDate)) {
            toast.error("Start date must be before the end date.");
            return;
        }
        if (!employment.companyName || !employment.jobTitle || !employment.startDate || !employment.endDate || !employment.jobDescription) {
            toast.error('All fields are required.');
            return;
        }

        axios.post(`${apiUrl}/employee/employment/${id}`, { employments })
            .then(result => {
                toast.success('Employment history submitted successfully!');
                axios.get(`${apiUrl}/employee/employment_history/${id}`)
                    .then(result => {
                        if (result.data.Status) {
                            setPreviousEmployments(result.data.Result);
                        } else {
                            toast.error('Failed to get employment history.');
                        }
                    });
            })
            .catch(error => {
                toast.error('Failed to submit employment history.');
                console.error('Error submitting employment history:', error);
            });
    };

    const handleDelete = (employmentId) => {
        axios.delete(`${apiUrl}/employee/empHistoryDelete/${employmentId}`)
            .then(result => {
                if (result.data.Status) {
                    toast.success('Employment history deleted successfully!');
                    setPreviousEmployments(previousEmployments.filter(emp => emp._id !== employmentId));
                } else {
                    toast.error('Failed to delete employment history.');
                }
            })
            .catch(error => {
                toast.error('Failed to delete employment history.');
                console.error('Error deleting employment history:', error);
            });
    };

    return (
        <div className="container mx-auto mt-4 px-4">
            <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2 mb-4">
                    <div className="bg-gray-200 p-4 rounded-lg shadow-sm transform transition-transform duration-300 hover:scale-105">
                        <h2 className="text-center mb-4 text-xl font-semibold text-gray-900 flex items-center justify-center">
                            <i className="bi bi-clock-history text-2xl mr-2"></i>
                            Employment History
                        </h2>
                        <form onSubmit={handleSubmit}>
                            {employments.map((employment, index) => (
                                <div key={index} className="mb-4">
                                    <div className="flex flex-wrap -mx-2">
                                        <div className="w-full md:w-1/2 px-2 mb-4">
                                            <label htmlFor={`companyName-${index}`} className="block text-sm font-medium text-gray-700">Company</label>
                                            <input
                                                type="text"
                                                className="form-input mt-1 py-2 px-2 block w-full border border-gray-100 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                id={`companyName-${index}`}
                                                name="companyName"
                                                value={employment.companyName}
                                                onChange={(event) => handleInputChange(index, event)}
                                            />
                                        </div>
                                        <div className="w-full md:w-1/2 px-2 mb-4">
                                            <label htmlFor={`jobTitle-${index}`} className="block text-sm font-medium text-gray-700">Job Title</label>
                                            <input
                                                type="text"
                                                className="form-input mt-1 py-2 px-2 block w-full border border-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                id={`jobTitle-${index}`}
                                                name="jobTitle"
                                                value={employment.jobTitle}
                                                onChange={(event) => handleInputChange(index, event)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap -mx-2">
                                        <div className="w-full md:w-1/2 px-2 mb-4">
                                            <label htmlFor={`startDate-${index}`} className="block text-sm font-medium text-gray-700">Start Date</label>
                                            <input
                                                type="date"
                                                className="form-input mt-1 block py-2 px-2 w-full border border-gray-100 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                id={`startDate-${index}`}
                                                name="startDate"
                                                value={employment.startDate}
                                                onChange={(event) => handleInputChange(index, event)}
                                            />
                                        </div>
                                        <div className="w-full md:w-1/2 px-2 mb-4">
                                            <label htmlFor={`endDate-${index}`} className="block text-sm font-medium text-gray-700">End Date</label>
                                            <input
                                                type="date"
                                                className="form-input mt-1 block py-2 px-2 w-full border border-gray-100 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                id={`endDate-${index}`}
                                                name="endDate"
                                                value={employment.endDate}
                                                onChange={(event) => handleInputChange(index, event)}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor={`jobDescription-${index}`} className="block text-sm font-medium text-gray-700">Job Description</label>
                                        <textarea
                                            className="form-textarea mt-1 block w-full border border-gray-100 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            id={`jobDescription-${index}`}
                                            name="jobDescription"
                                            rows="3"
                                            value={employment.jobDescription}
                                            onChange={(event) => handleInputChange(index, event)}
                                        ></textarea>
                                    </div>
                                </div>
                            ))}
                            <button type="submit" className="w-20 bg-gray-800 text-white mx-auto py-2 px-4 rounded-lg shadow-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
                <div className="w-full md:w-1/2 px-2 mb-4">
                    <div className="bg-gray-200 p-4 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Summary</h2>
                        <div className="overflow-x-auto">
                            {previousEmployments.length > 0 ? (
                                <div className="block md:hidden">
                                    {previousEmployments.map((employment) => (
                                        <div key={employment._id} className="bg-white border border-gray-300 rounded-lg mb-4 p-4 shadow-md">
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="font-semibold">Company Name:</span>
                                                    <span>{employment.companyName}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-semibold">Job Title:</span>
                                                    <span>{employment.jobTitle}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-semibold">Start Date:</span>
                                                    <span>{new Date(employment.startDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-semibold">End Date:</span>
                                                    <span>{new Date(employment.endDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-semibold">Job Description:</span>
                                                    <span>{employment.jobDescription}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-semibold">Actions:</span>
                                                    <button
                                                        className="text-red-600 hover:text-red-800"
                                                        onClick={() => handleDelete(employment._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">No previous employment history available.</p>
                            )}
                            <table className="min-w-full divide-y divide-gray-200 md:table hidden">
                                <thead className="bg-gray-300">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Company Name</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Job Title</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Start Date</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">End Date</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Job Description</th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {previousEmployments.map((employment) => (
                                        <tr key={employment._id}>
                                            <td className="px-4 py-2 text-sm border-r text-gray-900">{employment.companyName}</td>
                                            <td className="px-4 py-2 text-sm border-r text-gray-900">{employment.jobTitle}</td>
                                            <td className="px-4 py-2 text-sm border-r text-gray-900">{new Date(employment.startDate).toLocaleDateString()}</td>
                                            <td className="px-4 py-2 text-sm border-r text-gray-900">{new Date(employment.endDate).toLocaleDateString()}</td>
                                            <td className="px-4 py-2 text-sm border-r text-gray-900">{employment.jobDescription}</td>
                                            <td className="px-4 py-2 text-sm border-r text-gray-900">
                                                <button
                                                    className="text-red-600 hover:text-red-800"
                                                    onClick={() => handleDelete(employment._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default EmploymentForm;
