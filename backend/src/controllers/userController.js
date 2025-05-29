import FriendRequest from "../models/FriendRequest.js";
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

export async function sendFriendRequest(req,res) {
    
    try{
        const userId = req.user._id;

        const { id:receipientId } = req.params;

        if(userId===receipientId){
            return res.status(400).json({
                message:"You can't send request to yourself"
            })
        }

        const recipient = await User.findById(receipientId);

        if(!recipient){
            return res.status(404).json({
                message:"Receipient Not Found"
            })
        }

        if(recipient.friends.includes(userId)){
            return res.status(400).json({
                message:"You are already friends with this user"
            })
        }

        // check if a req already exists
        // Understand this
        const existingRequest = await FriendRequest.findOne({
            $or: [
            { sender: myId, recipient: recipientId },
            { sender: recipientId, recipient: myId },
            ],
        });

        if(existingRequest){
            return res.status(400).json({
                message:"A request already exists between you and the user"
            })
        }

        const friendRequest = await FriendRequest.create({
            sender:userId,
            recipient:receipientId
        })

        return res.status(200).json({
            message:"Friend Request Sent sucessfully"
        })
    }
    catch(e){
        console.log(e)

        return res.status(500).json({
            message:"Internal server error"
        })
    }
}