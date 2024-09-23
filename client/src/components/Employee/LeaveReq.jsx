import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { toast } from "react-hot-toast";

const LeaveReq = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:10000";

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaveId, setLeaveId] = useState(null);

  const [leave, setLeave] = useState({
    name: "",
    empid: "",
    fromDate: "",
    toDate: "",
    reason: "",
    email: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${apiUrl}/employee/detail/${id}`)
      .then((result) => {
        const empdetail = result.data.Result;
        setLeaveId(result.data.Result._id);
        setEmployee(empdetail);
        setLeave({
          name: empdetail.name,
          empid: empdetail._id,
          fromDate: "",
          toDate: "",
          reason: "",
          email: empdetail.email,
        });
      })
      .catch((err) => console.log(err));

    axios.defaults.withCredentials = true;

    axios
      .get(`${apiUrl}/employee/leavereqEmp/${id}`)
      .then((result) => {
        setLeaveRequests(result.data.leaveRequests);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Error fetching leave requests");
        setLoading(false);
      });
  }, [id]);

  const handleDecision = (leaveId) => {
    axios
      .delete(`${apiUrl}/employee/leaveWithdrawEmp/${leaveId}`)
      .then((result) => {
        if (result.data.Status) {
          toast.success("Leave request withdrawn successfully");
          setLeaveRequests(
            leaveRequests.filter((request) => request._id !== leaveId)
          );
        } else {
          toast.error("Error updating leave request status");
        }
      })
      .catch((err) => {
        console.log("Error updating leave request status:", err);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeave((prevLeave) => ({ ...prevLeave, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    const startDate = new Date(leave.fromDate);
    const endDate = new Date(leave.toDate);
    
    // Check if the leave is for one day
    if (startDate.getTime() === endDate.getTime()) {
        toast.success("Leave request for one day submitted successfully");
    } else if (startDate >= endDate) {
        toast.error("Start date must be before the end date.");
        return;
    }

    axios
      .post(`${apiUrl}/employee/leave_request`, leave)
      .then((result) => {
        if (result.data.Status) {
          // Use relative path to navigate to the dashboard
          navigate(`/EmpDashboard/LeaveReq/${employee._id}`);
          toast.success("Leave request submitted successfully");
          setLeave({
            name: employee.name,
            empid: employee._id,
            fromDate: "",
            toDate: "",
            reason: "",
            email: employee.email,
          });
        } else {
          toast.error(result.data.error);
        }
      })
      .catch((err) => console.log(err));
};

  const pendingRequests = leaveRequests.filter(
    (request) => request.status === "Pending"
  );
  const otherRequests = leaveRequests.filter(
    (request) => request.status !== "Pending"
  );

  return (
    <div className=" mx-auto my-3 p-4">
    <div className="flex flex-col md:flex-row gap-4">
      {/* Leave Request Form */}
      <div className="w-full md:w-5/12 bg-gray-200 shadow-md rounded-lg p-6 mb-4 md:mb-0">
        <header className="flex items-center justify-center mb-6">
          <i className="bi bi-calendar text-dark text-3xl" />
          <h1 className="text-2xl font-bold ml-3 pt-1">Apply For Leave</h1>
        </header>
  
        <form id="LeaveRequestForm" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-lg font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full border border-gray-100 rounded-md p-2 "
                value={employee.name || ""}
                readOnly
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-1">E-Mail</label>
              <input
                type="text"
                className="w-full border border-gray-100 rounded-md p-2 "
                value={employee.email || ""}
                readOnly
              />
            </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-lg font-medium mb-1">Employee ID</label>
              <input
                className="w-full border border-gray-100 rounded-md p-2"
                value={employee._id || ""}
                readOnly
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-1">Reason</label>
              <textarea
                name="reason"
                className="w-full border border-gray-100 rounded-md p-2"
                placeholder="Reason for the leave"
                onChange={handleChange}
                required
              />
            </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-lg font-medium mb-1">Start Date</label>
              <input
                type="date"
                name="fromDate"
                className="w-full border border-gray-100 rounded-md p-2"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-1">End Date</label>
              <input
                type="date"
                name="toDate"
                className="w-full border border-gray-100 rounded-md p-2"
                onChange={handleChange}
                required
              />
            </div>
          </div>
  
          <button
            type="submit"
            className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-black"
          >
            Submit
          </button>
        </form>
      </div>
  
      {/* Leave Requests Tables */}
      <div className="w-full md:w-7/12">
        {/* Pending Leave Requests Table */}
        <div className="bg-gray-100 shadow-md rounded-lg p-6 mb-4">
          <h3 className="text-xl font-bold mb-4">Pending Requests</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-100">
              <thead className="bg-gray-200 border-b">
                <tr>
                  <th className="py-2 px-4 border-r">Employee Name</th>
                  <th className="py-2 px-4 border-r">Start Date</th>
                  <th className="py-2 px-4 border-r">End Date</th>
                  <th className="py-2 px-4 border-r">Reason</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((request) => (
                  <tr key={request._id} className="border-b">
                    <td className="py-2 px-4 border-r">{request.name}</td>
                    <td className="py-2 px-4 border-r">
                      {new Date(request.fromdate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-r">
                      {new Date(request.todate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 overflow-hidden border-r">{request.reason}</td>
                    <td className="py-2 px-4">
                      <button
                        className="bg-yellow-300 text-black py-1 px-2 rounded hover:bg-yellow-400"
                        onClick={() => handleDecision(request._id)}
                      >
                        Withdraw
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  
        {/* Other Leave Requests Table */}
        <div className="bg-gray-100 shadow-md rounded-lg p-6">
  <h3 className="text-xl font-bold mb-4">History</h3>
  <div className="overflow-x-auto">
    <table className="min-w-full hidden md:table border border-gray-300">
      <thead className="bg-gray-200 border-b">
        <tr>
          <th className="py-2 px-4 border-r">Employee Name</th>
          <th className="py-2 px-4 border-r">Start Date</th>
          <th className="py-2 px-4 border-r">End Date</th>
          <th className="py-2 px-4 border-r">Reason</th>
          <th className="py-2 px-4">Status</th>
        </tr>
      </thead>
      <tbody>
        {otherRequests.map((request) => (
          <tr key={request._id} className="border-b">
            <td className="py-2 px-4 border-r">{request.name}</td>
            <td className="py-2 px-4 border-r">
              {new Date(request.fromdate).toLocaleDateString()}
            </td>
            <td className="py-2 px-4 border-r">
              {new Date(request.todate).toLocaleDateString()}
            </td>
            <td className="py-2 px-4 border-r">{request.reason}</td>
            <td className="py-2 px-4">
              <span
                className={`p-1 rounded ${
                  request.status === "Accepted"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : request.status === "Rejected"
                    ? "bg-red-500 text-white px-2 hover:bg-red-600"
                    : ""
                }`}
              >
                {request.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="md:hidden">
      {otherRequests.map((request) => (
        <div key={request._id} className="bg-white border border-gray-300 rounded-lg mb-4 p-4 shadow-md">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Employee Name:</span>
              <span>{request.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Start Date:</span>
              <span>{new Date(request.fromdate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">End Date:</span>
              <span>{new Date(request.todate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Reason:</span>
              <span>{request.reason}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Status:</span>
              <span
                className={`p-1 rounded ${
                  request.status === "Accepted"
                    ? "bg-green-600 text-white"
                    : request.status === "Rejected"
                    ? "bg-red-500 text-white"
                    : ""
                }`}
              >
                {request.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

      </div>
    </div>
  </div>
  
  
  );
};

export default LeaveReq;
