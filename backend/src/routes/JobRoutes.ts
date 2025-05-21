import express  from "express";
import { jobController } from "../controllers/impliments/jobController";
import { jobService } from "../services/impliments/jobService";
import { jobRepository } from "../repositories/impliments/jobRespository";
import { verifyJWT } from "../middlewares/VerifyMiddileware";

const jobRoutes = express.Router();

const jobRepositorys = new jobRepository();
const jobServices = new jobService(jobRepositorys);
const jobControllers = new jobController(jobServices);


jobRoutes.post('/postJob', verifyJWT ,jobControllers.postJob);
jobRoutes.get('/getJob', verifyJWT ,jobControllers.getJobs);
jobRoutes.patch('/deleteJob', verifyJWT ,jobControllers.deleteJob);
jobRoutes.get('/userGetJob', verifyJWT, jobControllers.userGetJob);
jobRoutes.get('/getJobById', verifyJWT, jobControllers.getJobById);
jobRoutes.post('/editJob', verifyJWT, jobControllers.editJob);
jobRoutes.get('/getRoles', verifyJWT, jobControllers.getRoles);

export default jobRoutes;