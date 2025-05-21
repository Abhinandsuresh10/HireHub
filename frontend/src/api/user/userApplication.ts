import ApplicationApi from '../../config/applicationApi'
import { handleAxiosError } from "../../utils/HandleError"


interface apply {
    jobId: string;
    userId: string;
    recruiterId: string;
}

export const applyJob = async (data: apply) => {
    try {
        const response = await ApplicationApi.post('/apply', data);
        return response;
    } catch (error) {
        handleAxiosError(error)
    }
}

export const fetchIsApplied = async (userId: string, jobId: string) => {
    try {
      const response = ApplicationApi.get(`/isApplied?userId=${userId}&jobId=${jobId}`);
      return response;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }

export const fetchAppliedJobs = async (userId: string, page: number, limit: number) => {
    try {
        const response = await ApplicationApi.get(`/appliedJobs?userId=${userId}&page=${page}&limit=${limit}`);
        return response;
    } catch (error) {
        handleAxiosError(error)
    } 
  }

export const getAplied = async(id: string, page: number, limit: number) => {
  try {
    const response = await ApplicationApi.get(`/getApplicants?recruiterId=${id}&page=${page}&limit=${limit}`);
    return response.data
  } catch (error) {
    console.log(error);
    throw handleAxiosError(error);
  }
}

export const acceptApplication = async(id: string) => {
  try {
   const response = await ApplicationApi.patch(`/acceptApplication?id=${id}`);
   return response; 
  } catch (error) {
    console.log(error);
    throw handleAxiosError(error);
  }
}

export const getApplication = async(id: string) => {
  try {
    const response = await ApplicationApi.get(`/getApplication?id=${id}`);
    return response;
  } catch (error) {
    console.log(error);
    throw handleAxiosError(error);
  }
}