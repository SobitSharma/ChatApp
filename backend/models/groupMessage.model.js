import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true
    },
    type:{
        type:String,
        require:true
    },
    sendername:{
        type:String,
        require:true
    }
}, {timestamps:true});

const GroupMessage = mongoose.model("GroupMessage", messageSchema);
export default GroupMessage;

