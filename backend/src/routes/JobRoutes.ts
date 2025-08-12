import express  from "express";
import { jobController } from "../controllers/impliments/jobController";
import { jobService } from "../services/impliments/jobService";
import { jobRepository } from "../repositories/impliments/jobRespository";
import { verifyJWT } from "../middlewares/VerifyMiddileware";
import { userRepository } from "../repositories/impliments/userRepository";

const jobRoutes = express.Router();

const jobRepositorys = new jobRepository();
const userRepositorys = new userRepository();
const jobServices = new jobService(jobRepositorys, userRepositorys);
const jobControllers = new jobController(jobServices);


jobRoutes.post('/postJob', verifyJWT ,jobControllers.postJob);
jobRoutes.get('/getJob', verifyJWT ,jobControllers.getJobs);
jobRoutes.patch('/deleteJob', verifyJWT ,jobControllers.deleteJob);
jobRoutes.post('/editJob', verifyJWT, jobControllers.editJob);

jobRoutes.get('/userGetJob', verifyJWT, jobControllers.userGetJob);

jobRoutes.get('/getJobById', verifyJWT, jobControllers.getJobById);
jobRoutes.get('/getRoles', verifyJWT, jobControllers.getRoles);
jobRoutes.get('/getTitles', verifyJWT, jobControllers.getTitles);

export default jobRoutes;