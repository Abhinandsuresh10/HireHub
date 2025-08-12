import { IApplication } from "../../models/ApplicatinSchema";

export interface IApplicationService {
    applyJob(data: IApplication): Promise<void>;
    isApplied(userId: string, jobId: string): Promise<string>;
    appliedJobs(userId: string, page: number, limit: number): Promise<{ data: IApplication[]; total: number; }>;
    getApplicants(id: string, page: number, limit: number): Promise<{data: any[]; total: number}>;
    acceptApplication(id: string): Promise<IApplication | null>;
    rejectApplication(id: string): Promise<IApplication | null>
    getApplication(id: string): Promise<IApplication | null>;
    getAppliedApplication(userId: string, jobId: string): Promise<IApplication | null>;
    getJobRole(jobId: string): Promise<string>;
    declineEmail(reason: string, name: string, email: string, jobRole: string): Promise<void>;
    hireInterviewe(id: string): Promise<void>;
}