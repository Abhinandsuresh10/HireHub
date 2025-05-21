import { Request, Response } from "express";
import { HttpResponse } from "../../constants/response.message";
import { HttpStatus } from "../../constants/status.constants";
import { IInterviewService } from "../../services/interface/IinterviewService";


export class interviewController {
    public service: IInterviewService;

    constructor(service: IInterviewService) {
        this.service = service;
    }

    public createInterview = async (req: Request, res: Response): Promise<void> => {
        try {
          const data = req.body.data;
          const applicationId = req.body.application._id as string;
          data.jobId = req.body.application.jobId as string;
          data.userId = req.body.application.userId as string;
          data.recruiterId = req.body.application.recruiterId as string;
          await this.service.createInterview(data, applicationId);
          res.status(HttpStatus.CREATED).json({message: HttpResponse.INTERVIEW_SHEDULE_SUCCUSS})
        } catch (error) {
          if (error instanceof Error) {
          res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
          } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
          }
        }
    }

    public getInterviews = async (req: Request, res: Response): Promise<void> => {
      try {
       const recruiterId = req.query.recruiterId as string;
       const page = parseInt(req.query.page as string);
       const limit = parseInt(req.query.limit as string);
       const { data, total} = await this.service.getInterviews(recruiterId, page, limit);
       res.status(HttpStatus.OK).json({message: HttpResponse.INTERVIEW_GET_SUCCESS, data, total})
      } catch (error) {
       if (error instanceof Error) {
       res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
       } else {
       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
       } 
      }
    }

    public getUsersInterviews = async (req: Request, res: Response): Promise<void> => {
      try {
       const userId = req.query.userId as string;
       const page = parseInt(req.query.page as string);
       const limit = parseInt(req.query.limit as string);
       
       const { data, total } = await this.service.getUsersInterviews(userId, page, limit);
       res.status(HttpStatus.OK).json({message: HttpResponse.INTERVIEW_GET_SUCCESS, data, total});
      } catch (error) {
       if (error instanceof Error) {
       res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
       } else {
       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
       } 
      }
    }

    public getInterviewById = async (req: Request, res: Response): Promise<void> => {
      try {
        const id = req.params.id as string;
       
        const interview = await this.service.getInterviewById(id);

        res.status(HttpStatus.OK).json({message: HttpResponse.INTERVIEW_GET_SUCCESS, interview})
      } catch (error) {
       if (error instanceof Error) {
       res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
       } else {
       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
       } 
      }
    }
}