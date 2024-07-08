import { Server } from "socket.io";
import http from "http";
import express from "express"


const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin:['http://localhost:5173'],
        methods:['GET','POST']
    }
})

export const getReceiverId = (receiverId)=>{
    return userSocketMap[receiverId];
}

const userSocketMap = {};  //{userId:socketId}
io.on('connection', (socket)=> {
    const userId = socket.handshake.query.userId;
    if(userId != "undefined") userSocketMap[userId]=socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on('addGroups', (groups)=> {
        console.log("Server",groups)
    })

    socket.on('disconnect', ()=>{
        console.log("a user is disconnected", socket.id)
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

export {
    app, io, server, userSocketMap
}