import express from 'express'
import dotenv from "dotenv"
import authRouter from "./routes/authRouter.js"
import userRouter from "./routes/userRouter.js"
import { connectDb } from './lib/db.js';
import cookieParser from "cookie-parser"

dotenv.config()

const PORT = process.env.PORT;

const app = express();

app.use(cookieParser())

app.use(express.json());

app.use( "/api/auth",authRouter )
app.use( "/api/user",userRouter )


app.listen( PORT ,()=>{
    console.log('Bruh');
    connectDb();
})