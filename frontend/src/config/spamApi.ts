import axios from 'axios';

const SpamAPI = axios.create({
    baseURL: import.meta.env.VITE_API_SPAM,
    withCredentials: true,
    headers: {
        'Content-Type' : 'application/json'
    }
});

SpamAPI.interceptors.request.use((config) => {
    const token = (localStorage.getItem('token') || localStorage.getItem('recruiterToken')); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default SpamAPI;  