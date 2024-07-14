import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { upload } from "../middleware/multer.middleware.js";
import { deleteStatus, getAllUsersStatus, getUserStatus, uploadUserStatus } from "../controllers/status.controller.js";

const statusRouter = new Router()

statusRouter.post("/setstatus",protectRoute, upload.array("photos", 5),uploadUserStatus)
statusRouter.get("/getstatus", protectRoute, getUserStatus)
statusRouter.post("/delete", protectRoute, deleteStatus)
statusRouter.get("/getallstatus", protectRoute, getAllUsersStatus)

export {statusRouter}
