import mongoose, { Document, Schema } from "mongoose";



export interface IInterview extends Document{
     applicationId?: mongoose.Types.ObjectId;
     jobId?: mongoose.Types.ObjectId;
     userId?: mongoose.Types.ObjectId;
     recruiterId?: mongoose.Types.ObjectId;
     jobRole: string;
     interviewer: string;
     date: Date;
     time: string;
}

const interviewSchema = new Schema<IInterview>({
      applicationId: { 
        type: Schema.Types.ObjectId, ref: "Application",
        required: true 
      },
      jobId: {
        type: Schema.Types.ObjectId, ref: "Job",
        required: true
      },
      userId: {
        type: Schema.Types.ObjectId, ref: "User",
        required: true
      },
      recruiterId: {
        type: Schema.Types.ObjectId, ref: "Recruiter",
        required: true
      },
      jobRole: {
        type: String,
        required: true
      },
      interviewer: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        required: true
      },
      time: {
        type: String,
        required: true
      }
});

export default mongoose.model<IInterview>('Interview', interviewSchema);