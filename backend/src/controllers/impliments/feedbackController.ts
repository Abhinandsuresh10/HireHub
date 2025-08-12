import { Request, Response } from 'express';
import { IFeedbackService } from '../../services/interface/IFeedbackService';
import { HttpStatus } from '../../constants/status.constants';
import { HttpResponse } from '../../constants/response.message';


export class feedbackController {
    private service: IFeedbackService;

    constructor(service: IFeedbackService) {
        this.service = service;
    }


    public addFeedback = async(req: Request, res: Response): Promise<void> => {
        try {
          const {id, role, comment} = req.body;

          await this.service.addFeedback(id, role, comment);

          res.status(HttpStatus.OK).json({ message: HttpResponse.FEEDBACK_ADD_SUCCESS })
        } catch (error) {
         if (error instanceof Error) {
          res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
          } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
          }   
        }
    }

    public getFeedbacks = async(req: Request, res: Response): Promise<void> => {
        try {
          const id = req.query.id as string;
          const role = req.query.role as string;
          
          const feedbacks = await this.service.getFeedbacks(id, role);

          res.status(HttpStatus.OK).json({ message: HttpResponse.FEEDBACK_GET_SUCCESS, feedbacks });
          
        } catch (error) {
         if (error instanceof Error) {
          res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
          } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
          } 
        }
    }

}
