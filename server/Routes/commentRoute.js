import express from 'express';
import {verifyToken} from '../utils/isAuthenticated.js'
import { createComment, deleteComment, editComment, getComments, getPostcomments, likeComment } from '../controllers/commentController.js';
const router = express.Router();


router.post('/createComment' , verifyToken , createComment);
router.get('/getcomments/:postId' , getPostcomments );
router.put('/like/:commentId' , verifyToken , likeComment);
router.put('/edit/:commentId' , verifyToken , editComment);
router.delete('/delete/:commentId' , verifyToken , deleteComment);
router.get('/getComments' , verifyToken , getComments)





export default router;