import React, { useEffect, useState } from "react";
import { useUserContext } from "../Context/UserContext";
import {useNavigate} from "react-router-dom"

const ChatRoom = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [previousMessages, setPreviousMessages] = useState([]);
  const [messageSent, setMessageSent] = useState(false);  // New state for triggering updates
  const { sideBarUsers } = useUserContext();
  const navigate = useNavigate()

  useEffect(() => {
    if (selectedUser) {
      fetch(`http://localhost:8000/api/messages/${selectedUser._id}`, {
        method: 'GET',
        credentials: 'include'
      })
        .then((response) => response.json())
        .then((result) => setPreviousMessages(result));
    }
  }, [selectedUser, messageSent]);  // Add messageSent to the dependency array

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };
 

  const handleSendingMessage = () => {
    if(newMessage){
      fetch(`http://localhost:8000/api/messages/send/${selectedUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: newMessage }),
        credentials: 'include'
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          setNewMessage('');
          setMessageSent(!messageSent);  // Toggle messageSent state to trigger useEffect
        })
        .catch((error) => console.error(error));
    }
    else{
      alert('Message cannot be empty')
    }
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
                  className={`text-xs ${
                    user.online ? "text-green-500" : "text-gray-500"
                  }`}
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
            {
              previousMessages.length>1 ? <ul id="messagelist" className="bg-white text-black text-xl p-2">
              {previousMessages.map((message) => (
                <li key={message._id} className="bg-green-400 text-red-500 mb-1">{message.message}</li>
              ))}
            </ul> : ''
            }
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
