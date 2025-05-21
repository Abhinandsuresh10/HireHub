import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  senderId?: mongoose.Types.ObjectId;
  content?: string;
  userId?: mongoose.Types.ObjectId;
  date: Date;
}

const notificationSchema = new Schema<INotification>({
  senderId: { type: Schema.Types.ObjectId, ref:'Recruiter' },
  content: { type: String, required: false },
  userId: { type: Schema.Types.ObjectId, ref:'User' },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<INotification>("Notification", notificationSchema);