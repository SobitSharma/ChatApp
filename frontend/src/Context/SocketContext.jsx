import { createContext, useContext, useEffect, useState } from "react";
import { useUserContext } from "./UserContext";
import io from "socket.io-client";
import notificationsound from "../assets/sounds/notification.mp3";

export const SocketContext = createContext();

export const useSocketContext = ()=> {
    return useContext(SocketContext)
}

export const SocketContextProvider = ({ children }) => {
  const [socket, setsocket] = useState(null);
  const [onlineusers, setonlineusers] = useState([]);
  const { userLogin, UserInfo } = useUserContext();
  const [newIncomingMessage, setnewIncomingMessage] = useState({})

  useEffect(() => {
    if (userLogin) {
      const socket = io("http://localhost:8000", {
        query:{
            userId:UserInfo._id
        }
      });
      setsocket(socket);
      socket.on("getOnlineUsers", (users)=> {
        setonlineusers(users)
      })
      socket.on("groupmessage", (message)=> {
        const sound = new Audio(notificationsound);
        sound.play();
        message.shouldshake = true
        setnewIncomingMessage(message)
      })

      socket.on("reload", (message)=> {
        console.log(message)
      })

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setsocket(null);
      }
    }
  }, [userLogin]);

  return (
    <SocketContext.Provider value={{ socket, onlineusers , newIncomingMessage, setnewIncomingMessage}}>
      {children}
    </SocketContext.Provider>
  );
};
