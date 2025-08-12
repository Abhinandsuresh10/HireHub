import mongoose, { Schema, Document } from 'mongoose'


export interface IFeedback extends Document {
    id: string;
    role: string;
    comment: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const FeedbackSchema = new Schema<IFeedback>({
     id: {
        type: String,
        required: false
     },
     role: {
        type: String,
        require: true
     },
     comment: {
        type: String,
        require: true
     }
},{ timestamps: true }); 

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);