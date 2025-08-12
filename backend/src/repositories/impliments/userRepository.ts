import User, { Iuser } from "../../models/UserSchema";
import Recruiter from '../../models/RecruiterSchema'
import { IuserRepositoryInterface } from "../interface/IuserRepositoryInterface";
import { BaseRepository } from "./baseRepository";
import { IInterview } from "../../models/InterviewSchema";
import { IRecruiterDashboardUser } from "../../types/dashboard.types";
import { UserProfileDetials } from "../../types/user.types";
import Application from '../../models/ApplicatinSchema'

export class userRepository extends BaseRepository<Iuser> implements IuserRepositoryInterface {
  constructor() {
    super(User);
  }

  async createUser(userData: Iuser): Promise<Iuser> {
    try {
      return await this.create(userData);
    } catch (error) {
      console.error("Error creating user", error);
      throw new Error("Error creating user");
    }
  }

  async findByEmail(email: string): Promise<Iuser | null> {
    try {
      return await this.findOne({ email });
    } catch (error) {
      console.log('Error on finding email', error);
      throw new Error('Error finding email');
    }
  }

  async updateUser(id: string, userData: Iuser): Promise<Iuser | null> {
    try {
      return await this.update(id, userData);
    } catch (error) {
      console.log('Error on updating user', error);
      throw new Error('Error on updating user');
    }
  }

  async findUserById(userId: string): Promise<Iuser | null> {
    try {
      return await this.findByIds(userId)
    } catch (error: any) {
      console.log(error.message);
      throw new Error('Error on updating user');
    }
  }

  async updateSkills(userId: string, skills: []): Promise<Iuser | null> {
    try {

      const updatedUser = await User.findByIdAndUpdate(userId,
        {
          $addToSet: {
            skills: { $each: [...skills] }
          }
        }, { new: true });

      return updatedUser;
    } catch (error: any) {
      console.log(error.message);
      throw new Error('Error on updating user');
    }
  }

  async updatePreferredRoles(userId: string, roles: []): Promise<Iuser | null> {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId,
        {
          $addToSet: {
            preferredJobRoles: { $each: [...roles] }
          }
        }, { new: true });
      return updatedUser;
    } catch (error: any) {
      console.log(error.message);
      throw new Error('Error on updating user');
    }
  }

  async updatePreferredTypes(userId: string, types: []): Promise<Iuser | null> {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId,
        {
          $addToSet: {
            preferredJobTypes: { $each: [...types] }
          }
        }, { new: true });
      return updatedUser;
    } catch (error: any) {
      console.log(error.message);
      throw new Error('Error on updating user');
    }
  }

  async getCompanies(): Promise<string[]> {
    try {
      return await Recruiter.aggregate([
        {
          $group: {
            _id: null, companies: { $addToSet: '$company' }
          }
        },
        {
          $project: {
            _id: 0, companies: 1
          }
        }
      ])
    } catch (error: any) {
      console.log(error.message);
      throw new Error('Error on updating user');
    }
  }

  async completePurchase(id: string, paymentId: string, price: number): Promise<Iuser | null> {
  try {
    const now = new Date();
    let expiresAt: Date;

    if (price === 149) {
      expiresAt = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
    } else if(price === 249 ) {
      expiresAt = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
    } else if (price === 349) {
      expiresAt = new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000);
    } else {
      expiresAt = new Date(now);
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    const user = await User.findByIdAndUpdate(id, {
      premium: {
        planId: paymentId,
        startsAt: now,
        expiresAt: expiresAt
      }
    }, { new: true });

    return user;
  } catch (error: any) {
    console.log(error.message);
    throw new Error('Error on updating user');
  }
}


  async viewedJobs(userId: string): Promise<Iuser | null> {
    try {
      return await User.findById(userId)
    } catch (error: any) {
      console.log(error.message);
      throw new Error('Error on updating viewedJobs');
    }
  }

  async getCompletedUsersInterviewers(interviews: IInterview[]): Promise<IRecruiterDashboardUser[] | null> {
    try {

      const userIds = interviews.map(interview => interview.userId?.toString()).filter((id): id is string => !!id);
      

      const users = await User.find({ _id: { $in: userIds } }).select('_id name imageUrl');

      // Extract applicationIds
      const applicationIds = interviews
        .map(interview => interview.applicationId?.toString())
        .filter((id): id is string => !!id);


      // Fetch applications
      const applications = await Application.find({ _id: { $in: applicationIds } }).select('_id status');

      // Build maps for fast lookup
      interface LeanUser {
        _id: string;
        name: string;
        imageUrl?: string;
      }

      interface LeanApplication {
        _id: string;
        status: string;
      }

      const userMap = new Map((users as LeanUser[]).map(user => [user._id.toString(), user]));
      const applicationMap = new Map((applications as LeanApplication[]).map(app => [app._id.toString(), app.status]));

      console.log(userMap, ' : this is the userMap')

      // Create final mapped response
      const getCompletedInterviews: IRecruiterDashboardUser[] = interviews.map(interview => {
        const user = userMap.get(interview.userId?.toString() || '');
        const applicationStatus = applicationMap.get(interview.applicationId?.toString() || '') || 'Unknown';

        return {
          _id: user?._id || '',
          applicationId: interview.applicationId?.toString() || '',
          name: user?.name || 'Unknown',
          imageUrl: user?.imageUrl || '',
          date: interview.date,
          jobRole: interview.jobRole,
          status: applicationStatus
        };
      });

      return getCompletedInterviews;

    } catch (error: any) {
      console.log(error.message);
      throw new Error('Error on getting usersInterviews');
    }
  }

  async getAllUsers(page: number, limit: number, jobType: string, jobRole: string): Promise<{ users: Iuser[]; total: number }> {
    try {

      const skip = (page - 1) * limit;
      const filter: any = {};


      if (jobType) {
        filter.preferredJobTypes = {
          $in: [new RegExp(jobType, 'i')]
        };
      }

      if (jobRole) {
        filter.preferredJobRoles = {
          $in: [new RegExp(jobRole, 'i')]
        };
      }


      const users = await User.find(filter).skip(skip).limit(limit).sort({ 'premium.planId': -1, createdAt: -1 })

      const total = await User.countDocuments(filter);

      return { users, total };
    } catch (error: any) {
      console.log(error.message);
      throw new Error('Error on getting usersInterviews');
    }
  }
}