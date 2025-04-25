import mongoose, { Schema , Document } from "mongoose";


export interface IEducation extends Document {
    userId: mongoose.Types.ObjectId;
    education: string;
    institute: string;
    graduateDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const EducationSchema = new Schema<IEducation> ({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    education: {
        type: String,
        required: true
    },
    institute: {
        type: String,
        required: true
    },
    graduateDate: {
        type: Date,
        required: true
    }
},
{timestamps: true}
);

export default mongoose.model<IEducation>('Education', EducationSchema);