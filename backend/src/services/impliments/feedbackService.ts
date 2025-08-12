import { HttpResponse } from "../../constants/response.message";
import { feedbackRepository } from "../../repositories/impliments/feedbackRepository";
import { IFeedbackRepository } from "../../repositories/interface/IFeedbackRepository";
import { Feedbacks, IFeedbackService } from "../interface/IFeedbackService";



export class FeedbackService implements IFeedbackService {
    private feedbackRepository: IFeedbackRepository;

    constructor(feedbackRepository: feedbackRepository) {
         this.feedbackRepository = feedbackRepository;
    }

    async addFeedback(id: string, role: string, comment: string): Promise<void> {
        try {
          await this.feedbackRepository.addFeedback(id, role, comment);
        } catch (error) {
          if(error instanceof Error) {
             throw error;
         } else {
             throw new Error(HttpResponse.UNKNOWN_ERROR)
         }
        }
    }

    async getFeedbacks(id: string, role: string): Promise<Feedbacks[] | null> {
        try {
          const feedback = await this.feedbackRepository.getFeedbacks(id, role); 
          if(!feedback) throw new Error(HttpResponse.FEEDBACK_NOT_FOUND);
           const feedbacks: Feedbacks[] = feedback.map((fb) => ({
            id: fb.id,
            role: fb.role,
            comment: fb.comment
          }));

          return feedbacks
        } catch (error) {
           if(error instanceof Error) {
             throw error;
         } else {
             throw new Error(HttpResponse.UNKNOWN_ERROR)
         }  
        }
    }

}