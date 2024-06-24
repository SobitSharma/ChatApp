import { Router } from "express";
import { sendOTP, updateFullname, updateProfilePic, verifyOTPAndChangePassword } from "../controllers/updates.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import { upload } from "../middleware/multer.middleware.js";


const updaterouter = new Router()

updaterouter.route("/verifyemail/:email").post(sendOTP)
updaterouter.route("/:OTP/:email/:password").post(verifyOTPAndChangePassword)
updaterouter.route("/updatename/:fullname").post(protectRoute,updateFullname)
updaterouter.route("/updateprofilepic").post(protectRoute,upload.single('profilepic'),updateProfilePic)

export {updaterouter}

