import { Types } from 'mongoose';

export interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    message: string;
    sentAt: Date;
  }

export interface UserWithMessages {
    _id: string;
    name: string;
    email: string;
    messages: Message[];
  }