import NotificationApi from "../../config/notificationApi"
import { handleAxiosError } from "../../utils/HandleError"


export const fetchNotifications = async(id: string, page: number, limit: number) => {
    try {
      const response = await NotificationApi.get(`/notifications?id=${id}&page=${page}&limit=${limit}`);
      return response.data;  
    } catch (error) {
        throw handleAxiosError(error)
    }
}

export const deleteNotification = async(id: string) => {
    try {
      const response = await NotificationApi.delete(`/notifications?id=${id}`);
      return response;  
    } catch (error) {
        throw handleAxiosError(error);
    }
}