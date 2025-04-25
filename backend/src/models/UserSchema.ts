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
    premiumId?:string;
    resumeUrl?:string;
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
        premiumId: { type: String },
        resumeUrl: { type: String },
    },
    { timestamps: true}
);

export default mongoose.model<Iuser>("User", UserSchema);