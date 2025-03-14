import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { sendMessage, getMessages, getConversations } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", protectRoute, sendMessage);
router.get("/conversation", protectRoute, getConversations);
router.get("/:userId", protectRoute, getMessages);

export default router;