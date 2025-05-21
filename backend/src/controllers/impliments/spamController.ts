import { Request, Response } from "express";
import { ISpamService } from "../../services/interface/IspamService";
import { HttpResponse } from "../../constants/response.message";
import { HttpStatus } from "../../constants/status.constants";


export class spamController {
    public service: ISpamService;

    constructor(service: ISpamService) {
        this.service = service;
    }

    public postSpam = async (req: Request, res: Response): Promise<void> => {
        try {
          const spam = req.body;
          spam.refId = req.query.id as string;;
          spam.role = req.query.role as string;
          await this.service.createSpam(spam);
          res.status(HttpStatus.OK).json({message: HttpResponse.SPAM_CREATE_SUCCESS})
        } catch (error) {
          if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
    }

    public getSpamReports = async (req: Request, res: Response): Promise<void> => {
      try {
        const reports = await this.service.getSpamReports();
        res.status(HttpStatus.OK).json({message: HttpResponse.REPORT_GET_SUCCESS, reports})
      } catch (error) {
        if (error instanceof Error) {
          res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
      } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
      }        
      }
    }

}