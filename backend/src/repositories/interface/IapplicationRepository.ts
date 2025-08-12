import { IApplication } from "../../models/ApplicatinSchema";

export interface IapplicationRepository {
    createApplication(data: IApplication): Promise<void>;
    checkIsApplied(userId: string, jobId: string): Promise<string>;
    getAppliedJobs(userId: string, page: number, limit: number): Promise<{ data: IApplication[]; total: number; }>;
    getAllApplicants(id: string, page: number, limit: number): Promise<{data: any[], total: number}>;
    findApplicationById(id: string): Promise<IApplication | null>;
    findIdAndUpdate(id: string, status: string): Promise<IApplication | null>;
    getAppliedApplication(userId: string, jobId: string): Promise<IApplication | null>;
    hireInterviewe(id: string): Promise<void>;
}