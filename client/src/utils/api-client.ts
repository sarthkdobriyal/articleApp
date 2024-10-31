import axios, { AxiosInstance } from 'axios';


export const unauthClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL
});


export const authClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});


authClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

