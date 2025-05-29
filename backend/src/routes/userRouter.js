import express from "express"
import { protectRoute } from "../middlewares/authMiddleware.js";
import { getRecommendedUsers,getMyFriends } from "../controllers/userController.js";

const router = express.Router()

router.use(protectRoute)

router.get("/",getRecommendedUsers)
router.get("/friends",getMyFriends)

export default router;