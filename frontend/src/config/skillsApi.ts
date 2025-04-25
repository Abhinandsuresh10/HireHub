import axios from 'axios';

const SkillsAPI = axios.create({
    baseURL: import.meta.env.VITE_API_SKILLS,
    withCredentials: true,
    headers: {
        'Content-Type' : 'application/json'
    }
});

SkillsAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default SkillsAPI;  