import mongoose, { Schema, Document } from "mongoose";

export interface IRecruiter extends Document {
    name:string;
    mobile?:string;
    email:string;
    password?:string;
    role: string;
    isGoogleAuth:boolean;
    isBlocked:boolean;
    imageUrl?:string;
    company?:string;
    industry?:string;
    hiringInfo?: string;
    premium?: { 
        planId: string;
        startsAt: Date;
        expiresAt: Date;
    };
    addedJobs: {
        date: Date;
        count: number;
    };
    viewUserProfile: {
        date: Date;
        count: number;
    }
    createdAt?:Date;
    updatedAt?:Date;
}

const RecruiterSchema = new Schema<IRecruiter>(
    {
        name: { type: String, required: true },
        mobile: { type: String, required: false },
        email: { type: String, required: true},
        password: { type: String },
        role: { type: String, enum: ['user', 'recruiter', 'admin'], default: 'recruiter'},
        isGoogleAuth: { type: Boolean, default: false},
        isBlocked: {type: Boolean, default: false},
        imageUrl: { type: String },
        company: { type: String, required: false },
        industry: {type: String},
        hiringInfo: { type: String },
        premium: {
            planId: { type: String },
            startsAt: { type: Date },
            expiresAt: { type: Date }
        },
         addedJobs: {
            date: { type: Date },
            count: { type: Number } 
        },
        viewUserProfile: {
            date: { type: Date },
            count: { type: Number }
        }
    },
    { timestamps: true }
);

export default mongoose.model<IRecruiter>("Recruiter", RecruiterSchema);