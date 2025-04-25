import express from 'express'
import { verifyJWT } from '../middlewares/VerifyMiddileware';
import { experienceController } from '../controllers/impliments/experienceController';
import { experienceRepository } from '../repositories/impliments/experienceRepository';
import { experienceService } from '../services/impliments/experienceService';

const experienceRepositorys = new experienceRepository();
const experienceServices = new experienceService(experienceRepositorys);
const experienceControllers = new experienceController(experienceServices);

const experienceRoutes = express.Router();


experienceRoutes.post('/addExperience', verifyJWT, experienceControllers.addExperience);
experienceRoutes.get('/getExperience', verifyJWT, experienceControllers.getExperience);
experienceRoutes.delete('/deleteExperience', verifyJWT, experienceControllers.deleteExperience)


export default experienceRoutes;