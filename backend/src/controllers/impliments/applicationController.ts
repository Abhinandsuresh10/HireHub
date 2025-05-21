import { HttpResponse } from "../../constants/response.message";
import { HttpStatus } from "../../constants/status.constants";
import { IApplicationService } from "../../services/interface/IApplicationService";
import { Request, Response } from 'express'



export class applicationController {
    private service: IApplicationService;

    constructor(service: IApplicationService) {
       this.service = service;
    }

    public applyJob = async (req: Request, res: Response): Promise<void> => {
        try {
         const data = req.body;
         await this.service.applyJob(data);
         res.json({message: HttpResponse.APPLY_SUCCESS})
        } catch (error: unknown) {
          if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
          } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
          }
        }
      };
      
      public isApplied = async (req: Request, res: Response): Promise<void> => {
        try {
         const userId = req.query.userId as string;
         const jobId = req.query.jobId as string;
         
         const response = await this.service.isApplied(userId, jobId)
         res.status(HttpStatus.OK).json(response);
         
        } catch (error) {
         if (error instanceof Error) {
             res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
         } else {
             res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
         }
        }
   }

   public appliedJobs = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.query.userId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const appliedJobs = await this.service.appliedJobs(userId, page, limit);
      
      res.status(200).json({message: 'success', appliedJobs})
    } catch (error) {
        if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
      
    }
   }

   

   public getApplicants = async(req: Request, res: Response): Promise<void> => {
    try {
        const recruiterId = req.query.recruiterId as string;
        const page = parseInt(req.query.page as string);
        const limit = parseInt(req.query.limit as string);
        
        const { data, total } = await this.service.getApplicants(recruiterId, page, limit);
  
        res.status(HttpStatus.CREATED).json({message: HttpResponse.APPLICANTS_GET_SUCCESS, data, total});

    } catch (error) {
        if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        } 
    }
  }

  public acceptApplication = async(req: Request, res: Response): Promise<void> => {
    try {
      const id = req.query.id as string;
      const application = await this.service.acceptApplication(id);
      res.status(HttpStatus.OK).json({message: HttpResponse.APPLICANTS_GET_SUCCESS, application})
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
    } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
    } 
    }
  }

  public getApplicantion = async(req: Request, res: Response): Promise<void> => {
    try {
      const id = req.query.id as string;
      const applicantion = await this.service.getApplication(id);
      res.status(HttpStatus.OK).json({message: HttpResponse.APPLICANTS_GET_SUCCESS, applicantion})
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
    } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
    } 
    }
  }
}