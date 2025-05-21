import express from "express";
import { recruiterController }  from '../controllers/impliments/recruiterController';
import { recruiterService } from "../services/impliments/recruiterService";
import { recruiterRepository } from '../repositories/impliments/recruiterRepository'
import { verifyJWT } from "../middlewares/VerifyMiddileware";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({storage});

const recruiterRoutes = express.Router();

const recruiterRepositorys = new recruiterRepository()
const recruiterServices = new recruiterService(recruiterRepositorys)
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

export default recruiterRoutes;