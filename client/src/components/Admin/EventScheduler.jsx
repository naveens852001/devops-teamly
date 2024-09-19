import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
  import './CSS/Calendar.css';
import axios from 'axios';
import toast from 'react-hot-toast';



const EventScheduler = () => {
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:10000"
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
    const today = new Date();
    const selectedEventDate = new Date(event.date);
    
    if (selectedEventDate < today) {
      toast.error("Event date cannot be in the past");
      return;
    }

    axios.post(`${apiUrl}/event`, event)
      .then(result => {
        if (result.data.Status) {
          toast.success("Event created successfully");
          setEvents([...events, { ...event, _id: result.data.Result._id }]);
        }
      })
      .catch(error => {
        toast.error("Error creating event");
        console.error(error);
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
      .catch(error => {
        toast.error("Error fetching events");
        console.error(error);
      });
  }, []);

  const renderEvents = (date) => {
    const dayEvents = events.filter(event => new Date(event.date).toDateString() === date.toDateString());
    return (
      <div className='event-highlight'>
        {dayEvents.map(event => (
          <div key={event._id} className="event">
            {event.title}
          </div>
        ))}
      </div>
    );
  };
  const handleDelete = (id) => {
    axios.delete(`${apiUrl}/event_delete/${id}`)
      .then(result => {
        if (result.data.Status) {
          toast.success("Successfully Deleted");
          setEvents(events.filter(event => event._id !== id));
        } else {
          toast.error("Error While Deleting: " + result.data.Message);
        }
      })
      .catch(error => {
        toast.error("Error While Deleting");
        console.error(error);
      });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-gray-100 w-11/12 py-2 rounded-lg shadow-md h-[90vh] overflow-y-auto mx-auto mb-5">

  <div className=" rounded-lg mb-5">
    <h2 className="text-center text-3xl font-montserrat">Events</h2>
    <hr className="my-4 border-gray-300" />
    <div className="flex flex-wrap">
     
      <div className="w-full md:w-2/5 p-3 py-0 my-0">
        <div className="bg-white py-2 px-4 rounded-lg shadow-md mb-5">
          <h3 className="text-center text-xl font-montserrat">Create Event</h3>
          <hr className="my-3 border-gray-300" />
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-lg font-medium mb-2">Title</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Enter Your Event Title"
                id="title"
                name="title"
                value={event.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="date" className="block text-lg font-medium mb-2">Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                id="date"
                name="date"
               
                value={event.date}
                onChange={handleInputChange}
                min={today}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="additional" className="block text-lg font-medium mb-2">Additional</label>
              <textarea
               
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Enter Your Event Details"
                id="additional"
                name="additional"
                value={event.additional}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-2 mb-1">Create Event</button>
          </form>
        </div>

      </div>

      <div className="w-full md:w-7/12 px-3 py-0">
        <div className="bg-white p-2 rounded-lg shadow-md mb-5">
          <h3 className="text-center text-xl font-montserrat">Calendar</h3>
          <hr className="my-3 border-gray-300" />
          <Calendar
            value={selectedDate}
            onClickDay={date => setSelectedDate(date)}
            tileContent={({ date, view }) => view === 'month' && renderEvents(date)}
          />
        </div>
      </div>
    </div>
    <hr className="my-2 border-gray-300" />
    
    <div className="m-3 text-center">
      <h3 className="text-2xl font-semibold">Event Log</h3>
      <div className="overflow-y-auto max-h-[400px] mb-5">
        <table className="min-w-full  bg-white border border-gray-300 rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Additional</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={event._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border">{event.title}</td>
                <td className="py-2 px-4 border">{new Date(event.date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border ">{event.additional}</td>
                <td className="py-2 px-4 border">
                  <button className="bg-red-500 text-white py-1 px-3 rounded" onClick={() => handleDelete(event._id)}>
                    Delete
                  </button>
                </td>
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
