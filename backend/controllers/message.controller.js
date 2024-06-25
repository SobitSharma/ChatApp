import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverId } from "../soket/socket.js";
import { io } from "../soket/socket.js";

const sendMessage = async(req, res)=> {
    try {
        const {message} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;
        console.log(message)

        let conversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]},
        })

        if(!conversation){  
            conversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        }    

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            type:"text"
        })

        if(newMessage){
            conversation.messages.push(newMessage._id)
        }

        await Promise.all([conversation.save(), newMessage.save()]);
        const receiverSocketId = getReceiverId(receiverId)
        if(receiverSocketId){ 
           io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message)
        return res.status(500).json({message:"Internal Srever Error"})
    }
}

const getMessages = async(req, res)=> {
    try {
       const  {id:userToChatId} = req.params;
       const senderId = req.user._id;
       
       const conversation = await Conversation.findOne({
        participants:{$all:[senderId, userToChatId]},
       }).populate("messages");

       if(!conversation){
        return res.status(200).json([])
       }

       const messages = conversation.messages
       res.status(200).json(messages);
    }
        catch (error) {
            console.log("Error in GETMessage controller: ", error.message)
            return res.status(500).json({message:"Internal Server Error"})
        }
    }

export {
    sendMessage,
    getMessages
}