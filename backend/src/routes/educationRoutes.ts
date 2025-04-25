import express from 'express'
import { educationController } from '../controllers/impliments/educationController';
import { educationService } from '../services/impliments/educationService';
import { educationRepository } from '../repositories/impliments/educationRepository';
import { verifyJWT } from '../middlewares/VerifyMiddileware';


const educationRepositorys = new educationRepository();
const educationServices = new educationService(educationRepositorys);
const educationControllers = new educationController(educationServices);

const educationRoutes = express.Router();

educationRoutes.post('/addEducation', verifyJWT, educationControllers.addEducation);
educationRoutes.get('/getEducation', verifyJWT, educationControllers.getEducation);
educationRoutes.delete('/deleteEducation', verifyJWT, educationControllers.deleteEducaiton);

export default educationRoutes;