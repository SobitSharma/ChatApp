import { Router } from "express";
import { sendOTP, verifyOTPAndChangePassword } from "../controllers/updates.controller.js";

const updaterouter = new Router()

updaterouter.route("/verifyemail/:email").post(sendOTP)
updaterouter.route("/:OTP/:email/:password").post(verifyOTPAndChangePassword)

export {updaterouter}

