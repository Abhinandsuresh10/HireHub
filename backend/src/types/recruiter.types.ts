import { Types } from "mongoose";

export interface IRecruiterForUser {
    _id?: string | Types.ObjectId;
    name: string;
    email: string;
    imageUrl?: string;
    company: string;
    hiringInfo?: string;
    industry?: string;
    premium?: {
        planId?: string,
        startsAt?: Date;
        date?: Date
    }
}

export interface RecruiterLoginDetails {
  name?: string;
  email?: string;
  role: string;
  isGoogleAuth: boolean;
  isBlocked: boolean;
  imageUrl?: string;
  mobile?: string;
  company?: string;
  industry?: string;
  hiringInfo?: string;
  premium?: {
    planId: string;
    startsAt: Date;
    expiresAt: Date;
  };
  addedJobs?: {
    date: Date;
    count: number;
  };
  viewUserProfile?: {
    date: Date;
    count: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
