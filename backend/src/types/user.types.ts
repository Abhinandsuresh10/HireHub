import { Types } from "mongoose";

export interface UserProfileDetials {
    _id?: string | Types.ObjectId;
    name:string;
    mobile?:string;
    email:string;
    isBlocked:boolean;
    imageUrl?:string;
    location?:string;
    jobTitle?:string;
    skills?:string[];
    premium?: { 
        planId: string,
        startsAt: Date,
        expiresAt: Date
    };
    preferredJobRoles?: string[];
    preferredJobTypes?: string[];
    resumeUrl?:string;
    coverLetter?:string;
    createdAt?:Date;
    updatedAt?:Date;
}

// for viewing full user Details...
interface EducationData {
    education: string;
    institute: string;
    graduateDate: Date;
  }
  
  interface ExperienceData {
    title: string;
    company: string;
    jobTitle: string;
    duration: string;
    achievements: string;
  }
  
  export interface IuserProfile {
    _id?: string | Types.ObjectId;
    name: string;
    email: string;
    mobile: string;
    location: string;
    imageUrl: string;
    skills: string[];
    resumeUrl?: string;
    coverLetter?: string;
    education?: EducationData;
    experience?: ExperienceData[];
  }


  export interface UserLoginDetials {
    _id?: string | Types.ObjectId;
    name:string;
    mobile?:string;
    email:string;
    role: string;
    isBlocked:boolean;
    imageUrl?:string;
    location?:string;
    jobTitle?:string;
    skills?:string[];
    premium?: { 
        planId: string,
        startsAt: Date,
        expiresAt: Date
    };
    viewedJobs?: {
        date: Date;
        count: number
    };
    viewedRecruiters?: {
        date: Date;
        count: number;
    }
    preferredJobRoles?: string[];
    preferredJobTypes?: string[];
    resumeUrl?:string;
    coverLetter?:string;
    createdAt?:Date;
    updatedAt?:Date;
}