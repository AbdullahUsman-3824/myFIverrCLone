import React, { useEffect, useState } from "react";
import axios from "axios";
// import { useAuth } from "../../context/AuthContext";

const SellerMessages = () => {
  // const { user } = useAuth();
  const user = { _id: "seller123", username: "TestSeller" };
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const dummyMessages = [
      {
        _id: "msg1",
        buyer: { username: "BuyerOne" },
        gig: { title: "Logo Design" },
        updatedAt: new Date(),
        isRead: false,
        messages: [
          {
            sender: "buyer1",
            content: "Hi, is the logo package still available?",
            timestamp: new Date(),
          },
          {
            sender: "seller123",
            content: "Yes, it is! Do you have any design preferences?",
            timestamp: new Date(),
          },
        ],
      },
      {
        _id: "msg2",
        buyer: { username: "BuyerTwo" },
        gig: { title: "Website Development" },
        updatedAt: new Date(),
        isRead: true,
        messages: [
          {
            sender: "buyer2",
            content: "Can we finish this project by next week?",
            timestamp: new Date(),
          },
          {
            sender: "seller123",
            content: "Sure, I’ll start tomorrow.",
            timestamp: new Date(),
          },
        ],
      },
    ];
  
    setMessages(dummyMessages);
    setLoading(false);
  }, []);
  

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedMessage || !newMessage.trim()) return;

    try {
      const response = await axios.post(
        `/api/seller/messages/${selectedMessage._id}`,
        { content: newMessage },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setMessages(messages.map(msg =>
          msg._id === selectedMessage._id
            ? { ...msg, messages: [...msg.messages, response.data.message] }
            : msg
        ));
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      const response = await axios.put(
        `/api/seller/messages/${messageId}/read`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setMessages(messages.map(msg =>
          msg._id === messageId ? { ...msg, isRead: true } : msg
        ));
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  // if (!user) {
  //   return <div>Please login to view this page</div>;
  // }

  // if (loading) {
  //   return <div>Loading messages...</div>;
  // }

  return (
    <div className="min-h-[80vh] my-10 pt-24 px-8 md:px-32">
      <h1 className="text-2xl font-bold mb-6">Your Messages</h1>

      <div className="flex gap-6">
        {/* Message List */}
        <div className="w-1/3">
          {messages.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No messages found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`p-4 cursor-pointer rounded-lg ${
                    selectedMessage?._id === message._id
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-white hover:bg-gray-50"
                  } ${!message.isRead ? "font-semibold" : ""}`}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.isRead) {
                      markAsRead(message._id);
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-lg">{message.buyer.username}</p>
                      <p className="text-sm text-gray-500">
                        {message.gig.title}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(message.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2 truncate">
                    {message.messages[message.messages.length - 1]?.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          {selectedMessage ? (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto mb-4">
                {selectedMessage.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      msg.sender === user._id ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        msg.sender === user._id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {new Date(msg.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="mt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerMessages; 