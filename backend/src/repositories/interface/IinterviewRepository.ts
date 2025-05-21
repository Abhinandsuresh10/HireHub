import { IInterview } from "../../models/InterviewSchema";
import { InterviewType } from "../../types/interview.types";


export interface IInterviewRepository {
    createInterview(data: InterviewType, applicationId: string): Promise<void>;
    getInterviews(recruiterId: string, page: number, limit: number): Promise<{data: IInterview[], total: number}>;
    getUsersInterviews(userId: string, page: number, limit: number): Promise<{data: IInterview[], total: number}>;
    getInterviewById(id: string): Promise<IInterview | null>
}