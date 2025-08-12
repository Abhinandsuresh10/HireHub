import UserAPI from "../../config/userApi";
import { handleAxiosError } from "../../utils/HandleError";


export const addResume = async (formData, userId: string) => {
    try {
        const response = await UserAPI.post(`/addResume?userId=${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        throw handleAxiosError(error)
    }
}

export const addCoverLetter = async (formData, userId: string) => {
    try {
      const response = await UserAPI.post(`/addCoverLetter?userId=${userId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      throw handleAxiosError(error);  
    }
}

export const editUser = async (userId: string, data: FormData) => {
    try { 
        const response = await UserAPI.post(`/editUser?userId=${userId}`, data, {
            headers: {
               'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        throw handleAxiosError(error)
    }
}


export const addUserSkills = async(userId: string, skills: []) => {
    try {
       const response = await UserAPI.post(`/addSkills?userId=${userId}`, skills);
       return response; 
    } catch (error) {
        throw handleAxiosError(error)
    }
}

export const addPreferredRoles = async(userId: string, roles: string[]) => {
    try {
        const response = await UserAPI.post(`/addPreferredRoles/${userId}`, roles);
        return response;  
    } catch (error) {
        throw handleAxiosError(error);
    }
}

export const addPreferredTypes = async(userId: string, types: string[]) => {
    try {
        const response = await UserAPI.post(`/addPreferredTypes/${userId}`, types);
        return response;  
    } catch (error) {
        throw handleAxiosError(error);
    }
}

export const getCompanies = async() => {
    try {
     const response = await UserAPI.get('/getCompanies');
     return response; 
    } catch (error) {
     throw handleAxiosError(error);
    }
}

export const premiumPurchase = async(id: string, amount: number) => {
    try {
    const response = await UserAPI.post(`/premiumPurchase`, { id , amount});
    return response;   
    } catch (error) {
     throw handleAxiosError(error);   
    }
}

export const completePurchase = async(id: string, paymentId: string, price: number) => {
    try {
      const response = UserAPI.post('/completePurchase', { id, paymentId, price});
      return response;   
    } catch (error) {
      throw handleAxiosError(error);  
    }
}

export const viewedJobs = async(id: string) => {
    try {
      const response = UserAPI.get(`/viewedJobs?id=${id}`);
      return response;  
    } catch (error) {
      throw handleAxiosError(error);  
    }
}

export const viewedRecruiter = async(id: string) => {
    try {
      const response = UserAPI.get(`/viewedRecruiter?id=${id}`);
      return response; 
    } catch (error) {
      throw handleAxiosError(error);   
    }
}

export const verifyPassword = async(password: string, userId: string) => {
    try {
      const response = UserAPI.post(`/verifyOfferLetterPassword?userId=${userId}`, { password });
      return response;  
    } catch (error) {
      throw handleAxiosError(error);   
    }
}

export const getAllRecruiters = async(company: string, industry: string, page: number, limit: number) => {
    try {
      const response = UserAPI.get(`/getAllRecruiters?company=${company}&industry=${industry}&page=${page}&limit=${limit}`);
      return response; 
    } catch (error) {
      throw handleAxiosError(error);  
    }
}

export const getSingleRecruiter = async(id: string) => {
    try {
      const response = UserAPI.get(`/getSingleRecruiter`, { params: { id } });
      return response; 
    } catch (error) {
      throw handleAxiosError(error);  
    }
}