import { uploadOnCloudinary } from "../middleware/cloudinary.middleware.js"
import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"
import { getReceiverId } from "../soket/socket.js"
import { io } from "../soket/socket.js"
import fs from "fs"

const imagesSentToUser = async(req, res) => {
    try {
        const imagesPath = req.file?.path 
        const senderId = req.user?._id
        const {id:receiverId} = req.params
    
        if(!imagesPath){
            return res.status(501).json({error:"File Not Found"})
        }
    
        const uploadTheImage = await uploadOnCloudinary(imagesPath);
        if(uploadOnCloudinary === "error"){
            return res.status(500).json({error:"Internal Server Error"})
        }
    
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
            message:uploadTheImage.secure_url,
            type:"image" 
        })
    
        if(newMessage){
            conversation.messages.push(newMessage._id)
        }
     
        await Promise.all([conversation.save(), newMessage.save()]);
        const receiverSocketId = getReceiverId(receiverId)
        if(receiverSocketId){
           io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        fs.unlink(imagesPath, function(err){
            if(err){
                console.log("File not Deleted Error")
            }
        })

        res.status(201).json(newMessage);
        
    } catch (error) {
        console.log(error)
        return res.status(501).json({error:"Server Internal Error"})
    }
}

export {
    imagesSentToUser
}