import express from "express";
import { adminRepository } from "../repositories/impliments/adminRepository";
import { adminService } from "../services/impliments/adminService";
import { adminController } from "../controllers/impliments/adminController";
import { verifyJWT } from "../middlewares/VerifyMiddileware";

const adminRoutes = express.Router();

const adminRepositorys = new adminRepository()
const adminServices = new adminService(adminRepositorys)
const adminControllers = new adminController(adminServices);

adminRoutes.post('/register', adminControllers.register);
adminRoutes.post('/login', adminControllers.login);
adminRoutes.get('/getUsers', verifyJWT, adminControllers.getUsers);
adminRoutes.get('/getRecruiters', verifyJWT ,adminControllers.getRecruiters)
adminRoutes.patch('/userBlockUnblock', verifyJWT ,adminControllers.userBlockUnblock)
adminRoutes.patch('/recruiterBlockUnblock', verifyJWT ,adminControllers.recruiterBlockUnblock)

export default adminRoutes;