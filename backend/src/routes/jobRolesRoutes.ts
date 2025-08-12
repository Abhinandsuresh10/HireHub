import express from 'express';
import { jobRolesController } from '../controllers/impliments/jobRolesController';
import { jobRolesRepository } from '../repositories/impliments/jobRolesRepository';
import { jobRolesService } from '../services/impliments/jobRolesService';
import { verifyJWT } from '../middlewares/VerifyMiddileware';


const jobRolesRoutes = express.Router();

const jobRolesRepositorys = new jobRolesRepository();
const jobRolesServices = new jobRolesService(jobRolesRepositorys);
const jobRolesControllers = new jobRolesController(jobRolesServices);

jobRolesRoutes.post('/addCategory', verifyJWT, jobRolesControllers.addCategory);
jobRolesRoutes.get('/getCategory', verifyJWT, jobRolesControllers.getCategory);
jobRolesRoutes.put('/addJobRoles', verifyJWT, jobRolesControllers.addJobRoles);
jobRolesRoutes.delete('/deleteCategory/:id', verifyJWT, jobRolesControllers.deleteCategory);
jobRolesRoutes.patch('/deleteJobRoles', verifyJWT, jobRolesControllers.deleteJobRoles)


export default jobRolesRoutes;