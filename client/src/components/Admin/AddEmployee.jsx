import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddEmployee = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    salary: "",
    address: "",
    category: "",
    position:"",
    doj:"",
    image: null,
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('password', employee.password);
    formData.append('address', employee.address);
    formData.append('salary', employee.salary);
    formData.append('category', employee.category);
    formData.append('position', employee.position);
    formData.append('doj', employee.doj);
    formData.append('image', employee.image);

    axios.post(`${apiUrl}/add_employee`, formData, {
        headers:{
          'Content-Type': 'multipart/form-data'
        }
    })
    .then(result => {
      console.log(result);
        if(result.data.Status) {
            navigate('/dashboard/employee');
        } else {
            alert(result.data.Error);
        }
    })
    .catch(err => console.log(err));
  };

  return (
    <div className="flex justify-center items-center  mt-3">
    <div className="p-4 py-0 rounded-lg w-full max-w-xl border bg-white border-gray-200 shadow-md">
      <h3 className="text-center text-3xl my-2 font-montserrat text-gray-800 mb-2">Add Employee</h3>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="inputName" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 block h-10 border px-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              id="inputName"
              placeholder="Enter Name"
              onChange={(e) =>
                setEmployee({ ...employee, name: e.target.value })
              }
            />
          </div>
          <div className="flex-1">
            <label htmlFor="inputEmail4" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border border-gray-900 px-2 py-2  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              id="inputEmail4"
              placeholder="Enter Email"
              autoComplete="off"
              onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })
              }
            />
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label htmlFor="inputPassword4" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border  px-2 py-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              id="inputPassword4"
              placeholder="Enter Password"
              onChange={(e) =>
                setEmployee({ ...employee, password: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="inputSalary" className="block text-sm font-medium text-gray-700">Salary</label>
            <input
              type="text"
              className="mt-1 block h-10 px-2 border w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              id="inputSalary"
              placeholder="Enter Salary"
              autoComplete="off"
              onChange={(e) =>
                setEmployee({ ...employee, salary: e.target.value })
              }
            />
          </div>
        </div>
        <div>
          <label htmlFor="inputAddress" className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            className=" block h-10 px-2 border w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            id="inputAddress"
            placeholder="1234 Main St"
            autoComplete="off"
            onChange={(e) =>
              setEmployee({ ...employee, address: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            id="category"
            className="mt-1 mx-0 block w-full rounded-md px-2 py-2 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={employee.category}
            onChange={(e) => setEmployee({...employee, category: e.target.value})}
          >
            <option value="" disabled>Select The Respective Department</option>
            <option value="IT">IT</option>
            <option value="Finance">Management</option>
          </select>
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
            <input
              type="text"
              className="h-10 px-2 border block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              id="position"
              placeholder="Selected Position"
              autoComplete="off"
              onChange={(e) =>
                setEmployee({ ...employee, position: e.target.value })
              }
            />
          </div>
          <div className="flex-1">
            <label htmlFor="doj" className="block text-sm font-medium text-gray-700">Date Of Joining</label>
            <input
              type="date"
              className=" block w-full rounded-md border border-gray-300 h-10 px-2  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              id="doj"
              placeholder="Enter Date of Joining"
              autoComplete="off"
              onChange={(e) =>
                setEmployee({ ...employee, doj: e.target.value })
              }
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700" htmlFor="inputGroupFile01">Select Image</label>
          <input
            type="file"
            className="mt-1 block w-full  border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            id="inputGroupFile01"
            name="image"
            onChange={(e) => setEmployee({...employee, image:e.target.files[0]})}
          />
        </div>
        <div className="flex justify-center">
          <button type="submit" className="w-30 flex items-center py-2 mb-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring--500">Add Employee</button>
        </div>
      </form>
    </div>
  </div>
  

  );
};

export default AddEmployee;
