import { UpdateQuery } from "mongoose";
import Admin, { Iadmin } from "../../models/AdminSchema";
import Recruiter, { IRecruiter } from "../../models/RecruiterSchema";
import User, { Iuser } from "../../models/UserSchema";
import { IadminRepositoryInterface } from "../interface/IadminRepositoryInterface";
import { BaseRepository } from "./baseRepository";
import { IDashobardStats } from "../../types/dashboard.types";
import Job from "../../models/JobSchema";
import Application from '../../models/ApplicatinSchema';
import Interview from '../../models/InterviewSchema'

export class adminRepository extends BaseRepository<Iadmin> implements IadminRepositoryInterface{

   private userRepository: BaseRepository<Iuser>
   private recruiterRepository: BaseRepository<IRecruiter>;

     constructor() {
        super(Admin);
        this.userRepository = new BaseRepository<Iuser>(User);
        this.recruiterRepository = new BaseRepository<IRecruiter>(Recruiter);
     }

     async createAdmin(adminData: Iadmin): Promise<Iadmin> {
        try {
          return await this.create(adminData);
        } catch (error) {
          console.error("Error creating user", error);
          throw new Error("Error creating user");
        }
     }

     async findByEmail(email: string): Promise<Iadmin | null> {
        try {
            return await this.findOne({email});
        } catch (error) {
            console.error("Error finding user", error);
            throw new Error("Error finding user");
        }
     }

     async findAllUsers(page: number, limit: number, search: string): Promise<{users:Iuser[]; total: number}> {
      try {
         const { data , total } =  await this.userRepository.findAll(page, limit, search);
         const users = data;
         return { users , total }
      } catch (error) {
          console.log('Error finding users', error);
          throw new Error('Error finding users')
      }
     }

     async findAllRecruiters(page: number, limit: number, search: string): Promise<{recruiters:IRecruiter[]; total:number}> {
      try {
         const { data , total} = await this.recruiterRepository.findAll(page, limit, search);
         const recruiters = data;
         return { recruiters, total};
      } catch (error) {
         console.log('Error finding recruiters', error);
         throw new Error('Error finding recruiters');
      }
     }

     async findById(id: string): Promise<Iuser | null> {
         try {
            return await this.userRepository.findOne({_id: id})
         } catch (error) {
            console.log('Error finding users', error);
            throw new Error('Error finding users')
         }
     }

     async findRecruiterById(id: string): Promise<IRecruiter | null> {
      try {
         return await this.recruiterRepository.findOne({_id: id})
      } catch (error) {
         console.log('Error finding recruiter', error);
         throw new Error('Error finding recruiter')
      }
  }

     async updateUser(id: string, updateData: UpdateQuery<Iuser>): Promise<Iuser | null> {
      try {
        return await this.userRepository.update(id, updateData);
      } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Error updating user");
      }
    }

    async updateRecruiter(id: string, updateData: UpdateQuery<IRecruiter>): Promise<IRecruiter | null> {
      try {
        return await this.recruiterRepository.update(id, updateData);
      } catch (error) {
        console.error("Error updating recruiter:", error);
        throw new Error("Error updating recruiter");
      }
    }

    async userBlockUnblock(id: string, status: boolean): Promise<Iuser | null> {
      try {
        const user = await this.findById(id);
        if (!user) {
          throw new Error("User not found");
        }
        user.isBlocked = !status;
        return await this.updateUser(id, user);
        
      } catch (error) {
        console.error(`Error in userBlockUnblock (id: ${id}, status: ${status}):`, error);
        throw new Error(`Failed to block/unblock user: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    async recruiterBlockUnblock(id: string, status: boolean): Promise<IRecruiter | null> {
        try {
         const recruiter = await this.findRecruiterById(id);
         console.log(recruiter);
        if (!recruiter) {
          throw new Error("Recruiter not found");
        }
        recruiter.isBlocked = !status;
        return await this.updateRecruiter(id, recruiter);

        } catch (error) {
         console.error(`Error in recruiterBlockUnblock (id: ${id}, status: ${status}):`, error);
        throw new Error(`Failed to block/unblock recruiter: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

     async getDashboardStats(): Promise<IDashobardStats | null> {
        try {
          const stats:IDashobardStats = {
            users: 0,
            recruiters: 0,
            jobs: 0,
            applications: 0,
            interviews: 0,
            listing: 0
          };
          stats.users = await User.countDocuments()
          stats.recruiters = await Recruiter.countDocuments();
          stats.jobs = await Job.countDocuments();
          stats.listing = await Job.find({deadline: { $gte: new Date() }}).countDocuments();
          stats.applications = await Application.countDocuments(); 
          stats.interviews = await Interview.countDocuments();
          return stats;
        } catch (error) {
          console.error("Error on getting dashboard");
          throw new Error(`Failed to get dashboard stats : ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async getDashboardBars(): Promise<{ applications: number[]; interviews: number[]; }> {
        try {
          const now = new Date();
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - 6); 
          const endOfWeek = new Date(now);

        const [applicationsByDay, interviewsByDay] = await Promise.all([
            Application.aggregate([
                { $match: { appliedAt: { $gte: startOfWeek, $lte: endOfWeek } }},
                { $group: { _id: { $dayOfWeek: "$appliedAt" }, count: { $sum: 1 }}},
                { $sort: { "_id": 1 } }
            ]),
            Interview.aggregate([
                { $match: { date: { $gte: startOfWeek, $lte: endOfWeek } }},
                { $group: { _id: { $dayOfWeek: "$date" }, count: { $sum: 1 }}},
                { $sort: { "_id": 1 } }
            ])
        ]);

        const applications = Array(7).fill(0);
        const interviews = Array(7).fill(0);
        applicationsByDay.forEach(day => applications[(day._id - 1) % 7] = day.count);
        interviewsByDay.forEach(day => interviews[(day._id - 1) % 7] = day.count);
        return { applications, interviews };
        } catch (error) {
          console.error("Error on getting dashboard");
          throw new Error(`Failed to get dashboard bars : ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async getDashboardLineData(): Promise<{ lineData: number[] }> {
        try {
           const now = new Date();
           const weeklyCounts: number[] = [];
           const endOfCurrentWeek = new Date(now);
           endOfCurrentWeek.setDate(now.getDate() + (7 - now.getDay()));
           endOfCurrentWeek.setHours(23, 59, 59, 999);
           for (let i = 0; i < 4; i++) {
            const endOfWeek = new Date(endOfCurrentWeek);
            endOfWeek.setDate(endOfCurrentWeek.getDate() - (i * 7));
            const startOfWeek = new Date(endOfWeek);
            startOfWeek.setDate(endOfWeek.getDate() - 6);
            startOfWeek.setHours(0, 0, 0, 0);
            const count = await Job.countDocuments({ createdAt: { $gte: startOfWeek, $lte: endOfWeek } });
            weeklyCounts.unshift(count);
        }
        return { lineData: weeklyCounts };
        } catch (error) {
          console.error("Error on getting dashboard");
          throw new Error(`Failed to get dashboard lineData : ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}