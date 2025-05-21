import MessageAPI from "../../config/messageApi";
import { handleAxiosError } from "../../utils/HandleError";



export const getUsersWithChat = async(id: string) => {
    try {
      const response = await MessageAPI.get(`/users/${id}`);
      return response; 
    } catch (error) {
      throw handleAxiosError(error)
    }
}

export const getRecruitersWithChat = async(id: string) => {
  try {
    const response = await MessageAPI.get(`/recruiters/${id}`);
    return response;
  } catch (error) {
    throw handleAxiosError(error)
  }
}