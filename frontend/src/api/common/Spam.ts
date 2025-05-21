import { handleAxiosError } from "../../utils/HandleError";
import SpamApi from "../../config/spamApi";

interface Spam {
    reason: string;
    description: string;
    additionalDetails: string;
}


export const submitSpam = async (role: string, id: string, reportData: Spam) => {
    try {
      const response = await SpamApi.post(`/addSpam?role=${role}&id=${id}`, reportData);
      return response; 
    } catch (error) {
      throw handleAxiosError(error);  
    }
}

export const getSpamReports = async () => {
  try {
    const response = await SpamApi.get('/getSpamReports');
    return response; 
  } catch (error) {
    throw handleAxiosError(error);
  }
}