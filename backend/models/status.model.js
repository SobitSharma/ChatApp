import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
    statusId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    statusData:{type:Array, default:[]},
    
}, {timestamps:true})


const Status = mongoose.model('Status', statusSchema)

export default Status