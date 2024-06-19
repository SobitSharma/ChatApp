import React, { useEffect, useState } from "react";
import { useUserContext } from "../Context/UserContext";

const ChatRoom = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [previousMessages, setPreviousMessages] = useState([]);
  const [messageSent, setMessageSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { sideBarUsers } = useUserContext();

  const getPreviousMessages = async () => {
    if (selectedUser) {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/messages/${selectedUser._id}`, {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json(); 
        setPreviousMessages(previous => {
          const exists = previous.find(item => item[selectedUser.fullname]);
          if (!exists) {
            return [...previous, { [selectedUser.fullname]: result }];
          }
          return previous.map(item =>
            item[selectedUser.fullname] ? { [selectedUser.fullname]: result } : item
          );
        });
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (selectedUser) {
      getPreviousMessages();
    }
  }, [selectedUser, messageSent]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setMessageSent(prev => !prev); // Trigger messageSent to fetch messages
  };

  const handleSendingMessage = async () => {
    if (newMessage) {
      try {
        const response = await fetch(`http://localhost:8000/api/messages/send/${selectedUser._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: newMessage }),
          credentials: 'include'
        });
        const result = await response.json();
        console.log(result);
        setNewMessage('');
        await getPreviousMessages(); // Fetch messages after sending
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      alert('Message cannot be empty');
    }
  };

  const renderMessages = () => {
    const messagesObj = previousMessages.find(item => item[selectedUser.fullname]);
    if (messagesObj) {
      const messages = messagesObj[selectedUser.fullname];
      return (
        <ul id="messagelist" className="bg-white text-black text-xl p-2">
          {messages.map((message) => (
            <li key={message._id} className="bg-green-400 text-red-500 mb-1">
              {message.message}
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-lg font-bold mb-4">Users</h2>
        <ul>
          {sideBarUsers.map((user) => (
            <li
              key={user._id}
              className="flex items-center p-2 mb-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleUserClick(user)}
            >
              <img
                src={user.profilePic}
                alt={user.fullname}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="text-sm font-semibold">{user.fullname}</h3>
                <span
                  className={`text-xs ${user.online ? "text-green-500" : "text-gray-500"}`}
                >
                  {user.online ? "Online" : "Offline"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4 bg-white p-4">
        {selectedUser ? (
          <div>
            <h2 className="text-lg font-bold mb-4">Send Message to {selectedUser.fullname}</h2>
            <div>
              {loading ? (
                <div>Loading messages...</div>
              ) : (
                renderMessages()
              )}
            </div>
            <div className="border p-4 rounded">
              <input
                className="w-full p-2 border rounded mb-4"
                rows="5"
                value={newMessage}
                placeholder="Type your message..."
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSendingMessage}>
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">Select a user to start messaging</div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
