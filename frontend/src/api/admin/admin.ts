import AdminAPI from "../../config/adminApi";
import { handleAxiosError } from "../../utils/HandleError";


export const getDashboardStats = async () => {
    try {
      const response = await AdminAPI.get('/dashboard');
      return response;
    } catch (error) {
      console.log(error);  
      throw handleAxiosError(error);
    }
}


export const getDasboardBarData = async () => {
    try {
      const response = await AdminAPI.get('/dashboardBar');
      return response;  
    } catch (error) {
      console.log(error);  
      throw handleAxiosError(error);
    }
}

export const getDashboardLineData = async () => {
  try {
     const response = await AdminAPI.get('/dashboardLineData');
     return response;
  } catch (error) {
     console.log(error);  
     throw handleAxiosError(error);
  }
}