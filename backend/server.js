import express from "express";
import { authrouter } from "./routes/auth.routes.js";
import dotenv from "dotenv"
import connectToMongoDB from "./db/connectToMongodb.js";
import cookieParser from "cookie-parser";
import router from "./routes/message.routes.js";
import userrouter from "./routes/user.routes.js";
import cors from "cors"
import { app, server } from "./soket/socket.js";
import { updaterouter } from "./routes/updateDetails.js";
import grouprouter from "./routes/group.routes.js";
dotenv.config()

app.use(express.json()); 
app.use(cookieParser())
app.use(cors({origin:['http://localhost:5173'], credentials:true}))

const PORT = process.env.PORT || 3000

app.use("/api/auth", authrouter)                    
app.use("/api/messages", router)
app.use("/api/users",userrouter)
app.use("/api/updates",updaterouter)
app.use("/api/groups", grouprouter)

connectToMongoDB().then((response)=> {
    if(!response){
        console.log("Error")
    }
    console.log("The mongodb url is", response.connection.host)
    server.listen(PORT, ()=> {
        console.log("The server is running")
    })
})

