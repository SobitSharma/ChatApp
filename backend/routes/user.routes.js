import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import { getUserForSidebar } from "../controllers/user.controller.js"

const userrouter = express.Router()


userrouter.get("/", protectRoute, getUserForSidebar)

export default userrouter