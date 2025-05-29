import jwt from "jsonwebtoken"
import User from "../models/User.js"
import "dotenv/config"

export const protectRoute = async(req,res,next)=>{

    try{

        const token = req.cookies.jwt;

        if(!token){
            return res.status(400).json({
                message:"Token not found"
            })
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)

        if(!decoded){
            return res.status(401).json({
                message:"Token in invalid"
            })
        }

        const user = await User.findById( decoded.userId  ).select("-password");

        if(!user){
            return res.status(400).json({
                message:"User not found"
            })
        }

        req.user = user;

        next()
    }
    catch(e){
        console.log(e)

        return res.status(500).json({
            message:"Error in protected route middleware"
        })
    }
}