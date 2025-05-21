import express, { Request, Response} from "express";
import { verifyJWT } from "../middlewares/VerifyMiddileware";
import { HttpStatus } from "../constants/status.constants";
import { HttpResponse } from "../constants/response.message";
import Notification from "../models/Notification";

const NotificationRoutes = express.Router();

NotificationRoutes.route('/notifications').get(verifyJWT, async (req: Request, res: Response): Promise<void> => {
     try {
       const userId = req.query.id as string;
       const page = parseInt(req.query.page as string);
       const limit = parseInt(req.query.limit as string);
       const skip = (page - 1) * limit;

       const [data, total] = await Promise.all([
        Notification.find({ userId })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .select("_id senderId content userId date"),
        Notification.countDocuments({ userId })
       ]);

       res.status(HttpStatus.OK).json({message: HttpResponse.NOTIFICATION_GET_SUCCESS, data, total})
     } catch (error) {
      if (error instanceof Error) {
         res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
       } else {
         res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
       }
     }
}).delete(verifyJWT, async (req: Request, res: Response): Promise<void> => {
    try {
       const id = req.query.id as string;
       await Notification.findByIdAndDelete(id);
       res.status(HttpStatus.OK).json({message: HttpResponse.NOTIFICATION_DELETE_SUCCESS}) 
    } catch (error) {
       if (error instanceof Error) {
         res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
       } else {
         res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
       }  
    }
})

export default NotificationRoutes;
