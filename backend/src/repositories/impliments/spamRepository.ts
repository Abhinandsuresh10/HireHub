import Spam, { ISpam } from "../../models/SpamMessageSchema";
import User from '../../models/UserSchema'
import Recruiter from '../../models/RecruiterSchema'
import { ISpamRepository } from "../interface/IspamRepository";
import { BaseRepository } from "./baseRepository";
import { SpamReport } from "../../types/Spam.types";



export class spamRepository extends BaseRepository<ISpam> implements ISpamRepository {
    constructor() {
        super(Spam)
    }

    async createSpam(data: ISpam): Promise<void> {
        try {
          await this.create(data);
        } catch (error) {
          console.log(error);
          throw new Error('Error on creating spam') 
        }
    }

    async getSpams(): Promise<SpamReport[] | null> {
        try {
          const spamReports = await Spam.find().sort({ createdAt: -1 }).lean();

          
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
              reason: report.reason,
              additionalDetails: report.additionalDetails,
              description: report.description,
              createdAt: report.createdAt,
              role: report.role
            };
          });
          return enrichedReports;
        } catch (error) {
          console.log(error);
          throw new Error('Error on getting spam') 
        }
    }
}