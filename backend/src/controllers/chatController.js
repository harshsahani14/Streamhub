import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req,res) {
    
    try{
        const token = generateStreamToken(req.user._id);

        return res.status(200).json({
            token
        })
    }
    catch(e){
        console.log("Error in getStream controller", error.message);
        res.status(500).json({ 
            message: "Internal Server Error" 
        });
    }
}