import express from 'express';
import { verifyJWT } from "../middlewares/VerifyMiddileware";
import { applicationController } from '../controllers/impliments/applicationController';
import { applicationRepository } from '../repositories/impliments/applicationRepository';
import { applicationService } from '../services/impliments/applicationService';



const applicationRepositorys = new applicationRepository();
const applicationServices = new applicationService(applicationRepositorys);
const applicationControllers = new applicationController(applicationServices);

const applicationRoutes = express.Router();


applicationRoutes.post('/apply', verifyJWT, applicationControllers.applyJob);
applicationRoutes.get('/isApplied', verifyJWT, applicationControllers.isApplied);
applicationRoutes.get('/appliedJobs', verifyJWT, applicationControllers.appliedJobs);
applicationRoutes.get('/getApplicants', verifyJWT, applicationControllers.getApplicants);
applicationRoutes.patch('/acceptApplication', verifyJWT, applicationControllers.acceptApplication);
applicationRoutes.get('/getApplication', verifyJWT, applicationControllers.getApplicantion);

export default applicationRoutes;