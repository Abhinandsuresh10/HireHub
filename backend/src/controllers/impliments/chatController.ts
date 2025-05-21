import { Request, Response } from "express";
import { IChatService } from "../../services/interface/IChatService";
import { HttpResponse } from "../../constants/response.message";
import { HttpStatus } from "../../constants/status.constants";


export class chatController {
    private service: IChatService;

    constructor(service: IChatService) {
       this.service = service;
    }

    public getUsers = async(req: Request, res: Response): Promise<void> => {
        try {
          const recruiterId = req.params.id as string;
          const users = await this.service.getUsersWithChat(recruiterId);
          res.status(HttpStatus.OK).json({message: HttpResponse.USER_FETCH_SUCCESS, users});
        } catch (error) {
          if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
          } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
          }
        }
    }

    public getRecruiters = async(req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.params.id as string;
        const recruiters = await this.service.getRecruitersWithChat(userId);
        
        res.status(HttpStatus.OK).json({message: HttpResponse.RECRUITER_FETCH_SUCCESS, recruiters});
      } catch (error) {
        if (error instanceof Error) {
          res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }  
      }
    }

}