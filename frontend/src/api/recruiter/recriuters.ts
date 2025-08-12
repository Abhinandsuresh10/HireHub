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

export const getDashboardMatrics = async (recruiterId: string) => {
    try {
       const response = await RecruiterAPI.get(`/dashboard?id=${recruiterId}`);
       return response; 
    } catch (error) {
       throw handleAxiosError(error); 
    }
}

export const getDashboardInterviews = async (recruiterId: string) => {
    try {
       const response = await RecruiterAPI.get(`/dashboardInterviews?id=${recruiterId}`);
       return response;  
    } catch (error) {
       throw handleAxiosError(error); 
    }
}

export const getCompletedInterviews = async (recruiterId: string, page: number, limit: number) => {
    try {
       const response = await RecruiterAPI.get(`/getCompletedInterviews?id=${recruiterId}&page=${page}&limit=${limit}`);
       return response; 
    } catch (error) {
       throw handleAxiosError(error); 
    }
}

export const getDashboardGraphData = async (recruiterId: string) => {
    try {
       const response = await RecruiterAPI.get(`/dashboardGraphData?id=${recruiterId}`);
       return response; 
    } catch (error) {
       throw handleAxiosError(error); 
    }
}

export const recruiterPremiumPurchase = async(id: string, amount: number) => {
    try {
    const response = await RecruiterAPI.post(`/premiumPurchase`, { id , amount});
    return response;   
    } catch (error) {
     throw handleAxiosError(error);   
    }
}

export const RecruiterCompletePurchase = async(id: string, paymentId: string, price: number) => {
    try {
      const response = await RecruiterAPI.post('/completePurchase', { id, paymentId, price});
      return response;   
    } catch (error) {
      throw handleAxiosError(error);  
    }
}

export const addOfferLetter = async(formData, userId: string) => {
    try {
     const response = await RecruiterAPI.post(`/offerLetter?userId=${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
     return response;  
    } catch (error) {
     throw handleAxiosError(error);    
    }
}


// count the viewedUsers in the Recruiter collection for non premium users...
export const viewedUserProfiles = async(recruiterId: string) => {
    try {
      const response = await RecruiterAPI.post(`/viewedUserProfiles?recruiterId=${recruiterId}`);
      return response;  
    } catch (error) {
      throw handleAxiosError(error);  
    }
}

// fetch all users to the recruiter...
export const fetchAllUsers = async(page: number, limit: number, jobType: string, jobRole: string) => {
    try {
      const response = await RecruiterAPI.get(`/getUsers?page=${page}&limit=${limit}&jobType=${jobType}&jobRole=${jobRole}`);
      return response;  
    } catch (error) {
      throw handleAxiosError(error);  
    }
}


// fetch full details of a user...
export const getUserDetails = async(userId: string) => {
    try {
       const response = await RecruiterAPI.get(`/getAnyUserDetails/${userId}`);
       return response; 
    } catch (error) {
       throw handleAxiosError(error); 
    }
}

// check non premium user daily view count...
export const checkDayVisitedComplete = async(id: string) => {
    try {
       const response =  RecruiterAPI.get(`/checkDayVisitedComplete/${id}`);
       return response;
    } catch (error) {
       throw handleAxiosError(error); 
    }
}

// check non premium user daily add job count...
export const checkDayAddJobComplete = async(id: string) => {
    try {
      const response = RecruiterAPI.get(`/checkDayAddJobComplete/${id}`);
      return response; 
    } catch (error) {
      throw handleAxiosError(error);  
    }
}