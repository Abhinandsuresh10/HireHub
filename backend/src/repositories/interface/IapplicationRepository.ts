import { IApplication } from "../../models/ApplicatinSchema";

export interface IapplicationRepository {
    createApplication(data: IApplication): Promise<void>;
    checkIsApplied(userId: string, jobId: string): Promise<boolean>;
    getAppliedJobs(userId: string, page: number, limit: number): Promise<{ data: IApplication[]; total: number; }>;
    getAllApplicants(id: string, page: number, limit: number): Promise<{data: any[], total: number}>;
    findApplicationById(id: string): Promise<IApplication | null>;
    findIdAndUpdate(id: string): Promise<IApplication | null>;
}