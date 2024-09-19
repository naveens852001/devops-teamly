import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const Employee = () => {
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:10000"
  const [employees, setEmployees] = useState([]);
  const [salaryTotal, setSalaryTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {

    salaryCount();
  
  }, []);


  const salaryCount = () => {
    axios.get(`${apiUrl}/salary_count`).then((result) => {
      if (result.data.Status) {
        setSalaryTotal(result.data.Result);
      } else {
        alert("Error fetching salary count");
      }
    });
  };


  useEffect(() => {
    axios.get(`${apiUrl}/employee`)
      .then((result) => {
        if (result.data.Status) {
          setEmployees(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`${apiUrl}/delete_employee/`+id)
    .then(result => {
        if(result.data.Status) {
            window.location.reload();
        } else {
            alert(result.data.Error);
        }
    });
  };

  return (
    <div className="w-full pt-6 px-6 mb-8">
  <div className="card bg-white rounded-xl shadow-md ">
    <h2 className="text-4xl font-montserrat text-center py-3 text-gray-800 ">Employee List</h2>
    <hr className="border-gray-200 mb-6" />
    <Link
      to="/dashboard/add_employee"
      className="bg-gray-800 text-center no-underline hover:bg-black text-white font-medium py-3 mx-3 mt-3 px-5 rounded-lg mb-6 inline-block"
    >
      Add Employee
    </Link>
    <div className="font-montserrat font-bold py-3 mb-4">
      <p className="bg-gray-800 px-2 w-36 rounded mx-3 text-white">
        <span className="font-montserrat">Total Assets:</span><br />
        Rs. {salaryTotal}
      </p>
    </div>
    <div className="overflow-x-auto max-h-80 bg-gray-100 p-4 mb-4 rounded-lg">
      <div className=" overflow-y-auto">
        <table className="min-w-full text-left border-collapse hidden sm:table">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 border-b border-gray-300">Name</th>
              <th className="py-3 px-4 border-b border-gray-300">Image</th>
              <th className="py-3 px-4 border-b border-gray-300">Email</th>
              <th className="py-3 px-4 border-b border-gray-300">Address</th>
              <th className="py-3 px-4 border-b border-gray-300">Salary</th>
              <th className="py-3 px-4 border-b border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id} className="hover:bg-gray-100 border-b transition-colors duration-200">
                <td className="py-3 px-4  ">{employee.name}</td>
                <td className="py-3 px-4  ">
                  <img
                    src={`${apiUrl}/images/${employee.image}`}
                    alt={employee.name}
                    className="w-24 h-24 object-cover rounded-md shadow-sm"
                  />
                </td>
                <td className="py-3 px-4  ">{employee.email}</td>
                <td className="py-3 px-4 ">{employee.city}</td>
                <td className="py-3 px-4 ">{employee.salary}</td>
                <td className="py-5 px-4  flex space-x-2">
                  <Link
                    to={`/dashboard/edit_employee/${employee._id}`}
                    className="bg-green-500 text-white font-medium py-2 px-4 rounded-lg transition-all hover:bg-green-600 duration-300 no-underline"
                  >
                    Edit
                  </Link>
                  <button
                    className="bg-red-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:bg-red-800"
                    onClick={() => handleDelete(employee._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile View */}
        <div className="block sm:hidden max-h-72 overflow-y-auto">
          {employees.map((employee) => (
            <div key={employee._id} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
              <div className="flex flex-col">
                <div className="font-bold text-gray-800 mb-2">Name:</div>
                <div className="mb-4">{employee.name}</div>

                <div className="font-bold text-gray-800 mb-2">Image:</div>
                <img
  src={`${apiUrl}/images/${employee.image}`}
  alt={employee.name}
  className="w-24 h-24 object-cover rounded-md shadow-sm mb-4"
/>


                <div className="font-bold text-gray-800 mb-2">Email:</div>
                <div className="mb-4">{employee.email}</div>

                <div className="font-bold text-gray-800 mb-2">Address:</div>
                <div className="mb-4">{employee.address}</div>

                <div className="font-bold text-gray-800 mb-2">Salary:</div>
                <div className="mb-4">{employee.salary}</div>

                <div className="font-bold text-gray-800 mb-2">Action:</div>
                <div className="flex space-x-2">
                  <Link
                    to={`/dashboard/edit_employee/${employee._id}`}
                    className="bg-green-500 text-white font-medium py-2 px-4 rounded-lg transition-all hover:bg-green-600 duration-300 no-underline"
                  >
                    Edit
                  </Link>
                  <button
                    className="bg-red-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:bg-red-800"
                    onClick={() => handleDelete(employee._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>


  );
};

export default Employee;
