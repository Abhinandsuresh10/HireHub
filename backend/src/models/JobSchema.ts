import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
    recruiterId: mongoose.Types.ObjectId;
    jobRole: string;
    jobType: string;
    jobLocation: string;
    minSalary: number;
    maxSalary: number;
    jobDescription: string;
    responsibilities: string[];
    skills: string[];
    qualification: string;
    deadline: Date;
    company: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const JobSchema = new Schema<IJob>(
    {
        recruiterId: { type: Schema.Types.ObjectId, ref: "Recruiter", required: true }, 
        jobRole: { type: String, required: true },
        jobType: { type: String, required: true },
        jobLocation: { type: String, required: true },
        minSalary: { type: Number, required: true },
        maxSalary: { type: Number, required: true },
        jobDescription: { type: String, required: true },
        responsibilities: { type: [String], default: [] },
        skills: { type: [String], default: [] },
        qualification: { type: String, required: true },
        deadline: { type: Date, required: true },
        company: { type: String, required: true}
    },
    { timestamps: true }
);

export default mongoose.model<IJob>("Job", JobSchema);
