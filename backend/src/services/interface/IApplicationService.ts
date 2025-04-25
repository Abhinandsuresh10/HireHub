import { IApplication } from "../../models/ApplicatinSchema";

export interface IApplicationService {
    applyJob(data: IApplication): Promise<void>;
    isApplied(userId: string, jobId: string): Promise<boolean>;
    appliedJobs(userId: string, page: number, limit: number): Promise<{ data: IApplication[]; total: number; }>;
}