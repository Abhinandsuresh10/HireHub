import JobApi from "../../config/jobApi";
import { handleAxiosError } from "../../utils/HandleError"


export const getJobs = async (userId: string, page: number, limit: number, search: string, jobType: string, jobLocation:string, minSalary: number, maxSalary: number) => {
    try {
       const response = await JobApi.get(`/userGetJob?userId=${userId}&page=${page}&limit=${limit}&search=${search}&jobType=${jobType}&jobLocation=${jobLocation}&minSalary=${minSalary}&maxSalary=${maxSalary}`);
       return response
    } catch (error) {
      console.log('postJob error', error);
      throw handleAxiosError(error);  
    }
}
