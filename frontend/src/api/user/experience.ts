import { handleAxiosError } from "../../utils/HandleError";
import ExperienceAPI from "../../config/experienceApi";

export interface IExpereience {
   jobTitle: string;
   company: string;
   startDate: string;
   endDate: string;
   achievements: string;
}

export const addExperience = async(userId: string ,data: IExpereience) => {
   try {
    const response = await ExperienceAPI.post(`/addExperience?userId=${userId}`, data);
    return response;
   } catch (error) {
    handleAxiosError(error)
   }
}

export const getExperience = async(userId: string) => {
   try {
      const response = await ExperienceAPI.get(`/getExperience?userId=${userId}`);
      return response.data.experiences;
   } catch (error) {
      handleAxiosError(error)
   }
}

export const deleteExperience = async(id: string) => {
   try {
     const response = await ExperienceAPI.delete(`/deleteExperience?id=${id}`);
     return  response.data.message;
   } catch (error) {
      handleAxiosError(error)
   }
}