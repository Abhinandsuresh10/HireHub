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
    premiumId?:string;
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
        premiumId: { type: String },
    },
    { timestamps: true}
);

export default mongoose.model<IRecruiter>("Recruiter", RecruiterSchema);