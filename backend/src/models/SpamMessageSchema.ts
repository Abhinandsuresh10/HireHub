import mongoose , { Schema, Document } from 'mongoose'


export interface ISpam extends Document {
    refId: string;
    role: string;
    reason: string;
    description: string;
    additionalDetails: string;
    createdAt: Date;
    updatedAt: Date;
}

const SpamMessageSchema = new Schema<ISpam>({
     refId: {
        type: String,
        required: true
     },
     role: {
        type: String,
        require: true
     },
     reason: {
        type: String,
        required: true
     },
     description: {
        type: String,
        required: true
     },
     additionalDetails: {
        type: String,
        required: false
     }
},{ timestamps: true }); 

export default mongoose.model<ISpam>('Spam', SpamMessageSchema);