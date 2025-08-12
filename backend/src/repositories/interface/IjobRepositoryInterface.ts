import { IJob } from "../../models/JobSchema";
import { Prefference } from "../../types/job.types";



export interface IjobRepositoryInterface {
    createJob(data: IJob): Promise<void>;
    getJobsById(id: string, page: number, limit: number): Promise<{data: IJob[]; total: number}>;
    deleteJobById(id: string): Promise<void>;
    findAllJobs(prefferd: Prefference | null,page: number, limit: number, search: string, jobType: string, jobLocation: string, minSalary: number, maxSalary: number): Promise<{data: IJob[]; total: number}>;
    getAjobById(id: string): Promise<IJob | null>;
    editJob(id: string, data: IJob): Promise<void>;
    getRoles(): Promise<string[] | null>
    getTitles(): Promise<string[] | null>
}