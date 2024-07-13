import express from "express";
import { ConnectDb } from "./utils/feature.js";
import UserRoutes from './Routes/userRoute.js'
import Userpost from './Routes/postRoute.js'
import CommentRoutes from './Routes/commentRoute.js'
import cors from 'cors'
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
const app = express();
app.use(express.json());

dotenv.config();
ConnectDb();
app.use(cors());
app.use(cookieParser());


app.use('/api/v1/user' ,UserRoutes );
app.use('/api/v1/post' ,Userpost );
app.use('/api/v1/comment' , CommentRoutes );

app.listen(3000 , ()=>{
    console.log("Server is working");
})

app.use((err , req , res , next)=>{

    const statusCode = err.statusCode || 500 ; 
    const message = err.message || "Internal server Error";

    return res.status(statusCode).json({
        success : false,
        message , 
        statusCode,
    })
})