import express from "express";
import { skillsController } from "../controllers/impliments/skillsController";
import { skillsRepository } from "../repositories/impliments/skillsRepository";
import { skillsService } from "../services/impliments/skillsService";
import { verifyJWT } from "../middlewares/VerifyMiddileware";

const skillsRepositorys = new skillsRepository();
const skillsServices = new skillsService(skillsRepositorys);
const skillsControllers = new skillsController(skillsServices);

const skillRoutes = express.Router();

skillRoutes.post('/addCategory', verifyJWT, skillsControllers.addCategory); 
skillRoutes.get('/getSkills', verifyJWT, skillsControllers.getSkills);
skillRoutes.post('/addSkill', verifyJWT, skillsControllers.addSkill);
skillRoutes.post('/deleteSkill', verifyJWT, skillsControllers.deleteSkill);
skillRoutes.delete('/deleteCategory', verifyJWT, skillsControllers.deleteCategory);


export default skillRoutes;