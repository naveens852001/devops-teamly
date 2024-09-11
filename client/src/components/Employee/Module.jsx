import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const ModuleDashboard = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const [trainingModules, setTrainingModules] = useState([]);
  const [completedModules, setCompletedModules] = useState([]);
  const [employeeDepartment, setEmployeeDepartment] = useState('');
  const [employee, setEmployee] = useState('');

  const { id } = useParams();

  useEffect(() => {
    fetchTrainingModules();
    fetchCompletedModules();
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const res = await axios.get(`${apiUrl}/employee/detail/${id}`);
      setEmployee(res.data.Result);
      setEmployeeDepartment(res.data.Result.category); // Corrected this line to use the response data directly
    } catch (error) {
      console.error('Error fetching employee:', error);
    }
  };

  const fetchTrainingModules = async () => {
    try {
      const res = await axios.get(`${apiUrl}/employee/${id}/incompleteModules`);
      setTrainingModules(res.data);
    } catch (error) {
      console.error('Error fetching training modules:', error);
    }
  };

  const fetchCompletedModules = async () => {
    try {
      const res = await axios.get(`${apiUrl}/employee/${id}/completedModules`);
      setCompletedModules(res.data);
    } catch (error) {
      toast.error('Error fetching completed modules OR No Such Module');
    }
  };

  const markAsCompleted = async (moduleId) => {
    const confirmCompletion = window.confirm("Are you sure you want to mark this module as completed? You won't be able to revisit it.");
    if (confirmCompletion) {
      try {
        await axios.post(`${apiUrl}/employee/completedModules`, {
          employeeId: id,
          moduleId: moduleId
        });
        setTrainingModules(trainingModules.filter((module) => module._id !== moduleId));
        fetchCompletedModules();
      } catch (error) {
        console.error('Error marking module as completed:', error);
      }
    }
  };

  // Filter training modules based on employee's department
  const filteredModules = trainingModules.filter((module) => module.department === employeeDepartment);

  return (
    <div className="p-4">
      <div className="card bg-gray-200 shadow-md rounded-lg p-4 mb-4 ">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Training Modules</h2>
        <hr className="my-4 border-gray-300" />
        <div className="flex gap-4">
          <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="mb-4">
              <h3 className="lg:text-xl md:text-xl sm:text-xs  font-semibold text-gray-700  mb-2">Incomplete Training Modules</h3>
              <ul className="space-y-2">
                {filteredModules.map((module) => (
                  <li className="flex justify-between items-center p-4 border border-gray-200 rounded-lg bg-gray-100" key={module._id}>
                    <div>
                      <p className="text-blue-600">{module.name} - {module.department}</p>
                      <a href={module.file} className="text-blue-500 underline">Check Your Module</a>
                    </div>
                    <button
                      onClick={() => markAsCompleted(module._id)}
                      className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Mark as Completed
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="mb-4">
              <h3 className="lg:text-xl md:text-xl sm:text-xs font-semibold text-gray-700 mb-2">Completed Training Modules</h3>
              <ul className="space-y-2">
                {completedModules.map((module) => (
                  <li className="flex flex-col p-4 border border-gray-200 rounded-lg bg-gray-100" style={{ marginLeft: "-30px" }} key={module.moduleId._id}>
                    <p className="text-blue-600">{module.moduleId.name} - {module.moduleId.department}</p>
                    <span className="text-gray-600">Completed on: {new Date(module.completedAt).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDashboard;
