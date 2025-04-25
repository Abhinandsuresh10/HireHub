import EducationAPI from "../../config/educationApi";
import { handleAxiosError } from "../../utils/HandleError"


export interface IEducation {
    education: string;
    institution: string;
    graduateYear: Date;
 }

export const addEducation = async(userId: string, education: IEducation) => {
     try {
       const response = await EducationAPI.post(`/addEducation?userId=${userId}`, education);
       return response; 
     } catch (error) {
        handleAxiosError(error);
     }
}


export const getEducation = async(userId: string) => {
        try {
         const response = await EducationAPI.get(`/getEducation?userId=${userId}`);
         return response.data.education;
        } catch (error) {
          handleAxiosError(error)
        }
}

export const deleteEducation = async(id: string) => {
   try {
      await EducationAPI.delete(`/deleteEducation?id=${id}`);
   } catch (error) {
      handleAxiosError(error)
   }
}