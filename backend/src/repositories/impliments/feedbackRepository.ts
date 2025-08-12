import Feedback, { IFeedback } from "../../models/FeedbackSchema";
import { Feedbacks } from "../../services/interface/IFeedbackService";
import { IFeedbackRepository } from "../interface/IFeedbackRepository";
import { BaseRepository } from "./baseRepository";



export class feedbackRepository extends BaseRepository<IFeedback> implements IFeedbackRepository {
      constructor() {
        super(Feedback)
      }

      async addFeedback(id: string, role: string, comment: string): Promise<void> {
          try {
            await Feedback.create({id, role, comment});
          } catch (error) {
            console.log('error on creating feedback', error)
          }
      }

     async getFeedbacks(id: string, role: string): Promise<IFeedback[] | null> {
          try {
            return await Feedback.find({id, role});
          } catch (error) {
            console.log('error on creating feedback', error);
            return null;
          }
      }

}