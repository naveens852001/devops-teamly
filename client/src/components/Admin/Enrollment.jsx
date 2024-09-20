import React, { useState, useEffect } from 'react';
import axios from 'axios';


const OnboardingDashboard = () => {
  const [trainingModules, setTrainingModules] = useState([]);
  const [openPositions, setOpenPositions] = useState([]);
  const [openPositionsNumber, setOpenPositionsNumber] = useState([]);
  const [newModule, setNewModule] = useState('');
  const [newModuleFile, setNewModuleFile] = useState(null);
  const [newDepartment, setNewDepartment] = useState('');
  const [newPosition, setNewPosition] = useState('');
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:10000";
  useEffect(() => {
    fetchTrainingModules();
    fetchPositions();
  }, []);

  const fetchTrainingModules = async () => {
    const res = await axios.get(`${apiUrl}/trainingModules`);
    setTrainingModules(res.data);
  };

  const fetchPositions = async () => {
    const res = await axios.get(`${apiUrl}/positions`);
    setOpenPositions(res.data);
  };

  const addTrainingModule = async (e) => {
    e.preventDefault();
    if (newModule && newModuleFile) {
      const res = await axios.post(`${apiUrl}/trainingModules`, {
        name: newModule,
        file: newModuleFile,
        department: newDepartment
      });
      setTrainingModules([...trainingModules, res.data]);
      setNewModule('');
      setNewDepartment(null)
      setNewModuleFile('')
    }
  };



  const closeModule = async (id) => {
    await axios.delete(`${apiUrl}/trainingModules/${id}`);
    setTrainingModules(trainingModules.filter((m) => m._id !== id));
  };

  

  return (
    <div className=" pt-4 px-5 pb-0">
  <div className="card shadow-lg p-6 mb-6 rounded-lg bg-white">
    <h2 className="text-center text-2xl font-montserrat text-gray-800">Employee Onboarding</h2>
    <hr className="my-4 border-gray-300" />
    <div className="dashboard flex justify-between">
      <div className="left-panel flex-1 mx-2 bg-white p-6 border border-gray-300 rounded-lg shadow-md">
        <div className="section mb-6">
          <h3 className="text-xl font-montserrat text-gray-700">Training Modules</h3>
          <form onSubmit={addTrainingModule} className="space-y-4">
            <input
              type="text"
              value={newModule}
              onChange={(e) => setNewModule(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg w-full"
              placeholder="Add new module"
            />
            <input
              type="text"
              value={newModuleFile}
              onChange={(e) => setNewModuleFile(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg w-full"
              placeholder="Upload Module File Link"
            />
            <select
              onChange={(e) => setNewDepartment(e.target.value)}
              className="mx-0 p-2 px-0 border border-gray-300 rounded-lg w-full"
            >
              <option value="" disabled selected>Select The Respective Department</option>
              <option value="IT">IT</option>
              <option value="Software">Management</option>
           
            </select>
            <button className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-black transition" type="submit">
              Add Module
            </button>
          </form>
          <div className="list-container mt-4">
            <ul className="training-modules space-y-2">
              {trainingModules.map((module) => (
                <li className="module-item flex justify-between items-center p-2 border border-gray-200 rounded-lg bg-gray-100" key={module._id}>
                  <span className="text-blue-600">{module.name}</span>
                  <span>-- <a href={module.file} className="text-blue-500 hover:underline">Uploaded Module</a> --</span>
                  <span>{module.department}</span>
                  <button className="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600" onClick={() => closeModule(module._id)}>
                    Close
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default OnboardingDashboard;
