import axios from 'axios';

const FeedbackApi = axios.create({
    baseURL: import.meta.env.VITE_API_FEEDBACK,
    withCredentials: true,
    headers: {
        'Content-Type' : 'application/json'
    }
});

FeedbackApi.interceptors.request.use((config) => {
    // const token = (localStorage.getItem('token') || localStorage.getItem('recruiterToken')); 
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

FeedbackApi.interceptors.response.use((res) => 
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

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }

   }

   return Promise.reject(err);
    
})


export default FeedbackApi;  