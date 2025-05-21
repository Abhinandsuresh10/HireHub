import express from "express";
import { chatController } from "../controllers/impliments/chatController";
import { chatService } from "../services/impliments/chatService";
import { chatRepository } from "../repositories/impliments/chatRepository";
import { verifyJWT } from "../middlewares/VerifyMiddileware";

const chatRepo = new chatRepository();
const chatserv = new chatService(chatRepo);
const chatControllers = new chatController(chatserv);

const chatRoutes = express.Router();


chatRoutes.route('/users/:id').get(verifyJWT, chatControllers.getUsers);
chatRoutes.route('/recruiters/:id').get(verifyJWT, chatControllers.getRecruiters);


export default chatRoutes;