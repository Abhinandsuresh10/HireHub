import mongoose , { Schema, Document } from 'mongoose'

export interface IJobRoles extends Document {
    category: string;
    jobRole?: [string];
    createdAt: Date;
    updatedAt: Date;
}

const JobRolesCategorySchema = new Schema<IJobRoles>({
     category: {
        type: String,
        required: true
     },
     jobRole: {
        type: [String],
     }
},{ timestamps: true }); 

export default mongoose.model<IJobRoles>('JobRoles', JobRolesCategorySchema);