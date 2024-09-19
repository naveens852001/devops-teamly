import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const LeaveRequestsAdmin = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`${apiUrl}/leave_requests`)
      .then((result) => {
        setLeaveRequests(result.data.Result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Error fetching leave requests");
        setLoading(false);
      });
  }, []);

  const handleDecision = (id, status) => {
    axios
      .post(`${apiUrl}/leave_requests/${id}`, { status })
      .then((result) => {
        if (result.data.status) {
          toast.success("Leave request status updated successfully");
          setLeaveRequests((prevRequests) =>
            prevRequests.map((req) =>
              req._id === id ? { ...req, status } : req
            )
          );
        } else {
          toast.error("Error updating leave request status");
        }
      })
      .catch((err) => {
        console.log("Error updating leave request status:", err);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const pendingRequests = leaveRequests.filter(
    (request) => request.status === "Pending"
  );
  const otherRequests = leaveRequests.filter(
    (request) => request.status !== "Pending"
  );

  return (
    <div className=" bg-white p-5 rounded-lg  mx-auto my-5 w-full max-w-5xl">
      <div className="  hover:rounded-lg  ">
        <h2 className="text-3xl font-montserrat text-center mb-4 flo">
          Leave Requests
        </h2>
        <hr className="my-4 border-gray-300" />

        <h3 className="text-xl font-semibold mt-4">Pending Requests</h3>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-200 bg-white shadow-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2">E-Mail</th>
                <th className="px-4 py-2">Employee Name</th>
                <th className="px-4 py-2">Start Date</th>
                <th className="px-4 py-2">End Date</th>
                <th className="px-4 py-2">Reason</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            {leaveRequests.length > 0 ? (
              <tbody className="divide-y divide-gray-200">
                {pendingRequests.map((request) => (
                  <tr key={request._id}>
                    <td className="px-4 py-2 border">{request.email}</td>
                    <td className="px-4 py-2 border">{request.name}</td>
                    <td className="px-4 py-2 border">
                      {new Date(request.fromdate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border">
                      {new Date(request.todate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border">{request.reason}</td>
                    <td className="px-4 py-2 border">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                        onClick={() => handleDecision(request._id, "Accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDecision(request._id, "Rejected")}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody className="text-center">
                <tr>
                  <td colSpan="6" className="py-4 text-gray-600">
                    <h6>No Active Requests</h6>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>

        {/* Other Leave Requests Table */}
        <h3 className="text-xl font-semibold mt-6 sm:overflow-y-auto">Log</h3>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-200  shadow-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2">E-Mail</th>
                <th className="px-4 py-2">Employee Name</th>
                <th className="px-4 py-2">Start Date</th>
                <th className="px-4 py-2">End Date</th>
                <th className="px-4 py-2">Reason</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 ">
              {otherRequests.map((request) => (
                <tr key={request._id} >
                  <td className="px-4 py-2 border ">{request.email}</td>
                  <td className="px-4 py-2 border ">{request.name}</td>
                  <td className="px-4 py-2 border ">
                    {new Date(request.fromdate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border ">
                    {new Date(request.todate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border ">{request.reason}</td>
                  <td className="py-2 px-4  border">
                    <span
                      className={` p-1 rounded  ${
                        request.status === "Accepted"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : request.status === "Rejected"
                          ? "bg-red-500 text-white px-2 hover:bg-red-600"
                          : ""
                      }`}
                    >
                      {" "}
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestsAdmin;
