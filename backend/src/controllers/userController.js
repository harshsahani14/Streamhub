import User from "../models/User.js";

export async function getRecommendedUsers(req,res) {
    
    try{

        const userId = req.user._id;
        const user = req.user

        // Understand this later
        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, //exclude current user
                { _id: { $nin: currentUser.friends } }, // exclude current user's friends
                { isOnboarded: true },
            ],
        });

        return res.status(200).json({
            message:"Recommended user fetched"
        })
    }
    catch(e){

        console.log(e)

        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

export async function getMyFriends(req,res) {
    
    try{
        const user = await User.findById(req.user._id).select("friends").
        populate("friends","fullName profilePic nativeLanguage learningLanguage")

        return res.status(200).json(
            user.friends
        )
    }
    catch(e){
        console.log(e)

        return res.status(500).json({
            message:"Internal server error"
        })
    }
}