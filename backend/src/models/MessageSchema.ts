import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  roomId: mongoose.Types.ObjectId;
  senderId: string;
  receiverId: string;
  message?: string;
  file?: string;
  sentAt: Date;
}

const messageSchema = new Schema<IMessage>({
  roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  senderId: { type: String, required: true  },
  receiverId: { type: String, required: true  },
  message: { type: String, required: false },
  file: {type: String, required: false},
  sentAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>("Message", messageSchema);
