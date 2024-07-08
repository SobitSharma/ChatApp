import mongoose from "mongoose";

const userGroupSchema = new mongoose.Schema({
    Person:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    Groups:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Group",
            
        }
    ]
    

}, {timestamps:true})

const UserGroup = mongoose.model("UserGroup", userGroupSchema)

export default UserGroup