import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { addGroupUsers, addNewGroup, getUserGroups, sendMessagesInGroup } from "../controllers/group.controller.js";

const grouprouter = new Router()

grouprouter.post("/create", protectRoute, addNewGroup)
grouprouter.post("/send", protectRoute, sendMessagesInGroup)
grouprouter.post("/adduser", protectRoute, addGroupUsers)
grouprouter.get('/getgroupuser', protectRoute, getUserGroups)


export default grouprouter