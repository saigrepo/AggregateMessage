import axios from "axios";
import {HOST} from "../utils/Constants.ts";


const apiClient = axios.create({
    baseURL: HOST,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

export default apiClient;