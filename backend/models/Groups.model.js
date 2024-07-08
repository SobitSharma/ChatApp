import mongoose from "mongoose";

const userGroups = new mongoose.Schema({
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    groupname:{
        type:String,
        require:true
    },
    grouppic:{
        type:String,
        default:""
    },
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],
    groupmessages:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"GroupMessage",
            default:[],
        }
    ]
}, {timestamps:true})

const Group = mongoose.model("Group", userGroups);

export default Group