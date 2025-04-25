import axios from 'axios';

const ApplicationAPI = axios.create({
    baseURL: import.meta.env.VITE_API_APPLICATION,
    withCredentials: true,
    headers: {
        'Content-Type' : 'application/json'
    }
});

ApplicationAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('recruiterToken') || localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default ApplicationAPI;  