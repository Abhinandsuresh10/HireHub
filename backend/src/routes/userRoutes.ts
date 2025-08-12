import express from "express";
import { userController }  from '../controllers/impliments/userController';
import { userService } from "../services/impliments/userService";
import { userRepository } from '../repositories/impliments/userRepository'
import multer from 'multer'
import { verifyJWT } from "../middlewares/VerifyMiddileware";
import { recruiterRepository } from "../repositories/impliments/recruiterRepository";

const storage = multer.memoryStorage();
const upload = multer({storage});

const userRoutes = express.Router();

const userRepositorys = new userRepository();
const recruiterRepositorys = new recruiterRepository();
const userServices = new userService(userRepositorys, recruiterRepositorys);
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
userRoutes.post('/addCoverLetter', verifyJWT, upload.single('coverLetter'), userControllers.addCoverLetter);
userRoutes.post('/editUser', verifyJWT, upload.single('image'), userControllers.editUser);
userRoutes.post('/addSkills', verifyJWT, userControllers.addSkills);
userRoutes.post('/addPreferredRoles/:id', verifyJWT, userControllers.addPreferredRoles);
userRoutes.post('/addPreferredTypes/:id', verifyJWT, userControllers.addPreferredTypes);
userRoutes.get('/getCompanies', verifyJWT, userControllers.getCompanies);
userRoutes.route('/premiumPurchase').post( verifyJWT, userControllers.createPurchase);
userRoutes.post('/completePurchase', verifyJWT, userControllers.completePurchase);

userRoutes.get('/viewedJobs', verifyJWT, userControllers.viewedJobs);
userRoutes.get('/viewedRecruiter', verifyJWT, userControllers.viewedRecruiter);

userRoutes.post('/verifyOfferLetterPassword', verifyJWT, userControllers.verifyOfferLetterPassword);

userRoutes.get('/getAllRecruiters', verifyJWT, userControllers.getAllRecruiters);
userRoutes.get('/getSingleRecruiter', verifyJWT, userControllers.getSingleRecruiter);




export default userRoutes;