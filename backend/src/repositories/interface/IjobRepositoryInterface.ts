import { IJob } from "../../models/JobSchema";



export interface IjobRepositoryInterface {
    createJob(data: IJob): Promise<void>;
    getJobsById(id: string, page: number, limit: number): Promise<{data: IJob[]; total: number}>;
    deleteJobById(id: string): Promise<void>;
    findAllJobs(page: number, limit: number, search: string): Promise<{data: IJob[]; total: number}>;
    getAjobById(id: string): Promise<IJob | null>;
    editJob(id: string, data: IJob): Promise<void>;
    getRoles(): Promise<string[] | null>
}