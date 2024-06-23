import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    gender:{
        type:String,
        required:true,
        enum:["male", "Female"]
    },
    profilePic:{
        type:String,
        default:""
    },
    email:{
        type:String,
        required:true
    }
}, {timestamps:true});

const User = mongoose.model("User", userSchema);
export default User;
