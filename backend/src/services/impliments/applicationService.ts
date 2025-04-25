import { HttpResponse } from "../../constants/response.message";
import { IApplication } from "../../models/ApplicatinSchema";
import { IApplicationService } from "../interface/IApplicationService";
import { IapplicationRepository } from "../../repositories/interface/IapplicationRepository";


export class applicationService implements IApplicationService {
    private applicationRepository: IapplicationRepository;

    constructor(applicationRepository: IapplicationRepository) {
         this.applicationRepository = applicationRepository;
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

     
     async isApplied(userId: string, jobId: string): Promise<boolean> {
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
}