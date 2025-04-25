import axios from 'axios';

const JobApi = axios.create({
    baseURL: import.meta.env.VITE_API_JOB,
    withCredentials: true,
    headers: {
        'Content-Type' : 'application/json'
    }
});

JobApi.interceptors.request.use((config) => {
    const token = (localStorage.getItem('token') || localStorage.getItem('recruiterToken')); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default JobApi;  