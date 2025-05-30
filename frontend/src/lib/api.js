import { axiosInsance } from "./axios"

export const  signup = async(signUpData)=>{
    
    const res = await axiosInsance.post("/auth/signup",signUpData)
    return res.data
}

export const getAuthUser = async ()=>{
    const res = await axiosInsance.get("/auth/me")
    return res.data
}