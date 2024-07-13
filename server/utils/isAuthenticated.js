import { ErrorHandler } from "./error.js";
import jwt from "jsonwebtoken";


export const verifyToken = async(req , res , next)=>{
    const {token} = req.cookies;

    if(!token){
        return next(ErrorHandler(401 , "Login first"));
    }
    jwt.verify(token ,process.env.JWT_SECRET , (err , user)=>{
     if(err){
        return next(ErrorHandler(401 , "UnAuthorized"));
     }
     req.user = user;
     next();
    })
}