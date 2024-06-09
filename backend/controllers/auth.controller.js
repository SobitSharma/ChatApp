import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateToken.js";

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

const signup = async(req, res)=> {
    try {
        const {fullname, username, password, confirmPassword, gender}= req.body;
        if(password!==confirmPassword){
            return res.status(400).json({
                error:"Passwords donnot match"
            })
        }
        const user = await User.findOne({username});
        if(user){
            return res.status(400).json({error:"Username already exists"})
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
            profilePic: gender=="male"?boyprofilePic : girlProfilePic
        })
        if(newUser){
            await newUser.save();
            generateTokenAndSetCookie(newUser._id, res);
            res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                username:newUser.username,
                profilePic:newUser.profilePic
        
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
    signup
}