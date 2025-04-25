import { HttpResponse } from "../../constants/response.message";
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
            res.status(400).json({ error: error.message }); 
          } else {
            res.status(500).json({ error: HttpResponse.SERVER_ERROR });
          }
        }
      };
      
      public isApplied = async (req: Request, res: Response): Promise<void> => {
        try {
         const userId = req.query.userId as string;
         const jobId = req.query.jobId as string;
         
         const response = await this.service.isApplied(userId, jobId)
         res.status(200).json(response);
         
        } catch (error) {
         if (error instanceof Error) {
             res.status(400).json({ error: error.message }); 
         } else {
             res.status(500).json({ error: HttpResponse.SERVER_ERROR });
         }
        }
   }

   public appliedJobs = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.query.userId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const datas = await this.service.appliedJobs(userId, page, limit);
      console.log('appliedJobs', datas);
      const appliedJobs = [
        {
          id: 1,
          title: 'Frontend Developer',
          company: 'TechCorp',
          location: 'San Francisco, CA',
          salary: '$90,000 - $120,000',
          status: 'Under Review',
          appliedDate: '2023-05-15',
          type: 'Full-time'
        },
        {
          id: 2,
          title: 'UX Designer',
          company: 'DesignHub',
          location: 'Remote',
          salary: '$85,000 - $110,000',
          status: 'Application Sent',
          appliedDate: '2023-05-18',
          type: 'Contract'
        }
      ]
      res.status(200).json({message: 'success', appliedJobs})
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message }); 
        } else {
            res.status(500).json({ error: HttpResponse.SERVER_ERROR });
        }
      
    }
   }
}