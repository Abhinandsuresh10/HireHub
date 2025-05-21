import axios from 'axios';

const MessageAPI = axios.create({
    baseURL: import.meta.env.VITE_API_CHAT,
    withCredentials: true,
    headers: {
        'Content-Type' : 'application/json'
    }
});

MessageAPI.interceptors.request.use((config) => {
    const userToken = localStorage.getItem('token'); 
    const recruiterToken = localStorage.getItem('recruiterToken'); 

    if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
    } else if (recruiterToken) {
        config.headers.Authorization = `Bearer ${recruiterToken}`;
    }
    return config;
});

export default MessageAPI; 