import axios from 'axios';

const EducationAPI = axios.create({
    baseURL: import.meta.env.VITE_API_EDUCATION,
    withCredentials: true,
    headers: {
        'Content-Type' : 'application/json'
    }
});

EducationAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default EducationAPI;  