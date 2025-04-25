
export interface IjobController {
    postJob(req:Request, res:Response): Promise<void>;
    getJobs(req:Request, res:Response): Promise<void>;
    userGetJob(req:Request, res:Response): Promise<void>;
    getJobById(req:Request, res:Response): Promise<void>;
}