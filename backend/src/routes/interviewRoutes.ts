import express from "express";
import { interviewRepository } from "../repositories/impliments/interviewRepository";
import { interviewService } from "../services/impliments/interviewService";
import { interviewController } from '../controllers/impliments/interviewController'
import { verifyJWT } from "../middlewares/VerifyMiddileware";

const interviewRoutes = express.Router();

const repositories = new interviewRepository();
const service = new interviewService(repositories);
const interviewControllers = new interviewController(service);


interviewRoutes.route('/sheduleInterview').post(verifyJWT, interviewControllers.createInterview).get(verifyJWT, interviewControllers.getInterviews);
interviewRoutes.get('/sheduledUserInterviews', verifyJWT, interviewControllers.getUsersInterviews);
interviewRoutes.get('/sheduleInterviewById/:id', verifyJWT, interviewControllers.getInterviewById);

export default interviewRoutes;