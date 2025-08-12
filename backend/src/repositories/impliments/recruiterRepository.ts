import mongoose from "mongoose";
import Job, { IJob } from "../../models/JobSchema";
import Recruiter, { IRecruiter } from "../../models/RecruiterSchema";
import User, { Iuser } from "../../models/UserSchema";
import { IrecruiterRepositoryInterface } from "../interface/IrecruiterRepository";
import { BaseRepository } from "./baseRepository";
import Application from "../../models/ApplicatinSchema";
import Interview from "../../models/InterviewSchema";
import { IRecruiterDashboardGraphData, IRecruiterDashboardUser } from "../../types/dashboard.types";
import moment from "moment";

export class recruiterRepository extends BaseRepository<IRecruiter> implements IrecruiterRepositoryInterface {
  constructor() {
    super(Recruiter);
  }

  async createRecruiter(recruiterData: IRecruiter): Promise<IRecruiter> {
    try {
      return await this.create(recruiterData);
    } catch (error) {
      console.error("Error creating recruiter", error);
      throw new Error("Error creating recruiter");
    }
  }

  async findByEmail(email: string): Promise<IRecruiter | null> {
    try {
      return await this.findOne({ email });
    } catch (error) {
      console.log('Error on finding email', error);
      throw new Error('Error finding email');
    }
  }

  async updateRecruiter(id: string, recruiterData: IRecruiter): Promise<IRecruiter | null> {
    try {
      return await this.update(id, recruiterData);
    } catch (error) {
      console.log('Error on updating recruiter', error);
      throw new Error('Error on updating recruiter');
    }
  }

  async findUserById(recruiterId: string): Promise<IRecruiter | null> {
    try {
      return await this.findByIds(recruiterId)
    } catch (error: any) {
      console.log(error.message);
      throw new Error('Error on getting recruiter');
    }
  }

  async findUserDataById(userId: string): Promise<Iuser | null> {
    try {
      return await User.findById({ _id: userId });
    } catch (error: any) {
      console.log(error.message);
      throw new Error('Error on getting user');
    }
  }

  async getUserWithDetails(userId: string): Promise<{} | null> {
    try {
      const result = await User.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(userId) }
        },
        {
          $lookup: {
            from: "educations",
            localField: "_id",
            foreignField: "userId",
            as: "education"
          }
        },
        {
          $lookup: {
            from: "experiences",
            localField: "_id",
            foreignField: "userId",
            as: "experience"
          }
        },
        {
          $project: {
            name: 1,
            email: 1,
            mobile: 1,
            jobTitle: 1,
            location: 1,
            imageUrl: 1,
            skills: 1,
            resumeUrl: 1,
            status: { $literal: "Pending" },
            education: {
              $arrayElemAt: [
                {
                  $map: {
                    input: "$education",
                    as: "edu",
                    in: {
                      level: "$$edu.education",
                      institution: "$$edu.institute",
                      graduationYear: {
                        $year: "$$edu.graduateDate"
                      }
                    }
                  }
                },
                0
              ]
            },
            experience: {
              $map: {
                input: "$experience",
                as: "exp",
                in: {
                  title: "$$exp.jobTitle",
                  company: "$$exp.company",
                  duration: {
                    $concat: [
                      { $dateToString: { format: "%b %Y", date: "$$exp.startDate" } },
                      " - ",
                      { $dateToString: { format: "%b %Y", date: "$$exp.endDate" } }
                    ]
                  },
                  achievements: "$$exp.achievements"
                }
              }
            }
          }
        }
      ]);

      return result[0] || null;
    } catch (error) {
      console.error(error);
      throw new Error('Error getting user details');
    }
  }

  async getDashboardMatrics(recruiterId: string): Promise<number[]> {
    try {
      const applicants = await Application.find({ recruiterId: recruiterId }).countDocuments();
      const jobs = await Job.find({ recruiterId: recruiterId, deadline: { $gte: new Date() } }).countDocuments();
      const shedule_interview = await Interview.find({ recruiterId: recruiterId, status: 'pending' }).countDocuments();
      const completed_interview = await Interview.find({ recruiterId: recruiterId, status: 'completed' }).countDocuments();
      // matrics data - getting...♪♪♪...
      const matrics: number[] = [applicants, jobs, shedule_interview, completed_interview];
      return matrics;
    } catch (error) {
      console.error(error);
      throw new Error('Error getting dashboard details');
    }
  }

  async getDashboardCompletedInterviews(recruiterId: string): Promise<IRecruiterDashboardUser[] | null> {
    try {
      const completedInterviews = await Interview.aggregate([
        {
          $match: {
            recruiterId: new mongoose.Types.ObjectId(recruiterId),
            status: "completed"
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userDetails'
          }
        },
        {
          $unwind: '$userDetails'
        },
        {
          $project: {
            name: '$userDetails.name',
            imageUrl: '$userDetails.imageUrl',
            jobRole: '$jobRole',
            date: '$date'
          }
        },
        {
          $sort: {
            date: -1
          }
        },
        {
          $limit: 3
        }
      ]);

      return completedInterviews;
    } catch (error) {
      console.error(error);
      throw new Error('Error getting dashboard details');
    }
  }

  async getDashboardGraphData(recruiterId: string): Promise<IRecruiterDashboardGraphData[] | null> {
    try {
      const months = [];

      for (let i = 4; i >= 0; i--) {
        const start = moment().subtract(i, 'months').startOf("month").toDate();
        const end = moment().subtract(i, 'months').endOf("month").toDate();
        const monthName = moment(start).format("MMM");

        const applicantCounts = await Application.countDocuments({
          recruiterId,
          appliedAt: { $gte: start, $lte: end }
        });

        const interviewCounts = await Interview.countDocuments({
          recruiterId,
          date: { $gte: start, $lte: end }
        });

        months.push({
          name: monthName,
          applicants: applicantCounts,
          interviews: interviewCounts
        })
      }
      return months;
    } catch (error) {
      console.error(error);
      throw new Error('Error getting dashboard details');
    }
  }

  async completePurchase(id: string, paymentId: string, price: number): Promise<IRecruiter | null> {
    try {
      const now = new Date();
      let expiresAt: Date;

      if (price === 149) {
        expiresAt = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
      } else if (price === 249) {
        expiresAt = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
      } else if (price === 349) {
        expiresAt = new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000);
      } else {
        expiresAt = new Date(now);
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }

      return await Recruiter.findByIdAndUpdate(id, {
        premium: {
          planId: paymentId,
          startsAt: now,
          expiresAt: expiresAt
        }
      }, { new: true });
    } catch (error: any) {
      console.log(error.message);
      throw new Error('Error on updating user');
    }
  }

  async findAllRecruiter(company: string, industry: string, page: number, limit: number): Promise<{ recruiters: IRecruiter[] | null; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const filter: any = {}

      if (company && company !== 'undefined') {
        filter.company = { $regex: company, $options: 'i' };
      }

      if (industry && industry !== 'undefined') {
        filter.industry = { $regex: industry, $options: 'i' };
      }

      const recruiters = await Recruiter.find(filter).skip(skip).limit(limit).sort({ 'premium': -1 });
      const total = await Recruiter.countDocuments(filter);

      return { recruiters, total }

    } catch (error: any) {
      console.log(error.message);
      throw new Error('Error on getting recruiters');
    }
  }

  async findRecruiterById(id: string): Promise<IRecruiter | null> {
    try {
      const recruiter = await Recruiter.findById(id);
      return recruiter;
    } catch (error: any) {
      console.log(error.message);
      throw new Error('Error on getting recruiters');
    }
  }
}