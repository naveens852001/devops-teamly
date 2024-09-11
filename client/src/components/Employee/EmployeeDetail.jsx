import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";
import Calendar from "react-calendar";
import axios from "axios";
import "../../style.css";

const EmployeeDetail = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const [employee, setEmployee] = useState({});
  const [pendingLeaveRequests, setPendingLeaveRequests] = useState([]);
  const [events, setEvents] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${apiUrl}/employee/detail/${id}`)
      .then((result) => {
        setEmployee(result.data.Result);
      })
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    fetchPendingLeaveRequests();
    axios
      .get(`${apiUrl}/events`)
      .then((result) => {
        if (result.data.Status) {
          setEvents(result.data.Result);
        } else {
          alert("Error fetching events");
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  const fetchPendingLeaveRequests = () => {
    axios
      .get(`${apiUrl}/pending_leave_requests/${id}`)
      .then((result) => {
        if (result.data.Result) {
          const filteredRequests = result.data.Result.filter(
            (request) =>
              request.status === "Pending" || request.status === "Accepted"
          );
          setPendingLeaveRequests(filteredRequests.slice(0, 3)); // Only display the latest 3 pending or accepted leave requests
        } else {
          alert("Error fetching pending leave requests");
        }
      })
      .catch((error) => {
        console.error("Error fetching pending leave requests:", error);
      });
  };

  const renderTileContent = ({ date, view }) => {
    if (view === "month") {
      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === date.toDateString();
      });

      if (dayEvents.length > 0) {
        return (
          <div className="event-highlight">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="event-marker  bg-red-600 text-white leading-4 mt-2 px-1 rounded text-sm font-montserrat font-normal"
              >
                {event.title}
              </div>
            ))}
          </div>
        );
      }
    }
    return null;
  };

  function calculateDuration(startDate, endDate) {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  return (
    <div className="p-5">
    <div className="flex flex-wrap -mx-2">
      <div className="w-full md:w-1/3 px-2 mb-4">
        <div className="text-white border-2 border-gray-500 text-center rounded-lg py-5 employee-card bg-logo-gradient transform transition-transform duration-300 hover:scale-105">
          <div className="font-montserrat text-xl">
            <i className="bi bi-envelope"></i> E-Mail
          </div>
          <div>
            <p className="font-montserrat">{employee.email}</p>
          </div>
        </div>
      </div>
  
      <div className="w-full md:w-1/3 px-2 mb-4">
        <div className="text-center rounded-lg py-5 bg-logo-gradient border-2 border-gray-500 transform transition-transform duration-300 hover:scale-105 text-white">
          <div className="font-montserrat text-xl">
            <i className="bi bi-person-badge"></i> Position
          </div>
          <div>
            <p className="font-montserrat text-xl">{employee.position}</p>
          </div>
        </div>
      </div>
  
      <div className="w-full md:w-1/3 px-2 mb-4">
        <div className="rounded-lg py-5 text-center bg-logo-gradient border-2 border-gray-500 transform transition-transform duration-300 hover:scale-105 text-white">
          <div className="font-montserrat text-xl">
            <i className="bi bi-file-post"></i> Department
          </div>
          <div>
            <p className="font-montserrat text-xl">{employee.category}</p>
          </div>
        </div>
      </div>
    </div>
  
    <div className="mt-4">
      <div className="shadow-lg">
        <div className="p-4 rounded-lg bg-gray-200">
          <Calendar tileContent={renderTileContent} className="w-full h-auto" />
        </div>
      </div>
    </div>
  
    {/* Leave Requests Section */}
    <div className="mt-4">
      <div className="mb-3 shadow-lg">
        <div className="p-4 bg-gray-200 text-black rounded-lg">
          <h4 className="text-center text-lg font-bold">Leave Requests</h4>
          <div className="overflow-x-auto">
            {/* Responsive table for mobile */}
            <div className="block md:hidden">
              {pendingLeaveRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white shadow-md rounded-lg mb-4 border border-gray-300 p-4"
                >
                  <div className="mb-2">
                    <span className="block font-bold text-gray-700">Name</span>
                    <span>{request.name}</span>
                  </div>
                  <div className="mb-2">
                    <span className="block font-bold text-gray-700">Duration</span>
                    <span>{calculateDuration(new Date(request.fromdate), new Date(request.todate))}</span>
                  </div>
                  <div className="mb-2">
                    <span className="block font-bold text-gray-700">Reason</span>
                    <span>{request.reason}</span>
                  </div>
                  <div className="mb-2">
                    <span className="block font-bold py-2 text-gray-700">Action</span>
                    <Link
                      to={`/EmpDashboard/LeaveReq/${id}`}
                      className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
  
            {/* Default table for larger screens */}
            <table className="hidden md:table min-w-full rounded-lg border border-gray-200">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Duration</th>
                  <th className="py-2 px-4 border-b">Reason</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingLeaveRequests.map((request) => (
                  <tr key={request._id} className="bg-white">
                    <td className="py-2 px-4 border-l  border-b border-r border-gray-300">
                      {request.name}
                    </td>
                    <td className="py-2 px-4 border-r  border-b border-gray-300 text-center">
                      {calculateDuration(new Date(request.fromdate), new Date(request.todate))}
                    </td>
                    <td className="py-2 px-4 border-r  border-b border-gray-300">
                      {request.reason}
                    </td>
                    <td className="py-2 px-4 border-r  border-b border-gray-300">
                      <Link
                        to={`/EmpDashboard/LeaveReq/${id}`}
                        className="bg-red-600 text-white py-2  px-4 rounded hover:bg-red-700"
                      >
                        Manage
                      </Link>
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

export default EmployeeDetail;
