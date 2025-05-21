import { UserWithMessages } from "../../types/chat.types";


export interface IchatRepository {
    getUsersAndChats(recruiterId: string): Promise<UserWithMessages[] | null>
    getRecruitersAndChats(userId: string): Promise<UserWithMessages[] | null>
}