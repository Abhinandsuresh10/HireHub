import mongoose, { Schema , Document } from "mongoose";


export interface IExperience extends Document {
    userId: mongoose.Types.ObjectId;
    company: string;
    jobTitle: string;
    startDate: Date;
    endDate: Date;
    achievements: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const ExperienceSchema = new Schema<IExperience> ({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    achievements: {
        type: String,
        required: true
    }
},
{timestamps: true}
);

export default mongoose.model<IExperience>('Experience', ExperienceSchema)