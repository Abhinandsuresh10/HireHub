import Job, { IJob } from "../../models/JobSchema";
import { IjobRepositoryInterface } from "../interface/IjobRepositoryInterface";
import { BaseRepository } from "./baseRepository";




export class jobRepository extends BaseRepository<IJob> implements IjobRepositoryInterface {
      constructor() {
        super(Job)
      }

      async createJob(data: IJob): Promise<void> {
        try {
           await this.create(data);
        } catch (error) {
          console.log(error);
          throw new Error('Error on adding job')
        }
       }

       async getJobsById(id: string, page: number, limit: number): Promise<{data: IJob[], total: number}> {
           try {
           const {data, total} =  await this.findAllById({recruiterId: id}, page, limit);
           return {data, total};
           } catch (error) {
            console.log(error);
            throw new Error('Error on getting job')
           }
       }

       async deleteJobById(id: string): Promise<void> {
        try {
            await this.findByIdAndDelete(id);
        } catch (error) {
            console.log(error);
            throw new Error('Error on deleting job')
          }
       }

       async findAllJobs(page: number, limit: number, search: string): Promise<{ data: IJob[]; total: number; }> {
           try {
            const { data, total } = await this.findAll(page, limit, search);
            return {data, total}
           } catch (error) {
            console.log(error);
            throw new Error('Error on getting users')
           }
       }

       async getAjobById(id: string): Promise<IJob | null> {
        try {
          return await this.findByIds(id);
        } catch (error) {
            console.log(error);
            throw new Error('Error on getting job')
         }
       }

       async editJob(id: string, data: IJob): Promise<void> {
           try {
             await this.update(id , data)
           } catch (error) {
            console.log(error);
            throw new Error('Error on updating job')
           }
       }
}