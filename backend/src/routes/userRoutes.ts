import express from "express";
import { userController }  from '../controllers/impliments/userController';
import { userService } from "../services/impliments/userService";
import { userRepository } from '../repositories/impliments/userRepository'
import multer from 'multer'
import { verifyJWT } from "../middlewares/VerifyMiddileware";

const storage = multer.memoryStorage();
const upload = multer({storage});

const userRoutes = express.Router();

const userRepositorys = new userRepository()
const userServices = new userService(userRepositorys)
const userControllers = new userController(userServices);

userRoutes.post('/register', userControllers.register);
userRoutes.post('/login', userControllers.login);
userRoutes.post('/verifyOTP', userControllers.verifyOTP);
userRoutes.post('/resentOtp', userControllers.resentOtp);
userRoutes.post('/forgotPassword', userControllers.forgotPassword);
userRoutes.post('/verifyForgotOtp', userControllers.verifyForgotOtp);
userRoutes.post('/setNewPassword', userControllers.setNewPassword);
userRoutes.post('/googleLogin',userControllers.googleLogin);
userRoutes.post('/addResume', verifyJWT, upload.single('resume'), userControllers.addResume);
userRoutes.post('/editUser', verifyJWT, upload.single('image'), userControllers.editUser);
userRoutes.post('/addSkills', verifyJWT, userControllers.addSkills);




export default userRoutes;