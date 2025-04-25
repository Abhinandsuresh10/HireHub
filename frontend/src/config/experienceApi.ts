import axios from 'axios';

const ExperienceAPI = axios.create({
    baseURL: import.meta.env.VITE_API_EXPERIENCE,
    withCredentials: true,
    headers: {
        'Content-Type' : 'application/json'
    }
});

ExperienceAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default ExperienceAPI;  