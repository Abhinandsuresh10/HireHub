import Application, { IApplication } from "../../models/ApplicatinSchema";
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


  async checkIsApplied(userId: string, jobId: string): Promise<string> {
    try {
      const application = await Application.findOne({ userId, jobId }).select('status');

      if (!application) return 'Not Applied';
      return application.status;
    } catch (error) {
      console.log(error);
      throw new Error('Error on getting isApplied')
    }
  }

  // getting the all applied jobs in the user side in the my jobs appliedjobs ....
  // this function is full of problems need to fix ... also in the frontend ...

  async getAppliedJobs(userId: string, page: number, limit: number): Promise<{ data: any[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const aggregation = [
        { $match: { userId: new mongoose.Types.ObjectId(userId), status: { $ne: 'Intreview Sheduled' } } },

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
      const total = await Application.countDocuments({
        userId,
        status: { $ne: 'Intreview Sheduled' }
      });


      return { data, total };

    } catch (error) {
      console.error(error);
      throw new Error('Error on getting applied jobs');
    }
  }



  async getAllApplicants(id: string, page: number, limit: number): Promise<{ data: any[]; total: number; }> {
    try {
      const skip = (page - 1) * limit;
      const aggregation: mongoose.PipelineStage[] = [
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
            jobId: "$jobDetails._id",
            userId: "$userDetails._id",
            name: "$userDetails.name",
            email: "$userDetails.email",
            job: "$jobDetails.jobRole",
            appliedAt: "$appliedAt",
            status: "$status",
          },
        },
        { $sort: { appliedAt: -1 } },
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
      return await Application.findById({ _id: id });
    } catch (error) {
      console.error("Error in findApplicationById:", error);
      throw new Error("Failed to fetch applicant");
    }
  }

  async findIdAndUpdate(id: string, status: string): Promise<IApplication | null> {
    try {
      return await Application.findByIdAndUpdate(id, { status: status, round: 1 })

    } catch (error) {
      console.error("Error in findApplicationById:", error);
      throw new Error("Failed to fetch applicant");
    }
  }

  async getAppliedApplication(userId: string, jobId: string): Promise<IApplication | null> {
    try {
      return await Application.findOne({ userId, jobId });
    } catch (error) {
      console.error("Error in findApplicationById:", error);
      throw new Error("Failed to fetch applicant");
    }
  }

  async hireInterviewe(id: string): Promise<void>  {
    try {
      await Application.findByIdAndUpdate(id, { status: 'Hired'} )
    } catch (error) {
      console.error("Error in findApplicationById:", error);
      throw new Error("Failed to fetch applicant");
    }
  }
}