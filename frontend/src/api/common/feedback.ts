import FeedbackApi from "../../config/feedbackApi"
import { handleAxiosError } from "../../utils/HandleError"


export const addFeedback = async(id: string, role: string, comment: string) => {
     try {
       const response = await FeedbackApi.post('/addFeedback', { id, role, comment});
       return response;
     } catch (error) {
        throw handleAxiosError(error)
     }
}

export const getFeedbacks = async(id: string, role: string) => {
  try {
    const response = await FeedbackApi.get(`/getFeedbacks?id=${id}&role=${role}`);
    return response;
  } catch (error) {
    throw handleAxiosError(error);
  }
}