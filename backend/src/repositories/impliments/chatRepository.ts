import mongoose from "mongoose";
import Message, { IMessage } from "../../models/MessageSchema";
import User from '../../models/UserSchema'
import { UserWithMessages } from "../../types/chat.types";
import { IchatRepository } from "../interface/IchatRepository";
import { BaseRepository } from "./baseRepository";



export class chatRepository extends BaseRepository<IMessage> implements IchatRepository {
      constructor() {
        super(Message)
      }
    async getUsersAndChats(recruiterId: string): Promise<UserWithMessages[] | null> {
       try {
        const recruiterObjectId = new mongoose.Types.ObjectId(recruiterId);

        const users = await User.aggregate([
          {
            $lookup: {
              from: "applications",
              let: { userId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$userId", "$$userId"] },
                        { $eq: ["$recruiterId", recruiterObjectId] }
                      ]
                    }
                  }
                }
              ],
              as: "matchedApplications"
            }
          },
          {
            $match: {
              matchedApplications: { $ne: [] } 
            }
          },
          {
            $lookup: {
              from: "messages",
              let: { userId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $or: [
                        { $eq: [{ $toObjectId :"$senderId"}, "$$userId"] },
                        { $eq: [{ $toObjectId :"$receiverId"}, "$$userId"] }
                      ]
                    }
                  }
                },
                {
                  $project: {
                    _id: 1,
                    senderId: 1,
                    receiverId: 1,
                    content: {
                      $cond: [
                        { $ifNull: ["$message", false] }, 
                        { message: "$message" },        
                        { file: "$file" }                
                      ]
                    },
                    sentAt: 1
                  }
                }
              ],
              as: "messages"
            }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              messages: 1
            }
          }
        ]);
        return users as UserWithMessages[];
       } catch (error) {
        console.log(error);
        throw new Error('Error on getting users with chat')
       }
   }

   async getRecruitersAndChats(userId: string): Promise<UserWithMessages[] | null> {
       try {
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const recruiters = await Message.aggregate([
          {
            $match: {
              $or: [
                { receiverId: userId },
                { senderId: userId }
              ]
            }
          },
          {
            $lookup: {
              from: "recruiters",
              let: { recruiterId: { $cond: [{ $eq: ["$senderId", userId] }, "$receiverId", "$senderId"] } },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$_id", { $toObjectId: "$$recruiterId" }]
                    }
                  }
                },
                {
                  $project: {
                    _id: 1,
                    name: 1,
                    email: 1
                  }
                }
              ],
              as: "recruiterDetails"
            }
          },
          {
            $unwind: "$recruiterDetails"
          },
          {
            $group: {
              _id: "$recruiterDetails._id",
              name: { $first: "$recruiterDetails.name" },
              email: { $first: "$recruiterDetails.email" },
              messages: {
                $push: {
                  _id: "$_id",
                  senderId: "$senderId",
                  receiverId: "$receiverId",
                  content: {
                    $cond: [
                      { $ifNull: ["$message", false] }, 
                      { message: "$message" },         
                      { file: "$file" }                
                    ]
                  },
                  sentAt: "$sentAt"
                }
              }
            }
          },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              messages: 1
            }
          }
        ]);
    
        
        return recruiters as UserWithMessages[];
       } catch (error) {
        console.log(error);
        throw new Error('Error on getting recruiters with chat');
       }
   }
}