import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


const EditEmployee = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const { id } = useParams();
    const [employee, setEmployee] = useState({
        name: "",
        email: "",
        salary: "",
        city: "",
        category: "",
        position:""
    });
    const navigate = useNavigate();

    useEffect(() => {
        axios.get( `${apiUrl}/employee/${id}`)
            .then(result => {
                console.log(result.data);
                const data = result.data.Result[0];
                setEmployee({
                    name: data.name,
                    email: data.email,
                    city: data.city,
                    salary: data.salary,
                    category: data.category,
                    position: data.position 
                });
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`${apiUrl}/edit_employee/${id}`, employee)

            .then(result => {
                if (result.data.Status) {
                    navigate('/dashboard/employee');
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="flex justify-center items-center mt-2 " >
        <div className="p-6 py-2 rounded-lg border border-gray-300 bg-gray-50 shadow-m  overflow-auto  w-2/4 mb-5">
            <h3 className="text-center text-2xl font-semibold mb-6">Edit Employee</h3>
            <form className="space-y-2" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="inputName" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        className="block w-full h-10 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                        id="inputName"
                        placeholder="Enter Name"
                        value={employee.name}
                        onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="inputEmail4" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        className=" w-full p-2 h-10 border border-gray-300  rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                        id="inputEmail4"
                        placeholder="Enter Email"
                        autoComplete="off"
                        value={employee.email}
                        onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="inputSalary" className="block text-sm font-medium text-gray-700 mb-1">
                        Salary
                    </label>
                    <input
                        type="text"
                        className="block w-full h-10 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                        id="inputSalary"
                        placeholder="Enter Salary"
                        autoComplete="off"
                        value={employee.salary}
                        onChange={(e) => setEmployee({ ...employee, salary: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="inputAddress" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                    </label>
                    <input
                        type="text"
                        className="block w-full h-10 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                        id="inputAddress"
                        placeholder="1234 Main St"
                        autoComplete="off"
                        value={employee.city}
                        onChange={(e) => setEmployee({ ...employee, city: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="inputPosition" className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                    </label>
                    <input
                        type="text"
                        className="block w-full h-10 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                        id="inputPosition"
                        placeholder="Update Position"
                        autoComplete="off"
                        value={employee.position}
                        onChange={(e) => setEmployee({ ...employee, position: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <select
                        name="category"
                        id="category"
                        className="block w-full m-0 px-2 py-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                        value={employee.category}
                        onChange={(e) => setEmployee({ ...employee, category: e.target.value })}
                    >
                        <option value="IT">IT</option>
                        <option value="Software">Management</option>
                        
                    </select>
                </div>
                <div className="mt-4">
                    <button
                        type="submit"
                        className="w-full bg-gray-700 px-4 py-2 text-white rounded-md shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                        Edit Employee
                    </button>
                </div>
            </form>
        </div>
    </div>
    
    );
};

export default EditEmployee;
