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

        // Check if the user and the receipient are friends already
        if(recipient.friends.includes(userId)){
            return res.status(400).json({
                message:"You are already friends with this user"
            })
        }

        // check if a friend request already exists
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

export async function acceptFriendRequest(req,res) {

    try{
        const { id:requestId } = req.params

        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest){
            return res.status(404).json({ message:"Friend Request does not exists"})
        }

        // Verify current user is the receipient
        if(friendRequest.recipient.toString()!== req.user._id){
            return res.status(403).json({message:"You are not authorized to accept this request "})
        }

        friendRequest.status = "accepted"

        await friendRequest.save();

        // add each user to the other's friends array
        // $addToSet: adds elements to an array only if they do not already exist.
        await User.findByIdAndUpdate( friendRequest.sender,{
            $addToSet:{friends:friendRequest.recipient}
        } )

        await User.findByIdAndUpdate( friendRequest.recipient,{
            $addToSet:{friends:friendRequest.sender}
        } )

        res.status(200).json({ 
            message: "Friend request accepted" 
        });
    }
    catch(e){
        console.log("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({ 
            message: "Internal Server Error" 
        });
    }
}

export async function getFriendRequest(req,res) {
    
    try {
        
        const incomingRequests = await FriendRequest.find({
            recipient:req.user._id,
            status:"pending"
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage")

        const acceptedRequests = await FriendRequest.find({
            sender:req.user._id,
            status:"accepted"
        }).populate("sender","fullName profilePic")

        return res.status(200).json({
            incomingRequests,
            acceptedRequests
        })

    } catch (error) {
        console.log("Error in getFriendRequest controller", error.message);
        res.status(500).json({ 
            message: "Internal Server Error" 
        });
    }
}

export async function getOutgoingFriendRequest(req,res) {
    
    try {
        
        const outgoingRequests = await FriendRequest.find({
            sender:req.user._id,
            status:"pending"
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage")

        return res.status(200).json({
            outgoingRequests
        })
    } catch (error) {
        console.log("Error in getOutgoingFriendRequest controller", error.message);
        res.status(500).json({ 
            message: "Internal Server Error" 
        });
    }
}