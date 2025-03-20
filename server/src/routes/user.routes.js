import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
  getUserProfile,
  getSuggestedUsers,
} from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile)
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.put("/update", protectRoute, updateUser);

export default router;
