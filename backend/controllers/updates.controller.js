import { Mail } from "../Email/email.js";
import { uploadOnCloudinary } from "../middleware/cloudinary.middleware.js";
import User from "../models/user.model.js";
import { generateOTP } from "./auth.controller.js"
import bcrypt from "bcryptjs"
import fs from "fs"

let verificationOTP;
const sendOTP = async(req, res) => {
    console.log("H")
    const {email: userEmail} = req.params
    
    const user = await User.findOne({email:userEmail});
    if(!user){
        return res.status(401).json({error:"This Email Address is not Registered with US"})
    }

    const OTP = generateOTP();
    verificationOTP = OTP;
    const sendMail = await Mail({
        To:userEmail,
        subject:"Verification Of User",
        text:`This is for verification of the user for changing the Password ${OTP}`
    })

    if(sendMail === "error"){
        return res.status(401).json({error:"We are not able to send the OTP to the given Email Address. Try again afetr some Time"})
    }
    res.status(200).json({mail:userEmail, message:"OTP has been sent"})
}

const verifyOTPAndChangePassword = async(req, res) => {
    const {OTP: userOTP, email:userEmail, password} = req. params
    console.log(userOTP, userEmail, password)
    if(!(userOTP == verificationOTP)){
        verificationOTP=""
        return res.status(401).json({error:"Invalid OTP"})
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.findOneAndUpdate({email:userEmail}, {password:hashedPassword});
    console.log(user)
    if(!user){
        return res.status(401).json({error:"User not found"})
    }

    return res.status(200).json({message:"Password Successfully Updated"})
}

const updateFullname = async(req, res) => {
    console.log("h")
    const {fullname} = req.params
    const user = await User.findByIdAndUpdate(req.user?._id, {fullname:fullname}, {new:true}).select("-password")
    if(!user){
        return res.status(401).json({error:"Some Internal Error Please Try agin after Some Time"})
    }
    console.log(user)
    return res.status(200).json({
        user
    })
}

const updateProfilePic = async(req,res) => {
    try {
        const filePath = req.file?.path 
        if(!filePath){
            return res.status(401).json({error:"Image not found"})
        }
        const uploadpr = await uploadOnCloudinary(filePath)
        if(uploadpr == "error"){
            return res.status(401).json({error:"Internal Server Error"})
        }
        const user = await User.findByIdAndUpdate(req.user?._id, {profilePic:uploadpr.url})
        if(!user){
            return res.status(401).json({error:"Internal Server Error"})
        }
        fs.unlink(filePath, function(err){
            if(err){
                console.log("File not Deleted Error")
            }
        })

        return res.status(200).json({url:uploadpr.url})
    } catch (error) {
        return res.status(401).json({error:"Internal Server Error"})
    }
}
export {
    sendOTP,
    verifyOTPAndChangePassword,
    updateFullname,
    updateProfilePic
}