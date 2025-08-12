import mongoose , { Schema, Document } from 'mongoose'

export interface IPremium extends Document {
    price: number;
    role: string;
    description: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PremiumSchema = new Schema<IPremium>({
    price: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
},{ timestamps: true }); 

export default mongoose.model<IPremium>('Premium', PremiumSchema);