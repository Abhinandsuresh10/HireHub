import { HttpResponse } from "../../constants/response.message";
import { IInterview } from "../../models/InterviewSchema";
import { IInterviewRepository } from "../../repositories/interface/IinterviewRepository";
import { InterviewType } from "../../types/interview.types";
import { IInterviewService } from "../interface/IinterviewService";



export class interviewService implements IInterviewService {
    private repository: IInterviewRepository;

    constructor(repository: IInterviewRepository) {
        this.repository = repository;
    }

    async createInterview(data: InterviewType, applicationId: string): Promise<void> {
        try {
            const exists = await this.repository.existInterview(data.time, data.date);

            if (exists) {
                throw new Error(HttpResponse.ALREADY_SHEDULED_INTERVIEW);
            }
            await this.repository.createInterview(data, applicationId);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }

    async getInterviews(recruiterId: string, page: number, limit: number, interviewType: string): Promise<{ data: IInterview[]; total: number; }> {
        try {
            const { data, total } = await this.repository.getInterviews(recruiterId, page, limit, interviewType);
            return { data, total }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }

    async getUsersInterviews(userId: string, page: number, limit: number): Promise<{ data: IInterview[]; total: number; }> {
        try {
            const { data, total } = await this.repository.getUsersInterviews(userId, page, limit);
            return { data, total }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }
    async getInterviewById(id: string): Promise<IInterview | null> {
        try {
            return await this.repository.getInterviewById(id);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }

    async resheduleInterview(id: string, date: Date, time: string): Promise<void> {
        try {
            await this.repository.resheduleInterview(id, date, time);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }

    async getInterview(id: string): Promise<IInterview | null> {
        try {
           const interview = await this.repository.getInterview(id);
           if(!interview) throw new Error(HttpResponse.INTERVIEW_GET_FAIL);
           return interview;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }

}