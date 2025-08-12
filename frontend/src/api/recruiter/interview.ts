import InterviewApi from "../../config/interviewApi";
import { handleAxiosError } from "../../utils/HandleError";
import { Application } from "../../types/application.type";

export interface Interview {
    jobRole: string;
    interviewer: string;
    interviewType: string;
    round?: number;
    date: Date;
    time: string;
}

export const sheduleInterview = async (data: Interview, application: Application) => {
    try {
       const response = await InterviewApi.post('/sheduleInterview', { data , application});
       return response;
    } catch (error) {
       throw handleAxiosError(error)
    }
}

export const getInterviews = async (recruiterId: string, page: number, limit: number, interviewType: string) => {
    try {
       const response = await InterviewApi.get(`/sheduleInterview?recruiterId=${recruiterId}&page=${page}&limit=${limit}&interviewType=${interviewType}`);
       return response.data; 
    } catch (error) {
       throw handleAxiosError(error); 
    }
}

export const fetchUsersInterviews = async (userId: string, page: number, limit: number) => {
    try {
       const response = await InterviewApi.get(`/sheduledUserInterviews?userId=${userId}&page=${page}&limit=${limit}`);
       return response.data;  
    } catch (error) {
       throw handleAxiosError(error); 
    }
}

export const getInterviewsById = async(userId: string) => {
   try {
      const response = await InterviewApi.get(`/sheduleInterviewById/${userId}`) 
      return response;
   } catch (error) {
      throw handleAxiosError(error);
   }
}

export const rescheduleInterview = async(id: string, data: { date: Date; time: string }) => {
   try {
      const response = await InterviewApi.patch(`/resheduleInterview/${id}`, { data }); 
      return response;
   } catch (error) {
      throw handleAxiosError(error);
   }
}

export const getInterview = async(id: string) => {
   try {
      const response = await InterviewApi.get(`/getInterview/${id}`); 
      return response;
   } catch (error) {
      throw handleAxiosError(error);
   }
}