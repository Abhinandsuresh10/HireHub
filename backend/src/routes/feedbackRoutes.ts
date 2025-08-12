import { feedbackController } from "../controllers/impliments/feedbackController";
import { feedbackRepository } from "../repositories/impliments/feedbackRepository";
import { FeedbackService } from "../services/impliments/feedbackService";
import express from 'express';
import { verifyJWT } from '../middlewares/VerifyMiddileware';



const feedbackRepositorys = new feedbackRepository();
const feedbackServices = new FeedbackService(feedbackRepositorys);
const feedbackControllers = new feedbackController(feedbackServices);

const feedbackRoutes = express.Router();


feedbackRoutes.post('/addFeedback', verifyJWT, feedbackControllers.addFeedback);
feedbackRoutes.get('/getFeedbacks', verifyJWT, feedbackControllers.getFeedbacks);


export default feedbackRoutes




