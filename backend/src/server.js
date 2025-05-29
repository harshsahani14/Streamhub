import express from 'express'
import dotenv from "dotenv"
import authRouter from "./routes/authRouter.js"
import userRouter from "./routes/userRouter.js"
import chatRouter from "./routes/chatRouter.js"
import { connectDb } from './lib/db.js';
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config()

const PORT = process.env.PORT;

const app = express();

app.use(cookieParser())

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true // allow frontend to send cookies with request
}))

app.use( "/api/auth",authRouter )
app.use( "/api/user",userRouter )
app.use("/api/chat",chatRouter)


app.listen( PORT ,()=>{
    console.log('Bruh');
    connectDb();
})