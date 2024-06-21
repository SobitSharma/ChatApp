// import { useEffect, useState, useRef } from "react";
// import { useUserContext } from "../Context/UserContext";
// import { useNavigate } from "react-router-dom";
// import { useSocketContext } from "../Context/SocketContext";
// import notificationsound from "../assets/sounds/notification.mp3";

// const ChatRoom = () => {
//   const { sideBarUsers } = useUserContext();
//   const { userLogin } = useUserContext();
//   const [newMessage, setNewMessage] = useState("");
//   const [selectUser, setSelectUser] = useState(null);
//   const [previousmessages, setpreviousmessages] = useState({});
//   const [loading, setloading] = useState(false);
//   const navigate = useNavigate();
//   const { onlineusers, socket } = useSocketContext();
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     if (selectUser) {
//       fetch(`http://localhost:8000/api/messages/${selectUser._id}`, {
//         method: "GET",
//         credentials: "include",
//       })
//         .then((response) => response.json())
//         .then((result) => {
//           setpreviousmessages({ [selectUser.fullname]: result });
//           setloading(true);
//         });
//     }
//   }, [selectUser]);

//   useEffect(() => {
//     if (socket) {
//       socket.on("newMessage", (newMessage) => {
//         newMessage.shouldshake = true;
//         const sound = new Audio(notificationsound);
//         sound.play();
//         if (newMessage.senderId !== userLogin._id) {
//           setpreviousmessages((previous) => {
//             const userMessages = previous[selectUser?.fullname] || [];
//             return {
//               ...previous,
//               [selectUser?.fullname]: [...userMessages, newMessage],
//             };
//           });
//         }
//         scrollToBottom();
//       });
//     }

//     return () => {
//       if (socket) {
//         socket.off("newMessage");
//       }
//     };
//   }, [socket, selectUser, userLogin._id]);

//   const HandleSendMessages = (e) => {
//     e.preventDefault();
//     if (newMessage) {
//       const messageData = {
//         message: newMessage,
//         senderId: userLogin._id,
//         _id: Date.now().toString(),
//       };
//       setpreviousmessages((previous) => {
//         const userMessages = previous[selectUser.fullname] || [];
//         return {
//           ...previous,
//           [selectUser.fullname]: [...userMessages, messageData],
//         };
//       });
//       fetch(`http://localhost:8000/api/messages/send/${selectUser._id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ message: newMessage }),
//         credentials: "include",
//       })
//         .then((response) => response.json())
//         .catch((err) => alert("There is an error while sending this message. Please send it again."));
//       setNewMessage("");
//       scrollToBottom();
//     } else {
//       alert("Empty message cannot be sent");
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [previousmessages, loading]);

//   function HandlebackToLogin() {
//     navigate("/login");
//   }

//   function HandleLogout() {
//     fetch("http://localhost:8000/api/auth/logout", {
//       method: "POST",
//       credentials: 'include'
//     }).then((response) => {
//       if (response.ok) {
//         alert("You have successfully logged out");
//         navigate("/login");
//       }
//     })
//   }

