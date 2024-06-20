import { useContext, useEffect, useState } from "react";
import { useUserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../Context/SocketContext";

const ChatRoom = () => {
  const { sideBarUsers } = useUserContext();
  const { userLogin } = useUserContext();
  const [newMessage, setNewMessage] = useState("");
  const [selectUser, setSelectUser] = useState(null);
  const [previousmessages, setpreviousmessages] = useState({});
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const { onlineusers } = useSocketContext();

  useEffect(() => {
    if (selectUser) {
      fetch(`http://localhost:8000/api/messages/${selectUser._id}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((result) => {
          setpreviousmessages({ [selectUser.fullname]: result });
          setloading(true);
        });
    }
  }, [selectUser]);

  const HandleSendMessages = (e) => {
    e.preventDefault();
    if (newMessage) {
      fetch(`http://localhost:8000/api/messages/send/${selectUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage }),
        credentials: "include",
      })
        .then((response) => response.json())
        .then((result) => {
          setpreviousmessages((previous) => {
            const userMessages = previous[selectUser.fullname] || [];
            return {
              ...previous,
              [selectUser.fullname]: [...userMessages, result],
            };
          });
          setNewMessage("");
        })
        .catch((err) => console.log(err));
    } else {
      alert("Empty message cannot be sent");
    }
  };

  const HandlebackToLogin = () => {
    navigate("/login");
  };

  function UselistenMessage() {
    const { socket } = useSocketContext();
    useEffect(() => {
      socket?.on("newMessage", (newMessage) => {
        setpreviousmessages((previous) => {
          const userMessages = previous[selectUser?.fullname] || [];
          return {
            ...previous,
            [selectUser?.fullname]: [...userMessages, newMessage],
          };
        });
      });
    }, [socket, selectUser]);
  }

  UselistenMessage();

  return userLogin ? (
    <>
      <div className="flex flex-row p-4">
        <div className="bg-gray-500 flex flex-col gap-2 h-max w-1/4 p-8 ">
          {sideBarUsers.map((user) => {
            return (
              <div
                className="bg-black text-white text-xl flex flex-row gap-4"
                key={user._id}
                onClick={() => {
                  setSelectUser(user);
                  setloading(false);
                }}
              >
                <img
                  src={user.profilePic}
                  alt=""
                  className="rounded-xl border-red-500 h-10 w-8"
                />
                <b className="text-2xl text-blue-400">{user.fullname}</b>
                <b
                  className={
                    onlineusers.includes(user._id)
                      ? "bg-green-400"
                      : "bg-red-400"
                  }
                >
                  {onlineusers.includes(user._id) ? "Online" : "Offline"}
                </b>
              </div>
            );
          })}
        </div>
        {selectUser ? (
          <div className="bg-blue-400 text-2xl flex flex-col gap-12 p-5">
            <h1 className="text-black">
              Send Messages To {selectUser.fullname}
            </h1>
            <ul className="bg-gray-400 text-xl flex flex-col gap-2 p-1">
              {loading
                ? previousmessages[selectUser.fullname].map((message) =>
                    message.senderId == selectUser._id ? (
                      <li
                        className="bg-green-400 flex justify-end p-2 rounded-2xl"
                        key={message._id}
                      >
                        {message.message}
                      </li>
                    ) : (
                      <li
                        className="bg-red-400 p-2 rounded-2xl"
                        key={message._id}
                      >
                        {message.message}
                      </li>
                    )
                  )
                : "loading Previous messages ..."}
            </ul>
            <form onSubmit={HandleSendMessages}>
              <input
                value={newMessage}
                className="rounded-xl text-black p-2"
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  ) : (
    <div className="bg-gray-500 text-2xl items-center">
      {
        <h1>
          Please Login Again{" "}
          <button onClick={HandlebackToLogin} className="bg-green-400 rounded-lg">
            Login Page
          </button>
        </h1>
      }
    </div>
  );
};

export default ChatRoom;
