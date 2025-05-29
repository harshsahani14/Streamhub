import User from "../models/User.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { upsertUser } from "../lib/stream.js"

dotenv.config()

export async function signup(req,res){
    
    try{

        console.log(req.body)
        const {fullName,email,password} = req.body;

        if(!email || !fullName || !password){
            return res.status(400).json({
                message:"All fields are required"
            })
        }

        if(password.length<6) {
            return res.status(400).json({message:"Passoword must me atleast 6 characters"})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const dbUser = await User.findOne({email});

        if(dbUser){
            return res.status(400).json({ message: "Email already exists" });
        }

        const idx = Math.floor(Math.random()*100) +1 // generates a random index from 1 to 100 inclusive

        const avatar = `https://avatar.iran.liara.run/public/${idx}.png`

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic:avatar,

        })

        await upsertUser({
            id:newUser._id,
            name:newUser.fullName,
            image:newUser.profilePic || ""
        })

        console.log(`Stream ser created for ${newUser.fullName}`)

        const token = jwt.sign( {userId:newUser._id} , process.env.JWT_SECRET_KEY, {
            expiresIn:"7d"
        })

        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true, // prevent XSS attacks
            sameSite:"strict", //prevent CSRF attacks
            secure: process.env.NODE_ENV === "production"
            
        })
        //secure: true → cookie will only be sent over HTTPS
        //secure: false → cookie can be sent over HTTP (useful in local development)

        return res.status(200).json({ success:true,user:newUser })
    }
    catch(e){

        console.log(e.message)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export async function login(req,res){
    
    try{

        const {email,password} = req.body;

        if(!email || !password) {
            return res.status(400).json({message:"All fields are required"});
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({message:"Invalid email or password"});
        }

        const isPassowordCorrect = await user.matchPassword(password)

        if(!isPassowordCorrect){
            return res.status(401).json({message:"Invalid email or password"});
        }

        const token = jwt.sign( {userId:user._id} , process.env.JWT_SECRET_KEY, {
            expiresIn:"7d"
        })

        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true, // prevent XSS attacks
            sameSite:"strict", //prevent CSRF attacks
            secure: process.env.NODE_ENV === "production"
            
        })
        

        return res.status(200).json({ success:true,user })
    }
    catch(e){
        console.log(e.message)
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export async function logout(req,res){
    res.clearCookie("jwt")
    return res.status(200).json({message:"Logout successful"})
}

export async function onboard(req,res){

    try{
        const userId = req.user._id;

        const {fullName,bio,nativeLanguage,learningLanguage,location} = req.body

        if(!fullName,!bio,!nativeLanguage,!learningLanguage,!location){
            return res.status(400).json({
                message:"All fields are required",
                missingField:[
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean)
            })
        }

        const updateUser = await User.findByIdAndUpdate( userId,{
            ...req.body,
            isOnBoarded:true
        },{new:true} )

        if(!updateUser){
            return res.status(404).json({
                message:"User not found"
            })
        }

        return res.status(200).json({
            message:"User onboarded sucessfully"
        })

    }
    catch(e){
        console.log("Error while onboarding user",e);

        return res.status(500).json({
            message:"Internal server error"
        })
    }
}