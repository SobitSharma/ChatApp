import { createContext, useContext, useEffect, useState } from "react";
import { useUserContext } from "./UserContext";
import io from "socket.io-client";

export const SocketContext = createContext();

export const useSocketContext = ()=> {
    return useContext(SocketContext)
}

export const SocketContextProvider = ({ children }) => {
  const [socket, setsocket] = useState(null);
  const [onlineusers, setonlineusers] = useState([]);
  const { userLogin, UserInfo } = useUserContext();

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

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setsocket(null);
      }
    }
  }, [userLogin]);

  return (
    <SocketContext.Provider value={{ socket, onlineusers }}>
      {children}
    </SocketContext.Provider>
  );
};
