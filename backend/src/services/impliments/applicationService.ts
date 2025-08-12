import { HttpResponse } from "../../constants/response.message";
import { IApplication } from "../../models/ApplicatinSchema";
import { IApplicationService } from "../interface/IApplicationService";
import { IapplicationRepository } from "../../repositories/interface/IapplicationRepository";
import { IjobRepositoryInterface } from "../../repositories/interface/IjobRepositoryInterface";
import { sendCancellationEmail } from "../../utils/mail.util";


export class applicationService implements IApplicationService {
    private applicationRepository: IapplicationRepository;
    private jobRepository: IjobRepositoryInterface;

    constructor(applicationRepository: IapplicationRepository, jobRepository: IjobRepositoryInterface) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository
    }

    async applyJob(data: IApplication) {
        try {
            await this.applicationRepository.createApplication(data);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR);
            }
        }
    }


    async isApplied(userId: string, jobId: string): Promise<string> {
        try {
            return await this.applicationRepository.checkIsApplied(userId, jobId);
        } catch (error: any) {
            console.log(error.message);
            throw new Error(error.message);
        }
    }

    async appliedJobs(userId: string, page: number, limit: number): Promise<{ data: IApplication[]; total: number; }> {
        try {
            const { data, total } = await this.applicationRepository.getAppliedJobs(userId, page, limit);
            return { data, total };
        } catch (error: any) {
            console.log(error.message);
            throw new Error(error.message);
        }
    }



    async getApplicants(id: string, page: number, limit: number): Promise<{ data: any[]; total: number }> {
        try {
            const { data, total } = await this.applicationRepository.getAllApplicants(id, page, limit);
            return { data, total };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }

    async acceptApplication(id: string): Promise<IApplication | null> {
        try {
            const application = await this.applicationRepository.findApplicationById(id);
            if (!application) {
                throw new Error(HttpResponse.GET_FAIL)
            }
            const applicant = await this.applicationRepository.findIdAndUpdate(id, 'ShortListed');
            return applicant
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }



    async rejectApplication(id: string): Promise<IApplication | null> {
        try {
            const application = await this.applicationRepository.findApplicationById(id);
            if (!application) {
                throw new Error(HttpResponse.GET_FAIL)
            }
            const applicant = await this.applicationRepository.findIdAndUpdate(id, 'Rejected');
            return applicant
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }

    async getApplication(id: string): Promise<IApplication | null> {
        try {
            const application = await this.applicationRepository.findApplicationById(id);
            if (!application) {
                throw new Error(HttpResponse.GET_FAIL)
            }
            return application;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }

    async getAppliedApplication(userId: string, jobId: string): Promise<IApplication | null> {
        try {
            return await this.applicationRepository.getAppliedApplication(userId, jobId);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }

    async getJobRole(jobId: string): Promise<string> {
        try {
            const job = await this.jobRepository.getAjobById(jobId);
            if (!job) throw new Error(HttpResponse.JOB_NOT_FOUND);
            return job.jobRole;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }

    async declineEmail(reason: string, name: string, email: string, jobRole: string): Promise<void> {
        try {
            await sendCancellationEmail({ email, name, jobRole, reason })
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }

    async hireInterviewe(id: string): Promise<void> {
        try {
           await this.applicationRepository.hireInterviewe(id)
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
    }
}