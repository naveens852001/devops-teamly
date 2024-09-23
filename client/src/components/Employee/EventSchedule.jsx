import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import toast from 'react-hot-toast';
import "../Admin/CSS/EventCalendar.css";

const EventScheduler = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:10000";
  const [event, setEvent] = useState({
    title: '',
    date: '',
    additional: ''
  });
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent({
      ...event,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = { ...event, id: events.length }; 
    setEvents([...events, newEvent]);
    axios.post(`${apiUrl}/event`, event)
      .then(result => {
        if (result.data.Status) {
          toast.success("Event created successfully");
        }
      });
    setEvent({
      title: '',
      date: '',
      additional: ''
    });

  };

  useEffect(() => {
    axios.get(`${apiUrl}/events`)
      .then(result => {
        if (result.data.Status) {
          setEvents(result.data.Result);
        }
      })
  }, []);

  const renderEvents = (date) => {
    const dayEvents = events.filter(event => new Date(event.date).toDateString() === date.toDateString());
    return (
      <div className='event-highlight'>
        {dayEvents.map(event => (
          <div key={event.id} className="event">
            {event.title}

          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 mb-3">
  <div className="flex flex-wrap justify-between gap-4">
    {/* Calendar */}
    <div className="w-full md:w-1/3 lg:w-2/3 mx-auto bg-gray-100 shadow-lg rounded-lg p-4 transform transition-transform duration-300 hover:scale-105">
      <h3 className="text-center text-xl font-semibold text-blue-600 mt-2">Calendar</h3>
      <hr className="my-2" />
      <div className="calendar-container bg-gray-200 p-4 rounded-lg shadow-lg">
        <Calendar
          value={selectedDate}
          onClickDay={date => setSelectedDate(date)}
          tileContent={({ date, view }) => view === 'month' && renderEvents(date)}
        />
      </div>
    </div> 

    {/* Event Log */}
    <div className="w-full md:w-1/4 lg:w-2/3 mx-auto bg-gray-100 shadow-lg rounded-lg p-4 max-h-[500px] overflow-y-auto transform transition-transform duration-300 hover:scale-105">
      <h3 className="text-center text-xl font-semibold text-blue-600 flex items-center justify-center mb-2">
        <i className="bi bi-calendar-event text-2xl mr-2" /> Event Log
      </h3>
      <hr className="my-2" />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Title</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Additional</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2 text-sm border-r text-gray-900">{event.title}</td>
                <td className="px-4 py-2 text-sm border-r text-gray-900">{new Date(event.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-sm border-r text-gray-900 ">{event.additional}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

  );
};

export default EventScheduler;
