
import mongoose from "mongoose";

export const ConnectDb = ()=>{
    mongoose.connect(process.env.MONGO_URI,{
    dbName : "BlogAppN"
} ).then(()=>{
    console.log("Db connected")
}).catch((e)=>{
    console.log(e)
})
}

