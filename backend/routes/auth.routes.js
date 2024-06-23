import { Router } from "express";
import {login, logout, signUpDetailsVerification, signup } from "../controllers/auth.controller.js";
const authrouter = new Router()

authrouter.route("/signup").post(signup)
authrouter.route("/login").post(login)
authrouter.route("/logout").post(logout)
authrouter.route("/verify").post(signUpDetailsVerification)

export {authrouter}