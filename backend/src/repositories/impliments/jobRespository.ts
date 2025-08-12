import Job, { IJob } from "../../models/JobSchema";
import { Prefference } from "../../types/job.types";
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


  async getJobsById(id: string, page: number, limit: number): Promise<{ data: IJob[], total: number }> {
    try {
       const skip = (page - 1) * limit;
   
       const data = await Job.find({ recruiterId: id })
         .skip(skip)
         .limit(limit)
         .sort({ createdAt: -1 });
   
       const total = await Job.countDocuments({ recruiterId: id }).sort({ createdAt: -1});
   
       return { data, total };
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

  async findAllJobs(prefference: Prefference, page: number, limit: number, search: string, jobType: string, jobLocation: string, minSalary: number, maxSalary: number): Promise<{ data: IJob[]; total: number; }> {
    try {
      
      const query: any = { isBlocked: false };

      const preferenceConditions: any[] = [];

      if (prefference.preferredJobRoles?.length) {
        preferenceConditions.push({ jobRole: { $in: prefference.preferredJobRoles } });
      }

      if (prefference.preferredJobTypes?.length) {
        preferenceConditions.push({ jobType: { $in: prefference.preferredJobTypes } });
      }

      if (jobType) {
        query.jobType = jobType;
      }

      if (jobLocation) {
        query.jobLocation = { $regex: jobLocation, $options: "i" };
      }

      if (typeof minSalary === 'number' && !isNaN(minSalary) || typeof maxSalary === 'number' && !isNaN(maxSalary)) {
        const salaryFilter: any[] = [];

        if (typeof minSalary === 'number') {
          salaryFilter.push({ minSalary: { $gte: minSalary } });
        }

        if (typeof maxSalary === 'number') {
          salaryFilter.push({ maxSalary: { $lte: maxSalary } });
        }

        if (salaryFilter.length) {
          query.$and = query.$and || [];
          query.$and.push(...salaryFilter);
        }
      }

      const searchConditions: any[] = [];

      if (search) {
        const regex = { $regex: search, $options: "i" };
        searchConditions.push(
          { jobRole: regex },
          { company: regex },
          { jobLocation: regex }
        );
      }

      if (searchConditions.length && preferenceConditions.length) {
        query.$and = [
          { $or: preferenceConditions },
          { $or: searchConditions }
        ];
      } else if (searchConditions.length) {
        query.$or = searchConditions;
      } else if (preferenceConditions.length) {
        query.$or = preferenceConditions;
      }


      const skip = (page - 1) * limit;

      const data = await Job.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Job.countDocuments(query);

      return { data, total };

    } catch (error) {
      console.log(error);
      throw new Error('Error on getting job')
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
      await this.update(id, data)
    } catch (error) {
      console.log(error);
      throw new Error('Error on updating job')
    }
  }

  async getRoles(): Promise<string[] | null> {
    try {
      const jobs = await Job.find({}, { jobRole: 1, _id: 0 });
      const roles = Array.from(new Set(jobs.map((job: any) => job.jobRole).filter(Boolean)));
      return roles;
    } catch (error) {
      console.log('Error on gettign roles')
      throw new Error('Error on getting roles')
    }
  }

  async getTitles(): Promise<string[] | null> {
    try {
      const jobs = await Job.find({}, { jobType: 1, _id: 0 });
      const types = Array.from(new Set(jobs.map((job: any) => job.jobType).filter(Boolean)));
      return types;
    } catch (error) {
      console.log('Error on gettign titles')
      throw new Error('Error on getting titles')
    }
  }
}