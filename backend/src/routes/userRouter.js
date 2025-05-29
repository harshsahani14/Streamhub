import express from "express"
import { protectRoute } from "../middlewares/authMiddleware.js";
import { getRecommendedUsers,getMyFriends,sendFriendRequest } from "../controllers/userController.js";

const router = express.Router()

router.use(protectRoute)

router.get("/",getRecommendedUsers)
router.get("/friends",getMyFriends)

router.post("/friend-request/:id",sendFriendRequest)

export default router;