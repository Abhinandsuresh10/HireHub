import axios from 'axios';

const JobRolesAPI = axios.create({
    baseURL: import.meta.env.VITE_API_JOBROLES,
    withCredentials: true,
    headers: {
        'Content-Type' : 'application/json'
    }
});

JobRolesAPI.interceptors.request.use((config) => {
    // const token = (localStorage.getItem('token') || localStorage.getItem('adminToken')); 
    const token = localStorage.getItem('token') // testing...
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
(error) => {
    console.error('Request Error : ', error);
    return Promise.reject(error);
});

JobRolesAPI.interceptors.response.use((res) => 
    res, async(err) => {
        const originalRequest = err.config;

        if(err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
        

        try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_REFRESH_TOKEN}/refresh/user`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem('token', newAccessToken);

        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }

   }

   return Promise.reject(err);
    
})




export default JobRolesAPI;  