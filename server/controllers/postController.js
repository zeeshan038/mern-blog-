
import Post from "../Models/postModel.js";
import { ErrorHandler } from "../utils/error.js"
import User from '../Models/userModel.js';
export const createpost = async(req , res , next)=>{

    if(!req.user.isAdmin){
        return next(ErrorHandler(403 , "You are not allowed to create Post"));
    }
    if(!req.body.title || !req.body.content){
        return next(ErrorHandler(400 , "Please provide all the required fields"));
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-z0-9-]/g,'-');
    const newPost = new Post({
        ...req.body  , slug , userId : req.user.id
    })


    try {
        const savePost = await newPost.save();
        res.status(200).json(savePost);
    } catch (error) {
        
    }
}



export const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }), 
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchItems && {
                $or: [
                    { title: { $regex: req.query.searchItems, $options: 'i' } },
                    { content: { $regex: req.query.searchItems, $options: 'i' } },
                ]
            })
        }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);

        const totalPosts = await Post.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts
        });

    } catch (error) {
        next(error);
    }
};

export const deletePost = async(req , res , next)=>{
    if(!req.user.isAdmin || !req.user.id || !req.params.userId){
        return next(ErrorHandler(401 , "You are not allowed to delete this post"));
    }

    try {
         await Post.findByIdAndDelete(req.params.postId);
         res.status(200).json({
            success : true , 
            message :"Post is deleted successfully!"
         })
    } catch (error) {

        next(error)
        
    }

};

export const updatePost = async(req , res , next)=>{
    if(!req.user.isAdmin || !req.user.id || !req.user.id || !req.params.userId){
        return next(ErrorHandler(401 , "You are not allowed to Edit this post"));
    }
    try {
        
        const updatePost = await Post.findByIdAndUpdate(req.params.postId , {
            $set : {
                title : req.body.title , 
                content : req.body.content , 
                category : req.body.category , 
                image : req.body.image,
            }
        } , {new : true});
        res.status(200).json(updatePost)
    } catch (error) {
        next(error)
    }
}

export const getUsers = async(req , res , next)=>{
    if(!req.user.isAdmin){
        return next(ErrorHandler(403 , "You are not allowed to get all  users"));
    }

    try {
        const startIndex = parseInt(req.query.startIndex ) || 0;
        const limit  = parseInt(req.query.limit ) || 9 ;
        const sortDirection = req.query.order === 'asc' ? 1 : -1 ;
  const getUser  = await User.find().sort({createdAt : sortDirection}).skip(startIndex).limit(limit);
         
         const userWithoutPassword = getUser.map((user)=>{
            const {password , ...rest} = user._doc;
            return rest ;

    })

    const totalUsers = await User.countDocuments();
     const now = new Date();
    const OneMonthUser = new Date(
        now.getFullYear(),
        now.getMonth()-1,
        now.getDate()
    )
          const lastMonthUsers = await User.countDocuments({
            createdAt : {$gte : OneMonthUser},
          });

          res.status(200).json({
            getUser: userWithoutPassword,
            totalUsers , 
            lastMonthUsers
          })
      
    } catch (error) {
        next(error)
    }
}