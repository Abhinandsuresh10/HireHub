import { Server } from "socket.io";
import Room from "../models/MessageRoomSchema";
import Message from "../models/MessageSchema";
import cloudinary from "../config/cloudinary";
import Notification from "../models/Notification";
import Interview from "../models/InterviewSchema";
import Application from "../models/ApplicatinSchema";

interface MessagePayload {
  senderId: string;
  receiverId: string;
  message?: string;
  file?: {
    name: string;
    type: string;
    data: string; 
  };
}

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {

    socket.on("join_room", (userId: string) => {
      socket.join(userId);
    });

    socket.on("sent_message", async ({ senderId, receiverId, message }: MessagePayload) => {
      try {
        let room = await Room.findOne({ participants: { $all: [senderId, receiverId], $size: 2 } });

        if (!room) {
          room = await Room.create({ 
             participants: [senderId, receiverId] ,
             unread: [
              { userId: senderId, count: 0},
              { userId: receiverId, count: 0}
            ]
          });
        }

        const newMessage = await Message.create({
          roomId: room._id,
          senderId,
          receiverId,
          message,
          sentAt: new Date(),
        });

        io.to(receiverId).to(senderId).emit("new_message", {
          _id: newMessage._id,
          roomId: room._id,
          senderId,
          receiverId,
          message,
          sentAt: newMessage.sentAt,
        });

        await Room.updateOne(
         { _id: room._id, "unread.userId": receiverId},
         { $inc: { "unread.$.count": 1 }}
         );
    
        const updatedRoom = await Room.findById(room._id);
        const receiverUnread = updatedRoom?.unread.find(u => u.userId === receiverId)?.count || 0;
        io.to(receiverId).emit("update_unread", { roomId: room._id, count: receiverUnread });

      } catch (error) {
        console.error("Error handling sent_message:", error);
      }
    });

    
    socket.on("sent_file", async ({ senderId, receiverId, file }: MessagePayload) => {
      try {
        if (!file) {
          console.error("File is undefined");
          return;
        }
    
        let room = await Room.findOne({ participants: { $all: [senderId, receiverId], $size: 2 } });
    
        if (!room) {
          room = await Room.create({ participants: [senderId, receiverId] });
        }
    
        const uploadResponse = await cloudinary.uploader.upload(file.data, {
          folder: process.env.CHAT_FOLDER,
          resource_type: "auto", 
        });
        
        const newMessage = await Message.create({
          roomId: room._id,
          senderId,
          receiverId,
          file: uploadResponse.secure_url, 
          sentAt: new Date(),
        });
    
        io.to(receiverId).to(senderId).emit("new_file", {
          _id: newMessage._id,
          roomId: room._id,
          senderId,
          receiverId,
          file: newMessage.file,
          sentAt: newMessage.sentAt,
        });
      } catch (error) {
        console.error("Error handling sent_file:", error);
      }
    });

    socket.on("shedule_interview",  async ({ senderId, content, offerLetter, userId}) => {
      try {
        
        const notification = await Notification.create({
          senderId,
          content,
          offerLetter,
          userId,
          date: new Date()
        });

        io.to(userId).emit("new_notification", {
          _id: notification._id,
          senderId,
          content,
          offerLetter,
          userId,
          date: notification.date,
        })

      } catch (error) {
        console.error("Error handling schedule_interview:", error);
      }
    });

    socket.on("read_messages", async ({ roomId, userId }) => {
      await Room.updateOne(
        { _id: roomId, "unread.userId": userId },
        { $set: {"unread.$.count": 0}}
      );
      io.to(userId).emit("update_unread", { roomId, count: 0})
    })

    socket.on("call_user", ({interviewId, callerId, receiverId}) => {
      io.to(receiverId).emit("incoming_call", { interviewId, callerId, receiverId });
    });
    
    socket.on("end_call", ({ roomId }) => {
      socket.to(roomId).emit("call_ended");
    });

    socket.on("webrtc_signal", ({ roomId, data }) => {
      socket.to(roomId).emit("webrtc_signal", data);
    });

    socket.on("complete", async (id) => {
      try {
       const updatedInterview = await Interview.findByIdAndUpdate(id.roomId, { status: 'completed' }, { new: true });
       if(updatedInterview) {
        await Application.findByIdAndUpdate(updatedInterview.applicationId, { status: "Completed" }, { new : true})
       }
      } catch (error) {
         console.error("Error handling schedule_interview:", error);
      }
    })

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};

