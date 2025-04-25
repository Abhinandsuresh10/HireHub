import JobApi from "../../config/jobApi";
import { handleAxiosError } from "../../utils/HandleError"


export const getJobs = async (page: number, limit: number, search: string) => {
    try {
       const response = await JobApi.get(`/userGetJob?page=${page}&limit=${limit}&search=${search}`);
       return response
    } catch (error) {
      console.log('postJob error', error);
      throw handleAxiosError(error);  
    }
}
