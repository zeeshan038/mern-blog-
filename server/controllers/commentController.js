import Comment from "../Models/commentModel.js";

import { ErrorHandler } from "../utils/error.js";

export const createComment = async(req , res , next)=>{
    const {postId , userId , content} = req.body;

    try {
        if(userId !== req.user.id){
            return next(ErrorHandler(403 , "You are not allowed to create this comment"));

        }
        const newComment = new Comment({
            content , 
            postId , 
            userId
        });
       await newComment.save();
       res.status(200).json(newComment);
    } catch (error) {
        next(error);
    }
}

export const getPostcomments = async(req , res , next)=>{
     try {
        const commments = await Comment.find({postId : req.params.postId}).sort({
            createdAt : -1 
        });
        res.status(200).json(commments);
     } catch (error) {
        
     }
}


export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(new ErrorHandler(404, "Comment not Found"));
        }

        const userIndex = comment.likes.indexOf(req.user.id);
        if (userIndex === -1) {
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);
        } else {
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1);
        }

        await comment.save();

        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
};


export const editComment = async(req , res , next)=>{
    try {
         const comment = await Comment.findById(req.params.commentId);
         if(!comment){
            return next(ErrorHandler(403 , "Comment not found"));
         }
         if(comment.userId !== req.user.id  && !req.user.isAdmin){
            return next(ErrorHandler(403 , "You are not allowed to edit this comment"));
         }
         const editedComment = await Comment.findByIdAndUpdate(
            req.params.commentId , 
            {
                content : req.body.content
            }, 
            {new : true}
         );
          res.status(200).json(editedComment);
    } catch (error) {   
        next(error);
    }
}

export const deleteComment = async(req , res , next)=>{
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
           return next(ErrorHandler(403 , "Comment not found"));
        }
          if(req.params.userId !== req.user.id && !req.user.isAdmin){
            return next(ErrorHandler(403 , "You are not allowed to edit this comment"));
          }
          await Comment.findByIdAndDelete(req.params.commentId);

         res.status(200).json({
            message : "Comment deleted " , 
   
        });
    } catch (error) {
        
    }
}


export const getComments = async(req , res , next)=>{
    if(!req.user.isAdmin){
        return next(ErrorHandler(404 , "you are not allowed to get Comments"))

    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0 ;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort == 'desc' ? -1 : 1;
        const comments = await Comment.find().sort({createdAt : sortDirection}).skip(startIndex).limit(limit);
        const totalComments = await Comment.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear() , 
            now.getMonth() - 1 , 
            now.getDate()
        )
        const oneMonthComments  =  await Comment.countDocuments({createdAt : {$gte : oneMonthAgo}});
        res.status(200).json({
            comments , totalComments , oneMonthComments 
        })
    } catch (error) {
        
    }
}