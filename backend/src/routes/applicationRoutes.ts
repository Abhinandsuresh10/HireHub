import express from 'express';
import { verifyJWT } from "../middlewares/VerifyMiddileware";
import { applicationController } from '../controllers/impliments/applicationController';
import { applicationRepository } from '../repositories/impliments/applicationRepository';
import { applicationService } from '../services/impliments/applicationService';
import { jobRepository } from '../repositories/impliments/jobRespository';



const applicationRepositorys = new applicationRepository();
const jobRepositorys = new jobRepository()
const applicationServices = new applicationService(applicationRepositorys, jobRepositorys);
const applicationControllers = new applicationController(applicationServices);

const applicationRoutes = express.Router();


applicationRoutes.post('/apply', verifyJWT, applicationControllers.applyJob);
applicationRoutes.get('/isApplied', verifyJWT, applicationControllers.isApplied);
applicationRoutes.get('/appliedJobs', verifyJWT, applicationControllers.appliedJobs);
applicationRoutes.get('/getApplicants', verifyJWT, applicationControllers.getApplicants);
applicationRoutes.patch('/acceptApplication', verifyJWT, applicationControllers.acceptApplication);
applicationRoutes.patch('/rejectApplication', verifyJWT, applicationControllers.rejectApplication)
applicationRoutes.get('/getApplication', verifyJWT, applicationControllers.getApplicantion);
applicationRoutes.get('/getAppliedApplication', verifyJWT, applicationControllers.getAppliedApplication);
applicationRoutes.post('/declineMail', verifyJWT, applicationControllers.declineMail);

applicationRoutes.patch('/hireInterviewe', verifyJWT, applicationControllers.hireInterviewe)

export default applicationRoutes;