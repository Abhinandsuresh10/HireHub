import mongoose, { Document, Schema } from "mongoose";

export interface IRoom extends Document {
  participants: string[];
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<IRoom>(
  {
    participants: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export default mongoose.model<IRoom>("Room", roomSchema);
