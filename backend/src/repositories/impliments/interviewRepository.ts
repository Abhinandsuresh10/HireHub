import Interview, { IInterview } from "../../models/InterviewSchema";
import Application from '../../models/ApplicatinSchema'
import { InterviewType } from "../../types/interview.types";
import { IInterviewRepository } from "../interface/IinterviewRepository";
import { BaseRepository } from "./baseRepository";
import mongoose, { PipelineStage } from "mongoose";



export class interviewRepository extends BaseRepository<IInterview> implements IInterviewRepository {
    constructor() {
        super(Interview)
    }

    async createInterview(data: InterviewType, applicationId: string): Promise<void> {
        try {
          data.applicationId = applicationId;
          await Application.findByIdAndUpdate(applicationId, {status: 'Intreview Sheduled'})
          await this.create(data as IInterview);
          return;   
        } catch (error) {
           console.log('error on creating interview') 
           throw new Error("Error creating interview");
        }
    }

    async getInterviews(recruiterId: string, page: number, limit: number): Promise<{ data: IInterview[]; total: number; }> {
        try {
          const skip = (page - 1) * limit;
          const pipeline: PipelineStage[] = [
            { $match: { recruiterId: new mongoose.Types.ObjectId(recruiterId)} },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    _id: 1,
                    username: '$user.name',
                    jobRole: 1,
                    date: 1,
                    time: 1,
                    interviewer: 1
                }
            },
            { $sort: { date: -1 }},
            { $skip: skip },
            { $limit: limit}
          ];
          const data = await Interview.aggregate(pipeline);
          
          const total = await Interview.countDocuments({ recruiterId: new mongoose.Types.ObjectId(recruiterId)});
          return { data, total};
        } catch (error) {
          console.log('error on getting interview')
          throw new Error('Error on getting interviews')
        }
    }

    async getUsersInterviews(userId: string, page: number, limit: number): Promise<{ data: IInterview[]; total: number; }> {
        try {
          const skip = (page - 1) * limit;
          const pipeline: PipelineStage[] = [
            { $match: {userId: new mongoose.Types.ObjectId(userId)} },
            { 
              $lookup: {
                from: 'jobs',
                localField: 'jobId',
                foreignField: '_id',
                as: 'job'
              }
             },
             { $unwind: '$job' },
             {
              $lookup: {
                from: 'applications',
                localField: 'applicationId',
                foreignField: '_id',
                as: 'application'
              }
             },
             { $unwind: '$application' },
             {
              $project: {
                jobId: '$job._id',
                title: '$jobRole',
                company: '$job.company',
                location: '$job.jobLocation',
                salary: {
                  $concat: [
                    { $toString: '$job.minSalary'},
                    ' - ',
                    { $toString: '$job.maxSalary'}
                  ]
                },
                status: '$application.status',
                interviewDate: '$date',
                interviewTime: '$time',
                type: '$job.jobType'
               }
             },
             { $sort: { interviewDate: -1 } },
             { $skip: skip },
             { $limit: limit }
          ];

          const data = await Interview.aggregate(pipeline);
          const total = await Interview.countDocuments({userId: new mongoose.Types.ObjectId(userId)});

          return { data, total }
        } catch (error) {
          console.log('error on getting interview')
          throw new Error('Error on getting interviews')
        }
    }

    async getInterviewById(id: string): Promise<IInterview | null> {
        try {
          const interview = await Interview.findById(id);
          return interview;
        } catch (error) {
          console.log('error getting interview');
          throw new Error('Error on getting interview')
        }
    }

}