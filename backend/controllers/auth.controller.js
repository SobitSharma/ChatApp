import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { Mail } from "../Email/email.js";



let authenticateOTP = ""
export const generateOTP = () => {
    let value = ""
    for(let i=0; i<4; i++){
        value+=Math.floor(Math.random()*9)
    }
    authenticateOTP = value;
    return value;
}

const login = async(req, res)=> {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid Username or password"})
        }
        generateTokenAndSetCookie(user._id, res);
        return res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            username:user.username,
            profilePic:user.profilePic,
            createdAt:user.createdAt
        });
;
    } catch (error) {
        console.log("Error in login Controller", error.message)
        return res.status(500).json({error:"Internal Server Error"});
    }
}

const logout = async(req, res)=> {
    try {
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({message:"User LoggedOut Successfully"})
    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}

const signUpDetailsVerification  = async(req, res)=>{
    const {fullname, username, password, confirmPassword, email}= req.body;
    if(password!==confirmPassword){
        return res.status(400).json({
            error:"Passwords donnot match"
        })
    }

    const characters = /[A-Z]/g;
    const Numbers = /[1-9]/g;
    const specialchar = /[!@#$%^&*(){};:'<>,.]/g;

    if(password.length < 8){
        return res.status(400).json({
            error:"Password length should be greater than 8"
        })
    }

    if(!(password.match(characters)) || !(password.match(Numbers)) || !(password.match(specialchar))){
        console.log(password)
        console.log(password.match(characters),password.match(Numbers),password.match(specialchar))
        return res.status(400).json({
            error:
            "Password is not Valid Rules for password are: Atleast one CapitalCharacter, Number, SpecialCharacter(allowed special chars [!@#$%^&*(){}[];:'<>,.+])"
        })
    }

    const user = await User.findOne({username});
    if(user){
        return res.status(400).json({error:"Username already exists"})
    }

    const seeemail = await User.findOne({email});
    if(seeemail){
        return res.status(400).json({error:"This Email Id already Exists. Please Provide a different One"})
    }
    const mailVerification = await Mail({
        To:email,
        subject:"Welcoming Message",
        text:`This mail is To verify Your Identity Please Enter This OTP to verify Yourself ${generateOTP()}`
    })
    
    if(mailVerification == "error"){
        return res.status(400).json({error:"There is Some Problem with the Provided Email Address. We are not Able to Verify it"})
    }
    return res.status(200).json({message:"All Details are Verified Except The Email"})
}

const signup = async(req, res)=> {
    try {
        const {fullname, username, password, gender, email, OTP}= req.body

        if(!(OTP === authenticateOTP)){
            return res.status(401).json({error:"OTP Authentication Failed"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyprofilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
    
        const newUser = await User({
            fullname, 
            username,
            password:hashedPassword,
            gender,
            email,
            profilePic: gender=="male"?boyprofilePic : girlProfilePic
        })
        if(newUser){
            await newUser.save();
            generateTokenAndSetCookie(newUser._id, res);
            res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                username:newUser.username,
                profilePic:newUser.profilePic,
                email:newUser.email
            });
        }
        else{
            res.status(400).json({error:"Invalid User Data"})
        }
    } catch (error) {
        console.log("Error in signup controller", error.message)
        return res.status(500).json({
            error:"Intername Server Error"
        })
    }
}

export {
    login,
    logout,
    signup,
    signUpDetailsVerification
}