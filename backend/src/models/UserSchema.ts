import mongoose, { Schema, Document } from "mongoose";

export interface Iuser extends Document {
    name:string;
    mobile?:string;
    email:string;
    password?:string;
    role: string;
    isGoogleAuth:boolean;
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
    viewedJobs: {
        date: Date;
        count: number
    };
    viewedRecruiters: {
        date: Date;
        count: number;
    }
    resumeUrl?:string;
    coverLetter?:string;
    preferredJobRoles?: string[];
    preferredJobTypes?: string[];
    createdAt?:Date;
    updatedAt?:Date;
}

const UserSchema = new Schema<Iuser>(
    {
        name: { type: String, required: true },
        mobile: { type: String, required: false },
        email: { type: String, required: true},
        password: { type: String },
        role: { type: String, enum: ['user', 'recruiter', 'admin'], default: 'user'},
        isGoogleAuth: { type: Boolean, default: false},
        isBlocked: {type: Boolean, default: false},
        imageUrl: { type: String },
        location: { type: String },
        jobTitle: { type: String},
        skills: { type: [String], default: [] },
        premium: {
            planId: { type: String },
            startsAt: { type: Date },
            expiresAt: { type: Date }
        },
        viewedJobs: {
            date: { type: Date },
            count: { type: Number } 
        },
        viewedRecruiters: {
            date: { type: Date },
            count: { type: Number}
        },
        resumeUrl: { type: String },
        coverLetter: { type: String },
        preferredJobRoles: { type: [String], default: [] },
        preferredJobTypes: { type: [String], default: [] }
    },
    { timestamps: true}
);

export default mongoose.model<Iuser>("User", UserSchema);