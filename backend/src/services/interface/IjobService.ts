import { IJob } from "../../models/JobSchema";



export interface IjobService {
    postJob(data: IJob): Promise<void>;
    getJobs(id: string, page: number, limit: number): Promise<{data:IJob[]; total: number}>;
    deleteJob(id: string): Promise<void>;
    getUserJobs(userId: string, page: number, limit: number, search: string, jobType: string, jobLocation: string, minSalary: number, maxSalary: number): Promise<{data: IJob[]; total: number}>;
    findJobById(id: string): Promise<IJob | null>;
    editJob(id: string, data: IJob): Promise<void>;
    getRoles(): Promise<string[] | null>
    getTitles(): Promise<string[] | null>
}