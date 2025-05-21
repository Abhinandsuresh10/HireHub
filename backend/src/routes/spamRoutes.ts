import express from "express";
import { spamController } from "../controllers/impliments/spamController";
import { spamService } from "../services/impliments/spamService";
import { spamRepository } from "../repositories/impliments/spamRepository";
import { verifyJWT } from "../middlewares/VerifyMiddileware";

const spamRoutes = express.Router();

const spamRepositorys = new spamRepository();
const spamServices = new spamService(spamRepositorys);
const spamControllers = new spamController(spamServices);

spamRoutes.post('/addSpam', verifyJWT, spamControllers.postSpam);
spamRoutes.get('/getSpamReports', verifyJWT, spamControllers.getSpamReports);


export default spamRoutes;