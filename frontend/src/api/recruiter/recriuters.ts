import RecruiterAPI from "../../config/recruiterApi";
import { handleAxiosError } from "../../utils/HandleError";

export const editRecruiter = async (recruiterId: string, data: FormData) => {
    try { 
        const response = await RecruiterAPI.post(`/editRecruiter?recruiterId=${recruiterId}`, data, {
            headers: {
               'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        handleAxiosError(error)
    }
}

export const fetchUserAndDetails = async (userId: string) => {
    try {
       const response = await RecruiterAPI.get(`/getUserDetails?userId=${userId}`);
       
       return response; 
    } catch (error) {
       throw handleAxiosError(error); 
    }
}