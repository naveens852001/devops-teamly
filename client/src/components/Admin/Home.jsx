import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { IoPerson } from "react-icons/io5";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../style.css";

const Home = () => {
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:10000";

  const [leaves, setLeaves] = useState({ upcoming: [], past: [] });
  const [adminTotal, setAdminTotal] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [pendingLeaveRequests, setPendingLeaveRequests] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchLeaves();
    adminCount();
    employeeCount();
    AdminRecords();
    fetchPendingLeaveRequests();
    fetchEvents();
  }, []);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(`${apiUrl}/upcoming-leave`);
      const data = response.data;

      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      const upcoming = data.filter((leave) => {
        const fromDate = new Date(leave.fromdate);
        return fromDate >= today && fromDate <= thirtyDaysFromNow;
      });

      const past = data.filter((leave) => {
        const toDate = new Date(leave.todate);
        return toDate < today;
      });

      setLeaves({ upcoming, past });
    } catch (error) {
      console.error("Error fetching leave data:", error);
    }
  };

  const AdminRecords = () => {
    axios.get(`${apiUrl}/admin_records`).then((result) => {
      if (result.data.Result) {
        setAdmins(result.data.Result);
      } else {
        alert("Error fetching admins");
      }
    });
  };

  const adminCount = () => {
    axios.get(`${apiUrl}/admin_count`).then((result) => {
      if (result.data.Status) {
        setAdminTotal(result.data.Result);
      }
    });
  };

  const employeeCount = () => {
    axios.get(`${apiUrl}/employee_count`).then((result) => {
      if (result.data.Status) {
        setEmployeeTotal(result.data.Result);
      }
    });
  };

  const fetchPendingLeaveRequests = () => {
    axios
      .get(`${apiUrl}/pending_leave_requests`)
      .then((result) => {
        if (result.data.Result) {
          const filteredRequests = result.data.Result.filter(
            (request) =>
              request.status === "Pending" || request.status === "Accepted"
          );
          setPendingLeaveRequests(filteredRequests.slice(0, 3));
        } else {
          alert("Error fetching pending leave requests");
        }
      })
      .catch((error) => {
        console.error("Error fetching pending leave requests:", error);
      });
  };

  const fetchEvents = () => {
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
  };

  function calculateDuration(startDate, endDate) {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  const renderTileContent = ({ date, view }) => {
    if (view === "month") {
      // Convert the current date being rendered into a string format
      const normalizedDateString = date.toISOString().split("T")[0];

      // Extract the events for this particular date
      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.date);
        const eventDateString = eventDate.toISOString().split("T")[0];
        return eventDateString === normalizedDateString;
      });

      // Render the events if there are any
      if (dayEvents.length > 0) {
        return (
          <div className="event-highlight">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="event-marker bg-red-600 text-white leading-4 mt-2 px-1 rounded text-sm font-montserrat font-normal"
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

  return (
    <div className="container mx-auto h-screen scrolls p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-cyan-700 h-32 rounded-lg text-white p-4 hover:shadow-lg flex flex-col justify-center transform transition-transform duration-300 hover:scale-105">
          <div className="flex items-center">
            <h5 className="font-montserrat  text-xl">Admin</h5>
          </div>
          <div className="text-lg font-montserrat  mt-2">
            Total: {adminTotal}
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-600 via-pink-500 to-pink-400 text-white rounded-lg shadow-md p-4 flex flex-col justify-center transform transition-transform duration-300 hover:scale-105">
          <div className="flex items-center">
            <i className="bi bi-people-fill mr-2 text-2xl"></i>
            <h5 className="font-montserrat text-xl">Employee</h5>
          </div>
          <div className="text-lg font-semibold ml-2 mt-2">
            Total: {employeeTotal}
          </div>
        </div>

        <div className="relative bg-gradient-to-tr from-[#1b7e69] via-[#276b5c] to-[#2f3332] text-white h-32 rounded-lg shadow-md p-4 flex flex-col transform transition-transform duration-300 hover:scale-105 space-y-4 max-h-96 overflow-y-auto">
          <div className="">
            <div className="flex items-center">
              <i className="bi bi-calendar-check mr-2 text-2xl"></i>
              <h5 className="font-montserrat text-xl mt-4">Upcoming Leave:</h5>
            </div>
            {leaves.upcoming.length > 0 ? (
              <ul className="text-md font-montserrat ml-2 mt-2">
                {leaves.upcoming.map((leave) => (
                  <li key={leave._id} className="mb-2">
                    {leave.name} will be on leave from{" "}
                    {formatDate(new Date(leave.fromdate))} to{" "}
                    {formatDate(new Date(leave.todate))}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm px-2">
                No upcoming leave in the next 30 days.
              </p>
            )}

            <div>
              <div className="flex items-center">
                <h5 className="font-montserrat text-xl px-2">Past Leave:</h5>
              </div>
              {leaves.past.length > 0 ? (
                <ul className="text-md font-montserrat ml-2">
                  {leaves.past.map((leave) => (
                    <li key={leave._id} className="mb-2">
                      {leave.name} took leave from{" "}
                      {formatDate(new Date(leave.fromdate))} to{" "}
                      {formatDate(new Date(leave.todate))}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No past leave records.</p>
              )}
            </div>
          </div>

          {/* Downward Arrow for Scroll Indication */}
          <div className="absolute bottom-2  right-0 transform -translate-x-1/2 animate-bounce">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div className=" w-full bg-white rounded-lg shadow-md p-4 mb-4 transform transition-transform duration-300 hover:scale-95">
        <h4 className="text-center text-xl font-semibold mb-3">
          Upcoming Event
        </h4>

        <Calendar tileContent={renderTileContent} className="w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="  h-40  overflow-y-auto   bg-white  rounded-lg shadow-md px-3 ">
          <h4 className="text-center text-xl font-montserrat mb-3  py-2">
            List of Admins
          </h4>
          <div className=" ">
            <table className="w-full text-left">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin._id}>
                    <td className="p-2 border-r list-admin-name">
                      {admin.name}
                    </td>
                    <td className="p-2">{admin.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="overflow-y-auto h-40 bg-gray-100 rounded-lg shadow-md px-3 sm:px-2">
          <h4 className="text-center texts-fonts text-xl font-montserrat mb-3 py-2">
            Pending Leave Requests
          </h4>
          <div className="max-h-48">
            {/* Desktop Table */}
            <table className="w-full min-w-[640px] text-left hidden sm:table">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-2 pending-leave whitespace-nowrap">Name</th>
                  <th className="p-2 pending-leave whitespace-nowrap">
                    Duration
                  </th>
                  <th className="p-2 pending-leave whitespace-nowrap">
                    Reason
                  </th>
                  <th className="p-2 pending-leave whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingLeaveRequests.map((request) => (
                  <tr key={request._id}>
                    <td className="p-2 border">{request.name}</td>
                    <td className="p-2 w-10 duration border">
                      {calculateDuration(
                        new Date(request.fromdate),
                        new Date(request.todate)
                      )}
                    </td>
                    <td className="p-2 border">{request.reason}</td>
                    <td className="p-2 border max-w-[120px]">
                      <Link
                        to="/dashboard/leave_request"
                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 truncate"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile View */}
            <div className="block sm:hidden">
              {pendingLeaveRequests.map((request) => (
                <div
                  key={request._id}
                  className="mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow-md"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center font-bold mb-1 bg-gray-800 text-white px-1">
                      Name:
                    </div>
                    <div className="mb-2">{request.name}</div>

                    <div className="flex items-center font-bold mb-1 bg-gray-800 text-white px-1">
                      Duration:
                    </div>
                    <div className="mb-2">
                      {calculateDuration(
                        new Date(request.fromdate),
                        new Date(request.todate)
                      )}
                    </div>

                    <div className="flex items-center font-bold mb-1 bg-gray-800 text-white px-1">
                      Reason:
                    </div>
                    <div className="mb-2 whitespace-nowrap text-xs">
                      {request.reason}
                    </div>

                    <div className="flex items-center font-bold mb-1 px-1">
                      Action:
                    </div>
                    <Link
                      to="/dashboard/leave_request"
                      className="bg-gray-700 text-white py-1 px-3 w-20 rounded hover:bg-gray-800"
                    >
                      Manage
                    </Link>
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

export default Home;
