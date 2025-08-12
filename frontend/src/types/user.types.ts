// user details...
export interface Iuser {
    _id: string;
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
        expiresAt: Date
    };
    preferredJobTypes?: string[];
    preferredJobRoles?: string[];
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
    _id: string;
    name: string;
    email: string;
    mobile: string;
    role: string;
    location: string;
    imageUrl: string;
    skills: string[];
    resumeUrl?: string;
    coverLetter?: string;
    education?: EducationData;
    experience?: ExperienceData[];
  }