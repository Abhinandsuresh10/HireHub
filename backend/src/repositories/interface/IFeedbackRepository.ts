import { IFeedback } from "../../models/FeedbackSchema";


export interface IFeedbackRepository {
    addFeedback(id: string, role: string, comment: string): Promise<void>;
    getFeedbacks(id: string, role: string): Promise<IFeedback[] | null>
}