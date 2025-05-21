import mongoose from "mongoose";
import { IJob } from "../../models/JobSchema";
import Recruiter, { IRecruiter} from "../../models/RecruiterSchema";
import User, { Iuser } from "../../models/UserSchema";
import { IrecruiterRepositoryInterface } from "../interface/IrecruiterRepository";
import { BaseRepository } from "./baseRepository";

export class recruiterRepository extends BaseRepository<IRecruiter> implements IrecruiterRepositoryInterface{
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
          return await this.findOne({email});
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
        return await User.findById({_id: userId});
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
}