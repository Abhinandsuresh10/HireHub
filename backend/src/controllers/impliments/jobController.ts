import { HttpResponse } from "../../constants/response.message";
import { HttpStatus } from "../../constants/status.constants";
import { IJob } from "../../models/JobSchema";
import { IjobService } from "../../services/interface/IjobService";
import { Request, Response } from "express";


export class jobController {
    private service: IjobService;

    constructor(service: IjobService) {
        this.service = service;
    }

    public postJob = async (req:Request, res:Response): Promise<void> => {
        try {
          const data = req.body.data;
          data.recruiterId = req.body.id;
          data.company = req.body.company;
          await this.service.postJob(data);
          res.status(HttpStatus.CREATED).json({message: HttpResponse.JOB_POST_SUCCESS});
        } catch (error) {
          if (error instanceof Error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
        }
        }
      } 

      public getJobs = async (req:Request, res:Response): Promise<void> => {
        try {
        const recruiterId = req.query.id as string;
        const page = parseInt(req.query.page as string);
        const limit = parseInt(req.query.limit as string);

        const { data, total } = await this.service.getJobs(recruiterId, page, limit);
        res.status(200).json({message: HttpResponse.RETRIVE_JOBS_SUCCESS , data , total});
        
        } catch (error) {
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
            }
        }
      }

      public deleteJob = async (req: Request, res: Response): Promise<void> => {
           try {
            const id = req.query.id as string;
            await this.service.deleteJob(id);
            res.status(200).json({Message: HttpResponse.JOB_DELETE_SUCCESS})
           } catch (error) {
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
            }
           }
      }

      public userGetJob = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 6;
            const search = req.query.search as string || '';
            const { data , total} = await this.service.getUserJobs(page, limit, search);
            res.status(200).json({message: HttpResponse.JOBS_FETCH_SUCCESS, data, total});
            
        } catch (error) {
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
            }
        }
      }

      public getJobById = async(req: Request, res: Response): Promise<void> => {
        try {
            const id = req.query.id as string;
            const job = await this.service.findJobById(id);
            res.status(200).json({message: HttpResponse.JOBS_FETCH_SUCCESS, job});
        } catch (error) {
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
            }
        }
      }

      public editJob = async(req: Request, res: Response): Promise<void> => {
        try {
            const id = req.body.id as string;
            const data = req.body.data as IJob;
            await this.service.editJob(id, data)
            res.status(200).json({message: HttpResponse.JOB_EDIT_SUCCESS})
        } catch (error) {
            if (error instanceof Error) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
            } 
        }
      }

      public getRoles = async(req: Request, res: Response): Promise<void> => {
        try {
           const roles = await this.service.getRoles();
           res.status(HttpStatus.OK).json({message: HttpResponse.JOBS_FETCH_SUCCESS, roles}) 
        } catch (error) {
          if (error instanceof Error) {
              res.status(HttpStatus.BAD_REQUEST).json({ error: error.message }); 
          } else {
              res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: HttpResponse.SERVER_ERROR });
          } 
        }
      }

}