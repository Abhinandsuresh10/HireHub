import { IApplication } from "../../models/ApplicatinSchema";

export interface IApplicationService {
    applyJob(data: IApplication): Promise<void>;
    isApplied(userId: string, jobId: string): Promise<boolean>;
    appliedJobs(userId: string, page: number, limit: number): Promise<{ data: IApplication[]; total: number; }>;
    getApplicants(id: string, page: number, limit: number): Promise<{data: any[]; total: number}>;
    acceptApplication(id: string): Promise<IApplication | null>;
    getApplication(id: string): Promise<IApplication | null>;
}