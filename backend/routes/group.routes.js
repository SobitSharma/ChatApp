import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { addGroupUsers, addNewGroup, getUserGroups, sendImagesInGroups, sendMessagesInGroup } from "../controllers/group.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const grouprouter = new Router()

grouprouter.post("/create", protectRoute, addNewGroup)
grouprouter.post("/send", protectRoute, sendMessagesInGroup)
grouprouter.post("/adduser", protectRoute, addGroupUsers)
grouprouter.get('/getgroupuser', protectRoute, getUserGroups)
grouprouter.post('/sendimages/:groupId', protectRoute,upload.single('imageFile') ,sendImagesInGroups)

export default grouprouter