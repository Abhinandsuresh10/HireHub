import  Application, { IApplication } from "../../models/ApplicatinSchema";
import { BaseRepository } from "./baseRepository";
import { IapplicationRepository } from "../interface/IapplicationRepository";


export class applicationRepository extends BaseRepository<IApplication> implements IapplicationRepository {
      constructor() {
        super(Application)
      }

      async createApplication(data: IApplication): Promise<void> {
        try {
           await this.create(data);
        } catch (error) {
          console.log(error);
          throw new Error('Error on creating application')
        }
       }
       

       async checkIsApplied (userId: string, jobId: string): Promise<boolean> {
        try {
          const exists = await Application.exists({userId, jobId});
          return !!exists;
        } catch (error) {
          console.log(error);
          throw new Error('Error on getting isApplied')
        }
       }

       async getAppliedJobs(userId: string, page: number, limit: number): Promise<{ data: IApplication[]; total: number; }> {
        try {
          const { data, total } = await this.findAllById({userId}, page, limit);
          return { data, total };
        } catch (error) {
          console.log(error);
          throw new Error('Error on getting applied jobs')
        }
       }
}