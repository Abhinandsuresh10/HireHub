import axios from 'axios';

const UserAPI = axios.create({
    baseURL: import.meta.env.VITE_API_USERS,
    withCredentials: true,
    headers: {
        'Content-Type' : 'application/json'
    }
});


UserAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default UserAPI;