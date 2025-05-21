import axios from 'axios';

const InterviewApi = axios.create({
    baseURL: import.meta.env.VITE_API_INTERVIEW,
    withCredentials: true,
    headers: {
        'Content-Type' : 'application/json'
    }
});

InterviewApi.interceptors.request.use((config) => {
    const token = (localStorage.getItem('token') || localStorage.getItem('recruiterToken')); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default InterviewApi;  