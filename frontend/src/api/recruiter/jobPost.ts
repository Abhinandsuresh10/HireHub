import JobApi from "../../config/jobApi";
import { handleAxiosError } from "../../utils/HandleError"


export const SentJobData = async(data: object, id: string, company: string) => {
    try {

        const response = JobApi.post('/postJob', {data, id, company})
        return response;

    } catch (error) {
      console.log('postJob error', error);
      throw handleAxiosError(error);  
    }
}

export const getJobs = async (id: string, page: number, limit: number) => {
    try {
       const response = JobApi.get(`/getJob?id=${id}&page=${page}&limit=${limit}`);
       return response
    } catch (error) {
      console.log('postJob error', error);
      throw handleAxiosError(error);  
    }
}

export const deleteJob = async (id: string) => {
    try {
      const response = JobApi.patch(`/deleteJob?id=${id}`);
      return response;
    } catch (error) {
        console.log('deleteJob error', error);
        throw handleAxiosError(error);
        
    }
}

export const fetchJobById = async(id: string) => {
  try {
   const response = await JobApi.get(`/getJobById?id=${id}`);
   return response;
  } catch (error) {
    console.log('findingJob error', error);
    throw handleAxiosError(error);
  }
}

export const EditJobData = async(data: object, id: string) => {
  try {
   const response = await JobApi.post('/editJob', {data, id})
   return response;
  } catch (error) {
    console.log('editJob error', error);
    throw handleAxiosError(error);  
  }
}


export const getRoles = async() => {
  try {
   const response = await JobApi.get('/getRoles');
   return response; 
  } catch (error) {
    throw handleAxiosError(error);
  }
}

export const getTitles = async() => {
  try {
    const response = await JobApi.get('/getTitles');
    return response;
  } catch (error) {
    throw handleAxiosError(error);
  }
}
