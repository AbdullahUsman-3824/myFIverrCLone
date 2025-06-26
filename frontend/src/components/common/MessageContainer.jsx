import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useStateProvider } from "../../context/StateContext";

const MessageContainer = ({ sellerInfo }) => {
  const { orderId } = useParams();
  const [{ userInfo }] = useStateProvider();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "seller-id",
      content: "Hi there! Let me know how I can help you.",
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      sender: userInfo?.id,
      content: "Sure! I want a modern logo for my brand.",
      timestamp: new Date().toISOString(),
    },
    {
      id: 3,
      sender: "seller-id",
      content: "Got it! I’ll send over a concept in 24 hours.",
      timestamp: new Date().toISOString(),
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      sender: userInfo?.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, message]);  
    setNewMessage("");
  };

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
        {messages.map((msg) => {
          const isSender = msg.sender === userInfo?.id;
          return (
            <div
              key={msg.id}
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
