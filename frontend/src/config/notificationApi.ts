import axios from 'axios';

const NotificationApi = axios.create({
    baseURL: import.meta.env.VITE_API_NOTIFICATION,
    withCredentials: true,
    headers: {
        'Content-Type' : 'application/json'
    }
});

NotificationApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default NotificationApi;  