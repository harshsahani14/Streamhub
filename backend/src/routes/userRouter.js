import express from "express"
import { protectRoute } from "../middlewares/authMiddleware.js";
import { getRecommendedUsers,getMyFriends,sendFriendRequest,acceptFriendRequest,getFriendRequest,getOutgoingFriendRequest } from "../controllers/userController.js";

const router = express.Router()

router.use(protectRoute)

router.get("/",getRecommendedUsers)
router.get("/friends",getMyFriends)

router.post("/friend-request/:id",sendFriendRequest)
router.put("/friend-request/:id/accept",acceptFriendRequest)

router.get("/friend-request",getFriendRequest)
router.get("/outgoing-friend-request",getOutgoingFriendRequest)

export default router;