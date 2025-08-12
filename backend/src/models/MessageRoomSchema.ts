import mongoose, { Document, Schema } from "mongoose";

export interface IRoom extends Document {
  participants: string[];
  unread: { userId: string, count: number} [];
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<IRoom>(
  {
    participants: [{ type: String, required: true }],
    unread: [
      {
        userId: { type: String, required: true },
        count: { type: Number, default: 0 }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model<IRoom>("Room", roomSchema);