import mongoose, { Document, Schema } from "mongoose";



export interface IInterview extends Document{
     applicationId?: mongoose.Types.ObjectId;
     jobId?: mongoose.Types.ObjectId;
     userId?: mongoose.Types.ObjectId;
     recruiterId?: mongoose.Types.ObjectId;
     jobRole: string;
     interviewer: string;
     interviewType: string;
     date: Date;
     status: string;
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
      interviewType: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        required: true
      },
      status: {
        type: String,
        required: true,
        default: 'pending'
      },
      time: {
        type: String,
        required: true
      }
});

export default mongoose.model<IInterview>('Interview', interviewSchema);