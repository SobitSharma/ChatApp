import { useEffect, useState, useRef } from "react";
import { useUserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../Context/SocketContext";
import notificationsound from "../assets/sounds/notification.mp3";

const ChatRoom = () => {
  const { sideBarUsers } = useUserContext();
  const { userLogin, UserInfo } = useUserContext();
  const [newMessage, setNewMessage] = useState("");
  const [selectUser, setSelectUser] = useState(null);
  const [previousmessages, setpreviousmessages] = useState({});
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const { onlineusers, socket } = useSocketContext();
  const messagesEndRef = useRef(null);


  useEffect(() => {
    if (selectUser) {
      if(previousmessages?.[selectUser.fullname]){
        setloading(true)
        return
      }
      fetch(`http://localhost:8000/api/messages/${selectUser._id}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((result) => {
          setpreviousmessages((previous)=>{
            return {...previous, [selectUser.fullname]:result}
          });
        });
    }
  }, [selectUser]);

  useEffect(()=> {
    setloading(true);
  }, [previousmessages])

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (newMessage) => {
        console.log(newMessage)
        newMessage.shouldshake = true;
        const sound = new Audio(notificationsound);
        sound.play();
        if (newMessage.senderId !== UserInfo._id) {
          const tempUser = sideBarUsers.filter(
            (user) => user._id == newMessage.senderId
          );
          setpreviousmessages((previous) => {
            const userMessages = previous[tempUser[0]?.fullname] || [];
            return {
              ...previous,
              [tempUser[0]?.fullname]: [...userMessages, newMessage],
            };
          });
        }
        scrollToBottom();
      });
    }

    return () => {
      if (socket) {
        socket.off("newMessage");
      }
    };
  }, [socket, selectUser, userLogin._id]);

  const HandleSendMessages = (e) => {
    e.preventDefault();
    if (newMessage) {
      const messageData = {
        message: newMessage,
        senderId: UserInfo._id,
        updatedAt:new Date().toISOString(),
        receiverId: selectUser._id,
        _id: Date.now().toString(),
      };
      setpreviousmessages((previous) => {
        const userMessages = previous[selectUser.fullname] || [];
        return {
          ...previous,
          [selectUser.fullname]: [...userMessages, messageData],
        };
      });
      fetch(`http://localhost:8000/api/messages/send/${selectUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage }),
        credentials: "include",
      })
        .then((response) => response.json())
        .catch((err) =>
          alert(
            "There is an error while sending this message. Please send it again."
          )
        );
      setNewMessage("");
      scrollToBottom();
    } else {
      alert("Empty message cannot be sent");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [previousmessages, loading]);

  function HandlebackToLogin() {
    navigate("/login");
  }

  function HandleLogout() {
    fetch("http://localhost:8000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        alert("You have successfully logged out");
        navigate("/login");
      }
    });
  }

  useEffect(()=>{scrollToBottom()}, [selectUser])

  function convertDataAndTime(isoString){
    const date = new Date(isoString);
  
    let hours = date.getHours();  
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
  
    hours = hours % 12;
    hours = hours ? hours : 12;  
    const formattedHours = hours.toString().padStart(2, "0");
  
    const formattedTime = `${formattedHours}:${minutes} ${ampm}`;
    return formattedTime;
  }

  return userLogin ? (
    <div className="flex h-screen bg-gray-100">
      
      <div className="flex flex-col w-1/4 bg-gray-200 border-r">
        <div className="flex flex-col items-center p-4 border-b bg-white">
          <div className="flex flex-row">
            <h2 className="text-xl font-semibold">Contacts</h2>
            <img
              src="https://cdn1.iconfinder.com/data/icons/heroicons-ui/24/logout-512.png"
              alt="Logout"
              className="rounded-xl bg-gray-400 h-10 ml-6 hover:cursor-pointer"
              onClick={HandleLogout}
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-grow p-4 bg-gray-100">
  {sideBarUsers?.map((user) => (
    <div
      className={`flex flex-col sm:flex-row items-center p-4 mb-2 rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:bg-gray-200 ${
        selectUser && selectUser._id === user._id ? "bg-gray-300" : ""
      }`}
      key={user._id}
      onClick={() => {
        setSelectUser((previous) => {
          if (previous !== user) {
            setloading(true);
            return user;
          } else {
            return previous;
          }
        });
      }}
    >
      <img
        src={user.profilePic}
        alt=""
        className="rounded-full h-12 w-12 object-cover"
      />
      <div className="ml-4 mt-2 sm:mt-0 flex-grow text-center sm:text-left">
        <div className="text-lg font-semibold text-gray-800">{user.username}</div>
        <div
          className={`text-sm ${
            onlineusers.includes(user._id)
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {onlineusers.includes(user._id) ? "Online" : "Offline"}
        </div>
      </div>
    </div>
  ))}
</div>


      </div>
      <div className="flex flex-col w-3/4 bg-white">
        {selectUser ? (
          <>
            <div className="flex items-center p-4 bg-gray-100 border-b">
              <img
                src={selectUser.profilePic}
                alt=""
                className="rounded-full h-12 w-12"
              />
              <div className="ml-4">
                <div className="text-lg font-semibold">
                  {selectUser.fullname}
                </div>
                <div
                  className={`text-sm ${
                    onlineusers.includes(selectUser._id)
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {onlineusers.includes(selectUser._id) ? "Online" : "Offline"}
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-grow p-4 overflow-y-auto">
              <ul className="space-y-2">
                {loading ? (
                  previousmessages[selectUser.fullname]?.map((message) =>
                    message.senderId === UserInfo._id ? (
                      <div
                        key={message._id}
                        className="flex flex-row items-start"
                      >
                        <img
                          src={UserInfo.profilePic}
                          alt=""
                          className="h-10 rounded-full mr-2"
                        />
                        <div
                          className={`bg-gray-300 p-4 rounded-lg max-w-xs${
                            message.shouldshake ? " shake" : ""
                          }`}
                        >
                          <p
                            className="mb-1"
                            style={{
                              wordBreak: "break-word",
                              whiteSpace: "pre-wrap",
                              maxWidth: "100%", 
                            }}
                          >
                            {message.message}
                          </p>
                          <p className="text-xs text-gray-600">
                            {convertDataAndTime(message.updatedAt)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={message._id}
                        className="flex flex-row items-start justify-end"
                      >
                        <div
                          className={`bg-blue-500 text-white p-4 rounded-lg max-w-xs ml-10${
                            message.shouldshake ? " shake" : ""
                          }`}
                        >
                          <p
                            className="mb-1"
                            style={{
                              wordBreak: "break-word",
                              whiteSpace: "pre-wrap",
                              maxWidth: "100%",
                            }}
                          >
                            {message.message}
                          </p>
                          <p className="text-xs text-white">
                            {convertDataAndTime(message.updatedAt)}
                          </p>
                        </div>
                        <img
                          src={selectUser.profilePic}
                          alt=""
                          className="h-10 rounded-full ml-2"
                        />
                      </div>
                    )
                  )
                ) : (
                  <p>Loading previous messages...</p>
                )}
                <div ref={messagesEndRef} />
              </ul>
            </div>

            <form
              onSubmit={HandleSendMessages}
              className="flex items-center p-4 border-t bg-gray-100"
            >
              <input
                value={newMessage}
                className="flex-grow rounded-full p-2 border-gray-300 focus:outline-none"
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
              />
              <button
                type="submit"
                className="ml-4 bg-blue-500 text-white p-2 rounded-full"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center flex-grow bg-gray-100">
            <div className="text-xl font-semibold text-gray-600">
              Select a user to start chatting
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Please Login Again</h1>
        <button
          onClick={HandlebackToLogin}
          className="bg-blue-500 text-white p-2 rounded-lg"
        >
          Login Page
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
