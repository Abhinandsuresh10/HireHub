import axios from 'axios';

const AdminAPI = axios.create({
    baseURL: import.meta.env.VITE_API_ADMIN,
    withCredentials: true,
    headers: {
        'Content-Type' : 'application/json'
    }
});


AdminAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default AdminAPI;