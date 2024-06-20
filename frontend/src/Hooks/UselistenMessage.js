import React, { useEffect } from 'react'
import { useSocketContext } from '../Context/SocketContext'

function UselistenMessage() {
  const{socket} = useSocketContext()
  useEffect(()=>{
    socket?.on("newMessage", (newMessage)=>{
        console.log(newMessage)
    })
  }, [socket])
}

export default UselistenMessage