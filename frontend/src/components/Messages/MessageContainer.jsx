import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { GET_MESSAGES, ADD_MESSAGE } from '../../utils/constants';
import { useStateProvider } from '../../context/StateContext';

const MessageContainer = ({ orderId, sellerInfo }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [{ userInfo }] = useStateProvider();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const { data } = await axios.get(`${GET_MESSAGES}/${orderId}`, {
  //         withCredentials: true,
  //       });
  //       setMessages(data.messages);
  //     } catch (err) {
  //       console.error('Error fetching messages:', err);
  //       // setError('Failed to load messages. Please try again later.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchMessages();
  // }, [orderId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data } = await axios.post(
        ADD_MESSAGE,
        {
          orderId,
          content: newMessage,
        },
        { withCredentials: true }
      );

      setMessages(prevMessages => [...prevMessages, data.message]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  // Dummy chat for demo
  const dummyMessages = [
    {
      sender: userInfo?.id,
      content: "Hi, I'm interested in your gig!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      sender: 'seller',
      content: "Hello! Thanks for reaching out. How can I help you?",
      timestamp: new Date(Date.now() - 1000 * 60 * 55),
    },
    {
      sender: userInfo?.id,
      content: "Can you deliver in 2 days?",
      timestamp: new Date(Date.now() - 1000 * 60 * 50),
    },
    {
      sender: 'seller',
      content: "Yes, that's possible!",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
    },
  ];

  // If no orderId (Contact Seller), always show dummy chat and skip loading/error
  if (!orderId) {
    return (
      <div className="h-full flex flex-col">
        {/* Chat Model/Header */}
        <div className="flex items-center gap-3 border-b px-6 py-4 bg-gray-50">
          {sellerInfo?.profile_picture ? (
            <img
              src={sellerInfo.profile_picture}
              alt={sellerInfo.full_name || 'Seller'}
              className="w-10 h-10 rounded-full object-cover border"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-lg font-bold text-white">
              {sellerInfo?.full_name?.[0]?.toUpperCase() || 'S'}
            </div>
          )}
          <div>
            <div className="font-semibold text-gray-800">{sellerInfo?.full_name || 'Seller'}</div>
            <div className="text-xs text-green-500 font-medium">Online</div>
          </div>
        </div>
        {/* Messages Display */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-6 py-4">
          {dummyMessages.concat(messages).map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === userInfo?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === userInfo?.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs mt-1 opacity-75">
                  {new Date(message.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="mt-4 px-6 pb-4">
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
              disabled={!newMessage.trim()}
              className={`px-4 py-2 rounded-lg ${
                newMessage.trim()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] my-10 pt-24 px-8 md:px-32 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] my-10 pt-24 px-8 md:px-32 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Model/Header */}
      <div className="flex items-center gap-3 border-b px-6 py-4 bg-gray-50">
        {sellerInfo?.profile_picture ? (
          <img
            src={sellerInfo.profile_picture}
            alt={sellerInfo.full_name || 'Seller'}
            className="w-10 h-10 rounded-full object-cover border"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-lg font-bold text-white">
            {sellerInfo?.full_name?.[0]?.toUpperCase() || 'S'}
          </div>
        )}
        <div>
          <div className="font-semibold text-gray-800">{sellerInfo?.full_name || 'Seller'}</div>
          <div className="text-xs text-green-500 font-medium">Online</div>
        </div>
      </div>
      {/* Messages Display */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-6 py-4">
        {(messages.length === 0 ? dummyMessages : messages).map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === userInfo?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === userInfo?.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-75">
                {new Date(message.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="mt-4 px-6 pb-4">
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
            disabled={!newMessage.trim()}
            className={`px-4 py-2 rounded-lg ${
              newMessage.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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