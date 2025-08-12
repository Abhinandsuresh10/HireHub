import express from "express";
import { recruiterController }  from '../controllers/impliments/recruiterController';
import { recruiterService } from "../services/impliments/recruiterService";
import { recruiterRepository } from '../repositories/impliments/recruiterRepository'
import { verifyJWT } from "../middlewares/VerifyMiddileware";
import multer from "multer";
import { userRepository } from "../repositories/impliments/userRepository";
import { interviewRepository } from "../repositories/impliments/interviewRepository";
import { educationRepository } from "../repositories/impliments/educationRepository";
import { experienceRepository } from "../repositories/impliments/experienceRepository";
import { applicationRepository } from "../repositories/impliments/applicationRepository";

const storage = multer.memoryStorage();
const upload = multer({storage});

const recruiterRoutes = express.Router();

const recruiterRepositorys = new recruiterRepository()
const userRepositorys = new userRepository();
const interviewRepositorys = new interviewRepository();
const educationRepositorys = new educationRepository();
const experienceRepositorys = new experienceRepository();
const applicationRepositorys = new applicationRepository()
const recruiterServices = new recruiterService(recruiterRepositorys, interviewRepositorys, userRepositorys, educationRepositorys, experienceRepositorys, applicationRepositorys)
const recruiterControllers = new recruiterController(recruiterServices);

recruiterRoutes.post('/register', recruiterControllers.register);
recruiterRoutes.post('/login', recruiterControllers.login);
recruiterRoutes.post('/verifyOTP', recruiterControllers.verifyOTP);
recruiterRoutes.post('/resentOtp', recruiterControllers.resentOtp);
recruiterRoutes.post('/forgotPassword', recruiterControllers.forgotPassword);
recruiterRoutes.post('/verifyForgotOtp', recruiterControllers.verifyForgotOtp);
recruiterRoutes.post('/setNewPassword', recruiterControllers.setNewPassword);
recruiterRoutes.post('/googleLogin',recruiterControllers.googleLogin);
recruiterRoutes.post('/editRecruiter', verifyJWT , upload.single('image'), recruiterControllers.editRecruiter);

recruiterRoutes.get('/getUserDetails', verifyJWT, recruiterControllers.getUserDetails);
recruiterRoutes.post('/downloadPdf', verifyJWT, recruiterControllers.downloadPdf);
recruiterRoutes.get('/dashboard', verifyJWT, recruiterControllers.getDashboardMatrics);
recruiterRoutes.get('/dashboardInterviews', verifyJWT, recruiterControllers.getDashboardCompletedInterviews);
recruiterRoutes.get('/dashboardGraphData', verifyJWT, recruiterControllers.getDashboardGraphData);
recruiterRoutes.get('/getCompletedInterviews', verifyJWT, recruiterControllers.getCompletedInterviews);

recruiterRoutes.post('/premiumPurchase', verifyJWT, recruiterControllers.createPremiumPurchase);
recruiterRoutes.post('/completePurchase', verifyJWT, recruiterControllers.completePremiumPurchase);

recruiterRoutes.post('/offerLetter', verifyJWT, upload.single('offerLetter'), recruiterControllers.addOfferLetter);

recruiterRoutes.post('/viewedUserProfiles', verifyJWT, recruiterControllers.viewedUserProfiles); // viewedUserProfiles count check for premium...
recruiterRoutes.get('/getUsers', verifyJWT, recruiterControllers.getUsers); // to get all users to the recuiter...
recruiterRoutes.get('/getAnyUserDetails/:id', verifyJWT, recruiterControllers.getAnyUserDetails); // to get a user full details...

recruiterRoutes.get('/checkDayVisitedComplete/:id', verifyJWT, recruiterControllers.checkDayVisitedComplete) // to check daily recruiters user-view count is exeeded or not...
recruiterRoutes.get('/checkDayAddJobComplete/:id', verifyJWT, recruiterControllers.checkDayAddJobComplete) // to check daily recruiter add job count is exeeded or not...

export default recruiterRoutes;