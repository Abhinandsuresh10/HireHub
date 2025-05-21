import { HttpResponse } from "../../constants/response.message";
import { IJob } from "../../models/JobSchema";
import { jobRepository } from "../../repositories/impliments/jobRespository";
import { IjobRepositoryInterface } from "../../repositories/interface/IjobRepositoryInterface";
import { IjobService } from "../interface/IjobService";


export class jobService implements IjobService {
    private jobRepository: IjobRepositoryInterface;

    constructor(jobRepository: jobRepository) {
         this.jobRepository = jobRepository;
    }

    async postJob(data: IJob) {
        try {
         await this.jobRepository.createJob(data);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR);
           }
        }
     }

     async getJobs(id: string, page: number, limit: number): Promise<{data: IJob[]; total: number}> {
         try {
           const {data, total} = await this.jobRepository.getJobsById(id, page, limit);
           return { data, total};
         } catch (error) {
            if(error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
         }
     }

     async deleteJob(id: string): Promise<void> {
        try {
            await this.jobRepository.deleteJobById(id);
        } catch (error) {
            if(error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
     }

     async getUserJobs(page: number, limit: number, search: string): Promise<{ data: IJob[]; total: number; }> {
         try {
            const { data , total} = await this.jobRepository.findAllJobs(page, limit, search);
          if(!data) {
              throw new Error(HttpResponse.UNABLE_FETCH_JOBS)
          }
          return { data, total};
         } catch (error) {
            if(error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
         }
     }

     async findJobById(id: string): Promise<IJob | null> {
         try {
            const data = await this.jobRepository.getAjobById(id);
            if(!data) {
                throw new Error(HttpResponse.JOB_NOT_FOUND)
            }
            return data;
         } catch (error) {
            if(error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
         }
     }

     async editJob(id: string, data: IJob): Promise<void> {
        try {
            const job = await this.jobRepository.getAjobById(id);
            if(!job) {
                throw new Error(HttpResponse.JOB_NOT_FOUND)
            }
            job.jobRole = data.jobRole;
            job.jobType = data.jobType;
            job.jobLocation = data.jobLocation;
            job.minSalary = data.minSalary;
            job.maxSalary = data.maxSalary;
            job.jobDescription = data.jobDescription;
            job.responsibilities = data.responsibilities;
            job.skills = data.skills;
            job.qualification = data.qualification;
            job.deadline = data.deadline;

            await this.jobRepository.editJob(id , job);

        } catch (error) {
            if(error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            }
        }
     }
      
     async getRoles(): Promise<string[] | null> {
         try {
            return await this.jobRepository.getRoles();
         } catch (error) {
            if(error instanceof Error) {
                throw error;
            } else {
                throw new Error(HttpResponse.UNKNOWN_ERROR)
            } 
         }
     }

}