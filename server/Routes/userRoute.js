import express from "express";
import { Update, deleteUser, getUser, googleAuth, login, register, signOut, test } from "../controllers/userController.js";
import { verifyToken } from "../utils/isAuthenticated.js";
import { getUsers } from "../controllers/postController.js";

const router = express.Router();


router.get("/test" , test);
router.post("/register" , register);
router.post("/login" , login);
router.post('/google' , googleAuth);
router.post("/update/:id" ,verifyToken, Update);
router.post('/signout' , signOut);
router.delete("/delete/:id" ,verifyToken, deleteUser);
router.get('/getuser' , verifyToken , getUsers);
router.get('/:userId' , getUser);






export default router;