//   return userLogin ? (
//     <div className="flex h-screen bg-gray-100">
//       <div className="flex flex-col w-1/4 bg-gray-200 border-r">
//         <div className="flex flex-col items-center p-4 border-b bg-white">
//           <div className="flex flex-row">
//             <h2 className="text-xl font-semibold">Contacts</h2>
//             <img 
//               src="https://cdn1.iconfinder.com/data/icons/heroicons-ui/24/logout-512.png" 
//               alt="Logout" 
//               className="rounded-xl bg-gray-400 h-10 ml-6 hover:cursor-pointer"
//               onClick={HandleLogout}
//             />
//           </div>
//         </div>
//         <div className="overflow-y-auto flex-grow">
//           {sideBarUsers.map((user) => (
//             <div
//               className={`flex items-center p-4 cursor-pointer hover:bg-gray-300 ${
//                 selectUser && selectUser._id === user._id ? "bg-gray-400" : ""
//               }`}
//               key={user._id}
//               onClick={() => {
//                 setSelectUser((previous) => {
//                   if (!(previous === user)) {
//                     setloading(false);
//                     return user;
//                   }
//                 });
//               }}
//             >
//               <img
//                 src={user.profilePic}
//                 alt=""
//                 className="rounded-full h-12 w-12"
//               />
//               <div className="ml-4">
//                 <div className="text-lg font-semibold">{user.username}</div>
//                 <div
//                   className={`text-sm ${
//                     onlineusers.includes(user._id)
//                       ? "text-green-500"
//                       : "text-red-500"
//                   }`}
//                 >
//                   {onlineusers.includes(user._id) ? "Online" : "Offline"}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="flex flex-col w-3/4 bg-white">
//         {selectUser ? (
//           <>
//             <div className="flex items-center p-4 bg-gray-100 border-b">
//               <img
//                 src={selectUser.profilePic}
//                 alt=""
//                 className="rounded-full h-12 w-12"
//               />
//               <div className="ml-4">
//                 <div className="text-lg font-semibold">
//                   {selectUser.fullname}
//                 </div>
//                 <div
//                   className={`text-sm ${
//                     onlineusers.includes(selectUser._id)
//                       ? "text-green-500"
//                       : "text-red-500"
//                   }`}
//                 >
//                   {onlineusers.includes(selectUser._id) ? "Online" : "Offline"}
//                 </div>
//               </div>
//             </div>
//             <div className="flex flex-col flex-grow p-4 overflow-y-auto">
//               <ul className="space-y-2">
//                 {loading
//                   ? previousmessages[selectUser.fullname].map((message) =>
//                       message.senderId === selectUser._id ? (
//                         <li
//                           className={`bg-gray-300 p-4 rounded-lg self-start max-w-xs ${
//                             message.shouldshake ? "shake" : ""
//                           }`}
//                           key={message._id}
//                         >
//                           {message.message}
//                         </li>
//                       ) : (
//                         <li
//                           className={`bg-blue-500 text-white p-4 rounded-lg self-end max-w-xs ${
//                             message.shouldshake ? "shake" : ""
//                           }`}
//                           key={message._id}
//                         >
//                           {message.message}
//                         </li>
//                       )
//                     )
//                   : "Loading previous messages..."}
//                 <div ref={messagesEndRef} />
//               </ul>
//             </div>
//             <form
//               onSubmit={HandleSendMessages}
//               className="flex items-center p-4 border-t bg-gray-100"
//             >
//               <input
//                 value={newMessage}
//                 className="flex-grow rounded-full p-2 border-gray-300 focus:outline-none"
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 placeholder="Type a message"
//               />
//               <button
//                 type="submit"
//                 className="ml-4 bg-blue-500 text-white p-2 rounded-full"
//               >
//                 Send
//               </button>
//             </form>
//           </>
//         ) : (
//           <div className="flex items-center justify-center flex-grow bg-gray-100">
//             <div className="text-xl font-semibold text-gray-600">
//               Select a user to start chatting
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   ) : (
//     <div className="flex items-center justify-center h-screen bg-gray-200">
//       <div className="text-center">
//         <h1 className="text-2xl font-semibold mb-4">Please Login Again</h1>
//         <button
//           onClick={HandlebackToLogin}
//           className="bg-blue-500 text-white p-2 rounded-lg"
//         >
//           Login Page
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatRoom;


<div className="flex flex-col flex-grow bg-white p-4 overflow-y-auto">
  <ul className="space-y-2">
    {loading
      ? previousmessages[selectUser.fullname].map((message, index) => {
          const isEven = index % 2 === 0;
          const messageClasses = message.senderId == selectUser._id 
            ? `p-2 rounded-lg max-w-xs flex ${message.shouldshake ? "shake" : ''}`
            : `text-white p-2 rounded-lg max-w-xs flex ${message.shouldshake ? "shake" : ''}`;

          return (
            <li
              className={`${messageClasses} ${isEven ? "bg-gray-200 self-end flex-row-reverse" : "bg-blue-500 justify-start"}`}
              key={message._id}
              style={{
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                maxWidth: '75%', // Adjust this as needed
              }}
            >
              {message.message}
            </li>
          );
        })
      : "Loading previous messages..."}
  </ul>
</div>
