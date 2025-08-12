import Spam, { ISpam } from "../../models/SpamMessageSchema";
import User, { Iuser } from '../../models/UserSchema'
import Recruiter, { IRecruiter } from '../../models/RecruiterSchema'
import { ISpamRepository } from "../interface/IspamRepository";
import { BaseRepository } from "./baseRepository";
import { SpamReport } from "../../types/Spam.types";
import Job from "../../models/JobSchema";



export class spamRepository extends BaseRepository<ISpam> implements ISpamRepository {
    constructor() {
        super(Spam)
    }

    async createSpam(data: ISpam): Promise<void> {
        try {
          console.log('data is here : ', data);
          const job = await Job.findById(data.jobId);
          console.log('job is here : ', job)
          if(job?.blockCount && job?.blockCount < 2) {
            console.log('job?.blockedCount is here : ', job.blockCount)
               job.blockCount++;
               console.log('job?.blockedCount is increased : ', job.blockCount)
               await job.save();
           } else if (job?.blockCount && job?.blockCount > 1) {
               job.isBlocked = true;
               await job.save()
           }
          await this.create(data);
        } catch (error) {
          console.log(error);
          throw new Error('Error on creating spam') 
        }
    }

    async getSpams(page: number, limit: number): Promise<{reports: SpamReport[]; total: number}> {
        try {

          const total = await Spam.countDocuments();

          const spamReports = await Spam.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();

          
          const userIds = spamReports.filter(r => r.role === 'user').map(r => r.refId);
          const recruiterIds = spamReports.filter(r => r.role === 'recruiter').map(r => r.refId);
        
         
          const users = await User.find({ _id: { $in: userIds } }, 'name email').lean();
          const recruiters = await Recruiter.find({ _id: { $in: recruiterIds } }, 'name email').lean();
        
          const userMap = new Map(users.map(u => [u._id.toString(), u]));
          const recruiterMap = new Map(recruiters.map(r => [r._id.toString(), r]));
        
          
          const enrichedReports = spamReports.map(report => {
            const info =
              report.role === 'user'
                ? userMap.get(report.refId)
                : recruiterMap.get(report.refId);
        
            return {
              name: info?.name || 'Unknown',
              email: info?.email || 'Unknown',
              jobId: report.jobId,
              refId: report.refId,
              reason: report.reason,
              additionalDetails: report.additionalDetails,
              description: report.description,
              createdAt: report.createdAt,
              role: report.role
            };
          });
          return { reports: enrichedReports, total};
        } catch (error) {
          console.log(error);
          throw new Error('Error on getting spam') 
        }
    }

     async getSpamUser(id: string): Promise<Iuser | null> {
        try {
          return await User.findById(id)
        } catch (error) {
          throw new Error("Error on getting user")
        }
    }

    async getSpamRecruiter(id: string): Promise<IRecruiter | null> {
        try {
          return await Recruiter.findById(id);
        } catch (error) {
          throw new Error("Error on getting recruiter")
        }
    }
}