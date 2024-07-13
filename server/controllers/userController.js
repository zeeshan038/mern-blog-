import User from "../Models/userModel.js";
import { ErrorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
export const test = (req , res)=>{
     res.json({
        message : "server is working"
     })
}


export const register = async(req , res , next)=>{
    const {username , email , password}  = req.body;

    if(!username || !email || !password){
        return next(ErrorHandler(401 , "All fields are required"))
    }
    const hashedPassword = bcryptjs.hashSync(password , 10);
    const newUser = await User.create({
       username , 
       email , 
       password : hashedPassword,
    })
    try {
        await newUser.save();
         return next(ErrorHandler(201 , "User regsiterd Sucesssfully"));
    } catch (error) {
         console.error(error)
    }
}

export const login = async(req , res , next)=>{
    const {email , password} = req.body;
    if(!email || !password){
       return next(ErrorHandler(401 , "All fields are required"));
    }
    try {
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(ErrorHandler(401 , "Incorrect password or Email"));
        }
        const validPassword = bcryptjs.compareSync(password , validUser.password)
        if(!validPassword){
            return next(ErrorHandler(401 , "Incorrect password or Email"));
        }
        const token = jwt.sign({id : validUser._id , isAdmin : validUser.isAdmin},process.env.JWT_SECRET);
        const {password:hashedPassword , ...rest  } = validUser._doc;
        return res.status(200).cookie("token" , token,{
          httpOnly : true 
        }).json(rest);
        
    } catch (error) {
        console.error(error)
    }
}
export const googleAuth = async(req  , res , next)=>{
 
    const {name , email , googlePhotoUrl } = req.body;

    try {
        const user = await User.findOne({email});
        if(user){
            const token = jwt.sign({id : user._id , isAdmin : user.isAdmin} ,process.env.JWT_SECRET);
           const {password , ...rest} = user._doc;
            res.status(200).cookie("token" , token , {
                httpOnly : true
            }).json(rest);
        }
        else{
            const genratedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(genratedPassword , 10);
            const newUser = await User.create({
                username : name.toLowerCase()+Math.random().toString(9).slice(-4),
                email , 
                password : hashedPassword , 
              ProfileImage : googlePhotoUrl,
            }) 
            await newUser.save();
            const token = jwt.sign({id : newUser._id , isAdmin : newUser.isAdmin} , process.env.JWT_SECRET);
            const { password: hashedPassword2, ...rest } = newUser._doc;
            res.status(200).cookie("token" , token,{
                httpOnly : true ,
            }).json(rest);
        }
    } catch (error) {
        next(error);
    }
    
}

export const Update = async(req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(ErrorHandler(401, "You are not the User"));
    }
    if (req.body.password) {
        if (req.body.password.length < 6 || req.body.password.length > 20) {
            return next(ErrorHandler(401, "The password must be between 6 and 20 characters"));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

  

    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                ProfileImage: req.body.ProfileImage,
            },
        },
        { new: true }
    );
    if (!updatedUser) {
        return next(ErrorHandler(404, "User not found"));
    }
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
}

export const deleteUser = async(req , res , next) => {
    if(!req.user.isAdmin && req.user.id !== req.params.id) {
        return next(ErrorHandler(401, "You are not able to delete"));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "user deleted successfully"
        });
    } catch (error) {
        next(error);
    } 
}


export const signOut = async(req , res , next )=>{
    try {
        res.clearCookie('token').status(200).json("user has been signed out");
    } catch (error) {
        next(error);
    }
}



export const getUser = async(req , res , next)=>{
    try {
        const user = await User.findById(req.params.userId);
        if(!user){
            return next(ErrorHandler(401 , "User not Found"));
        }
        const {password , ...rest} = user._doc;
        res.status(200).json(user);
    } catch (error) {
        next(error)
    }


}