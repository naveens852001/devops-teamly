import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { MdVideoCall } from "react-icons/md";
import { TbPhoneCalling } from "react-icons/tb";
import io from "socket.io-client";

function Chatteamly() {
   const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:10000";
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [newMessages, setNewMessages] = useState([]);
  const [socketId, setSocketId] = useState("");
  const socket = useMemo(() => io(`http://localhost:10000`), []);

  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsChatOpen((prevState) => !prevState);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("message", { message, sender: socketId });
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    socket.on("receive-message", (data) => {
      setNewMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [newMessages]);

  return (
    <div>
      {/* Active Members Section */}
      <div className="active-chatbox bg-white w-full h-28 rounded-lg shadow-lg p-4 flex flex-col justify-between mb-4">
        <h1 className="font-montserrat text-md font-bold text-gray-800 mb-2">
          Active Members
        </h1>
        <div className="chat-members flex space-x-4">
          {[1, 2, 3, 4].map((_, index) => (
              <div
              key={index}
                className="relative w-12 h-12 cursor-pointer"
              onClick={() => setIsChatOpen(true)} 
              >
                <img
                src="/images/round-img.png"
                alt={`Chat Member ${index + 1}`}
                  className="w-full h-full rounded-full object-cover border-2 border-gray-200 transform transition-transform duration-300 hover:scale-90"
                />
              <div className="absolute bottom-1 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      {isChatOpen && (
        <div className="chat-section bg-gray-200 mt-5 lg:w-7/12 min-h-[400px] rounded-lg mx-auto shadow-lg flex flex-col">
          <div className="chat-heading flex justify-between items-center px-4 py-2 bg-white rounded-t-lg shadow-md">
            <h5 className="font-montserrat text-xl font-medium text-gray-800">
              Trilok
            </h5>
            <div className="chat-features flex space-x-4 items-center cursor-pointer">
              <span className="text-2xl text-gray-700 hover:text-black">
                <MdVideoCall />
              </span>
              <span className="text-2xl text-gray-700 hover:text-black">
                <TbPhoneCalling />
              </span>
              <span className="text-2xl text-gray-700 hover:text-black">
                <FaExclamationCircle />
              </span>
            </div>
          </div>

          <div className="chat-messages flex-1 px-4 py-2 overflow-y-auto">
            {/* Message Display Section */}
            <div className="messages mb-4">
              {newMessages.map((m, i) => (
                <div
                  key={i}
                  className={`chat-box px-4 py-2 rounded-lg shadow-md ${
                    m.sender === socketId
                      ? "bg-blue-100 text-right self-end ml-auto"
                      : "bg-white text-left self-start mr-auto"
                  } ${
      i > 0 && newMessages[i - 1].sender !== m.sender ? "mt-3" : "mt-1"
                  }`}
    style={{ maxWidth: "60%" }}
                >
                  {m.message}
                </div>
              ))}


              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Section */}
          <div className="input-section flex items-center bg-gray-100 p-2 rounded-b-lg border-t border-gray-300">
            <form onSubmit={handleSubmit} className="flex w-full">
              <input
                type="text"
                placeholder="Type your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatteamly;
