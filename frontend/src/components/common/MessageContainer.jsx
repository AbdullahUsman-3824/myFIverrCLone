import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { GET_MESSAGES, ADD_MESSAGE } from "../../utils/constants";
import { useStateProvider } from "../../context/StateContext";

const MessageContainer = ({ sellerInfo }) => {
  const { orderId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [{ userInfo }] = useStateProvider();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch real messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`${GET_MESSAGES}/${orderId}`, {
          withCredentials: true,
        });
        setMessages(data.messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchMessages();
  }, [orderId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data } = await axios.post(
        ADD_MESSAGE,
        { orderId, content: newMessage },
        { withCredentials: true }
      );
      setMessages((prev) => [...prev, data.message]);
      setNewMessage("");
    } catch (err) {
      console.error("Send error:", err);
      setError("Failed to send message.");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center pt-28">
        <div className="text-center text-gray-500">
          <div className="animate-spin h-10 w-10 border-b-2 border-[#1dbf73] mx-auto rounded-full"></div>
          <p className="mt-4">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex justify-center items-center pt-28">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#1dbf73] text-white rounded hover:bg-[#19a463]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-6 py-4 bg-white">
        {sellerInfo?.profile_picture ? (
          <img
            src={sellerInfo.profile_picture}
            alt="Seller"
            className="w-10 h-10 rounded-full object-cover border"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#1dbf73] flex items-center justify-center text-white font-semibold">
            {sellerInfo?.full_name?.[0]?.toUpperCase() || "S"}
          </div>
        )}
        <div>
          <div className="font-semibold text-gray-800">
            {sellerInfo?.full_name || "Seller"}
          </div>
          <div className="text-xs text-green-500">Online</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50">
        {messages.map((msg, i) => {
          const isSender = msg.sender === userInfo?.id;
          return (
            <div
              key={i}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-lg shadow-sm ${
                  isSender
                    ? "bg-[#1dbf73] text-white"
                    : "bg-white text-gray-800 border"
                }`}
              >
                <p>{msg.content}</p>
                <p className="text-[11px] mt-1 opacity-70">
                  {new Date(msg.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-[#1dbf73]"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`px-5 py-2 rounded-lg text-white transition ${
              newMessage.trim()
                ? "bg-[#1dbf73] hover:bg-[#19a463]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageContainer;
