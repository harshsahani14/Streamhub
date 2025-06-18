import axios from "axios"

const BASE_URL = import.meta.env.MODE === 'development' ? "http://localhost:5001/api" : '/api'

export const axiosInsance = axios.create({
    baseURL:BASE_URL,
    withCredentials:true //allows frontend to send request to backend wiht cookies
})