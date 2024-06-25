import express from 'express'
import { getMessages, sendMessage } from '../controllers/message.controller.js';
import protectRoute from '../middleware/protectRoute.js';
import { imagesSentToUser } from '../controllers/Images.controller.js';
import { upload } from '../middleware/multer.middleware.js';

const router = express.Router();

router.get("/:id",protectRoute, getMessages)
router.post("/send/:id", protectRoute, sendMessage)
router.post("/imagefile/:id", protectRoute, upload.single('image'), imagesSentToUser)

export default router