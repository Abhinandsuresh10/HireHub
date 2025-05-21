import InterviewApi from "../../config/interviewApi";
import { handleAxiosError } from "../../utils/HandleError";

export interface Interview {
    jobRole: string;
    interviewer: string;
    date: Date;
    time: string;
}

export interface Application {
    appliedAt: Date;
    jobId: string;
    recruiterId: string;
    status: string;
    userId: string;
    _id: string;
}

export const sheduleInterview = async (data: Interview, application: Application) => {
    try {
       const response = await InterviewApi.post('/sheduleInterview', { data , application});
       return response;
    } catch (error) {
       throw handleAxiosError(error)
    }
}

export const getInterviews = async (recruiterId: string, page: number, limit: number) => {
    try {
       const response = await InterviewApi.get(`/sheduleInterview?recruiterId=${recruiterId}&page=${page}&limit=${limit}`);
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