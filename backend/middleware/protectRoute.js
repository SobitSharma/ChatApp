import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

const protectRoute = async(req, res, next)=> {
    try {
        const token = req.cookies?.jwt
        if(!token){
            return res.status(401).json({error:"UnAuthorized - No Token Provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({error:"UnAuthorized - Invalid Token"})
        }  
        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({error:"There is no User"})
        }
        req.user = user
        next();
    } catch (error) {
        console.log("Error in protectRoute")
        res.status(500).json({error:"Internal Server Error"})
    }
};

export default protectRoute;