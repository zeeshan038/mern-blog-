import express from 'express';

import { verifyToken } from '../utils/isAuthenticated.js';
import { createpost, deletePost, getPosts, getUsers, updatePost } from '../controllers/postController.js';


const router = express.Router();


router.post('/post',verifyToken,createpost);
router.get('/getpost' , getPosts);
router.delete('/delete/:postId/:userId' , verifyToken , deletePost);
router.put('/updatepost/:postId/:userId' , verifyToken , updatePost)




export default router; 