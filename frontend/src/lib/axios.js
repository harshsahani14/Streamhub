import axios from "axios"

export const axiosInsance = axios.create({
    baseURL:"http://localhost:5001/api",
    withCredentials:true //allows frontend to send request to backend wiht cookies
})