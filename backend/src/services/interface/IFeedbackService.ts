

export interface Feedbacks {
    id: string;
    role: string;
    comment: string;
}


export interface IFeedbackService {
    addFeedback(id: string, role: string, comment: string): Promise<void>;
    getFeedbacks(id: string, role: string): Promise<Feedbacks[] | null>
}