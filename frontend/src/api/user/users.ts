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
        handleAxiosError(error)
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
        handleAxiosError(error)
    }
}
