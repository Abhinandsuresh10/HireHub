import  Application, { IApplication } from "../../models/ApplicatinSchema";
import { BaseRepository } from "./baseRepository";
import { IapplicationRepository } from "../interface/IapplicationRepository";
import mongoose from "mongoose";


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

       async getAppliedJobs(userId: string, page: number, limit: number): Promise<{ data: any[]; total: number }> {
        try {
          const skip = (page - 1) * limit;
      
          const aggregation = [
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      
            {
              $lookup: {
                from: 'jobs',
                localField: 'jobId',
                foreignField: '_id',
                as: 'jobDetails'
              }
            },
            { $unwind: '$jobDetails' },
      
            {
              $project: {
                _id: 0,
                jobId: 1,
                status: 1,
                appliedDate: '$appliedAt',
                title: '$jobDetails.jobRole',
                company: '$jobDetails.company',
                location: '$jobDetails.jobLocation',
                type: '$jobDetails.jobType',
                salary: {
                  $concat: [
                    { $toString: '$jobDetails.minSalary' },
                    ' - ',
                    { $toString: '$jobDetails.maxSalary' },
                    ' LPA'
                  ]
                }
              }
            },
      
            { $skip: skip },
            { $limit: limit }
          ];
      
          const data = await Application.aggregate(aggregation);
          const total = await Application.countDocuments({ userId });
      
          return { data, total };
      
        } catch (error) {
          console.error(error);
          throw new Error('Error on getting applied jobs');
        }
      }

      

      async getAllApplicants(id: string, page: number, limit: number): Promise<{ data: any[]; total: number; }> {
        try {
          const skip = (page - 1) * limit;
          const aggregation = [
            { $match: { recruiterId: new mongoose.Types.ObjectId(id) } },
            {
              $lookup: {
                from: "users", 
                localField: "userId",
                foreignField: "_id",
                as: "userDetails",
              },
            },
            { $unwind: "$userDetails" }, 
            {
              $lookup: {
                from: "jobs", 
                localField: "jobId",
                foreignField: "_id",
                as: "jobDetails",
              },
            },
            { $unwind: "$jobDetails" }, 
      
            {
              $project: {
                _id: 0, 
                id: "$_id",
                userId: "$userDetails._id",
                name: "$userDetails.name",
                email: "$userDetails.email",
                job: "$jobDetails.jobRole",
                appliedAt: "$appliedAt",
                status: "$status",
              },
            },
      
            { $skip: skip },
            { $limit: limit },
          ];
      
            const recruiterId = id;
            const data = await Application.aggregate(aggregation)
            const total = await Application.countDocuments({ recruiterId })
          return { data, total };
      
        } catch (error) {
          console.error("Error in getAllApplicants (aggregation):", error);
          throw new Error("Failed to fetch applicants");
        }
    }

    async findApplicationById(id: string): Promise<IApplication | null> {
        try {
          return await Application.findById({_id: id});
        } catch (error) {
          console.error("Error in findApplicationById:", error);
          throw new Error("Failed to fetch applicant");
        }
    }

    async findIdAndUpdate(id: string): Promise<IApplication | null> {
        try {
          return await Application.findByIdAndUpdate(id, {status: 'ShortListed'})
          
        } catch (error) {
          console.error("Error in findApplicationById:", error);
          throw new Error("Failed to fetch applicant");
        }
    }
}