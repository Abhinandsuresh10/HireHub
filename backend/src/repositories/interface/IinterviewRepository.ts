import { IInterview } from "../../models/InterviewSchema";
import { InterviewType } from "../../types/interview.types";


export interface IInterviewRepository {
    createInterview(data: InterviewType, applicationId: string): Promise<void>;
    getInterviews(recruiterId: string, page: number, limit: number, interviewType: string): Promise<{data: IInterview[], total: number}>;
    getUsersInterviews(userId: string, page: number, limit: number): Promise<{data: IInterview[], total: number}>;
    getInterviewById(id: string): Promise<IInterview | null>
    existInterview(time: string, date: Date): Promise<IInterview | null>;
    getCompletedInterviews(recruiterId: string, page: number, limit: number): Promise<{interviews:IInterview[]; total: number}>
    resheduleInterview(id: string, date: Date, time: string): Promise<void>;
    getInterview(id: string): Promise<IInterview | null>
}