import { HttpResponse } from "../../constants/response.message";
import { IMessage } from "../../models/MessageSchema";
import { IchatRepository } from "../../repositories/interface/IchatRepository";
import { UserWithMessages } from "../../types/chat.types";
import { IChatService } from "../interface/IChatService";



export class chatService implements IChatService {
    private chatRepository: IchatRepository;

    constructor(chatRepository: IchatRepository) {
         this.chatRepository = chatRepository;
    }

    async getUsersWithChat(recruiterId: string): Promise<UserWithMessages[] | null> {
       try {
         return await this.chatRepository.getUsersAndChats(recruiterId);
       } catch (error) {
         if(error instanceof Error) {
            throw error;
         } else {
            throw new Error(HttpResponse.UNKNOWN_ERROR)
         }
       }
   }

   async getRecruitersWithChat(userId: string): Promise<UserWithMessages[] | null> {
       try {
         return await this.chatRepository.getRecruitersAndChats(userId);
       } catch (error) {
         if(error instanceof Error) {
            throw error;
         } else {
            throw new Error(HttpResponse.UNKNOWN_ERROR)
         }
       }
   }
}