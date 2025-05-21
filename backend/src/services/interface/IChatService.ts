import { IMessage } from "../../models/MessageSchema";
import { UserWithMessages } from "../../types/chat.types";


export interface IChatService {
    getUsersWithChat(recruiterId: string): Promise<UserWithMessages[] | null>;
    getRecruitersWithChat(userId: string): Promise<UserWithMessages[] | null>
}