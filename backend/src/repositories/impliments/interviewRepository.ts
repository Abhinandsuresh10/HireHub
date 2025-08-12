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

  async existInterview(time: string, date: Date): Promise<IInterview | null> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const exists = await Interview.findOne({
        time: time,
        date: { $gte: startOfDay, $lt: endOfDay }
      });

      return exists;
    } catch (error) {
      throw new Error("error or getting interview")
    }
  }

  async createInterview(data: InterviewType, applicationId: string): Promise<void> {
    try {
      data.applicationId = applicationId;

      const application = await Application.findById(applicationId);
      console.log(application, ' : this is the application', application?.round);

      const update: any = {
        status: 'Intreview Sheduled',
      };

      if (application?.round === 2) {
        update.round = 3;
      } else {
        update.round = 2;
      }

      await Application.findByIdAndUpdate(applicationId, update);
      await this.create(data as IInterview);
      return;
    } catch (error) {
      console.log('error on creating interview')
      throw new Error("Error creating interview");
    }
  }

  async getInterviews(recruiterId: string, page: number, limit: number, interviewType?: string): Promise<{ data: IInterview[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const matchStage: any = {
        recruiterId: new mongoose.Types.ObjectId(recruiterId),
        status: 'pending'
      };

      if (interviewType && interviewType !== 'all') {
        matchStage.interviewType = interviewType;
      }

      const pipeline: PipelineStage[] = [
        { $match: matchStage },
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
            interviewer: 1,
            interviewType: 1
          }
        },
        { $sort: { date: -1 } },
        { $skip: skip },
        { $limit: limit }
      ];

      const data = await Interview.aggregate(pipeline);

      // Count with same filter
      const total = await Interview.countDocuments(matchStage);

      return { data, total };
    } catch (error) {
      console.log('error on getting interview', error);
      throw new Error('Error on getting interviews');
    }
  }


  async getUsersInterviews(userId: string, page: number, limit: number): Promise<{ data: IInterview[]; total: number; }> {
    try {
      const skip = (page - 1) * limit;
      const pipeline: PipelineStage[] = [
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
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
                { $toString: '$job.minSalary' },
                ' - ',
                { $toString: '$job.maxSalary' }
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
      const total = await Interview.countDocuments({ userId: new mongoose.Types.ObjectId(userId) });

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

  async getCompletedInterviews(recruiterId: string, page: number, limit: number): Promise<{ interviews: IInterview[]; total: number }> {
    try {
      const objectId = new mongoose.Types.ObjectId(recruiterId)
      const total = await Interview.countDocuments({ recruiterId: objectId , status: 'completed'})
      const interviews = await Interview.find({ recruiterId: objectId, status: 'completed' }).sort({ date: -1 }).skip((page - 1) * limit).limit(limit);
      return { interviews, total };
    } catch (error) {
      console.log('error getting interviews');
      throw new Error('Error on getting interviews')
    }
  }

  async resheduleInterview(id: string, date: Date, time: string): Promise<void> {
    try {
      await Interview.findByIdAndUpdate(id, { date: date, time: time })
    } catch (error) {
      console.log('error on updating interviews');
      throw new Error('Error on updating interviews')
    }
  }

  async getInterview(id: string): Promise<IInterview | null> {
    try {
      return Interview.findById(id);
    } catch (error) {
      console.log('error getting interviews');
      throw new Error('Error on getting interviews')
    }
  }

}