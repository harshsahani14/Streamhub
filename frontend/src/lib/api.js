import { axiosInsance } from "./axios"

export const  signup = async(signUpData)=>{
    
    const res = await axiosInsance.post("/auth/signup",signUpData)
    return res.data
}

export const login = async(loginData)=>{
    
    const res = await axiosInsance.post("/auth/login",loginData)
    return res.data
}

export const getAuthUser = async ()=>{
    const res = await axiosInsance.get("/auth/me")
    return res.data
}

export const completeOnBoarding = async (userData)=>{
    const res = await axiosInsance.post("/auth/onBoard",userData)

    return res.data
}