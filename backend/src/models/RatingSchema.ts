import mongoose, { Schema, Document } from 'mongoose'


export interface IRating extends Document {
    userId: string;
    stars: number;
    comment: string;
    company: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const RatingSchema = new Schema<IRating>({
     userId: {
        type: String,
        required: false
     },
     stars: {
        type: Number,
        required: true
     },
     comment: {
        type: String,
        require: true
     },
     company: {
        type: String,
        require: true
     }
},{ timestamps: true }); 

export default mongoose.model<IRating>('Rating', RatingSchema);