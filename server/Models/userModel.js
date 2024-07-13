import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username: {
       type: String , 

    },
    email : {
        type: String , 
        unique : true ,
    },
    password : {
        type: String , 
       
    }, 
    ProfileImage : { 
        type: String , 
        default : 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg'
    },
    isAdmin : {
        type : Boolean , 
        default : false,
    }
},{timestamps : true})

const User = mongoose.model("user" , userSchema);


export default User;