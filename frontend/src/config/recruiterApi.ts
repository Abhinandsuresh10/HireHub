import axios from 'axios';

const RecruiterAPI = axios.create({
    baseURL: import.meta.env.VITE_API_RECRUITER,
    withCredentials: true,
    headers: {
        'Content-Type' : 'application/json'
    }
});


RecruiterAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('recruiterToken') ;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default RecruiterAPI;