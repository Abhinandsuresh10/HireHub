import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
    userId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
    recruiterId: mongoose.Types.ObjectId;
    status: "Pending" | "Shortlisted" | "Rejected" | "Hired";
    appliedAt?: Date;
}

const ApplicationSchema = new Schema<IApplication>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
        jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
        recruiterId: { type: Schema.Types.ObjectId, ref: "Recruiter", required: true },
        status: { type: String, enum: ["Pending", "Shortlisted", "Rejected", "Hired"], default: "Pending" }
    },
    { timestamps: { createdAt: "appliedAt", updatedAt: false } } 
);

export default mongoose.model<IApplication>("Application", ApplicationSchema);
