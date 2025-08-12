import { handleAxiosError } from "../../utils/HandleError";
import SpamApi from "../../config/spamApi";

interface Spam {
    reason: string;
    description: string;
    additionalDetails: string;
}


export const submitSpam = async (role: string, id: string, jobId:string, reportData: Spam) => {
    try {
      const response = await SpamApi.post(`/addSpam?role=${role}&id=${id}&jobId=${jobId}`, reportData);
      return response; 
    } catch (error) {
      throw handleAxiosError(error);  
    }
}

export const getSpamReports = async (page: number, limit: number) => {
  try {
    const response = await SpamApi.get(`/getSpamReports?page=${page}&limit=${limit}`);
    return response; 
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export const getSpammer = async (refId: string, role: string) => {
  try {
    const response = await SpamApi.get(`/getSpammer?refId=${refId}&role=${role}`);
    return response;
  } catch (error) {
    throw handleAxiosError(error);
  }
}