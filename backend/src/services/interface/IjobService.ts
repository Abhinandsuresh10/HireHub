import { IJob } from "../../models/JobSchema";



export interface IjobService {
    postJob(data: IJob): Promise<void>;
    getJobs(id: string, page: number, limit: number): Promise<{data:IJob[]; total: number}>;
    deleteJob(id: string): Promise<void>;
    getUserJobs(page: number, limit: number, search: string): Promise<{data: IJob[]; total: number}>;
    findJobById(id: string): Promise<IJob | null>;
    editJob(id: string, data: IJob): Promise<void>;
}