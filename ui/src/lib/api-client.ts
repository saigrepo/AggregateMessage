import axios from "axios";
import {HOST} from "../utils/Constants.ts";


const apiClient = axios.create({
    baseURL: HOST,
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    }
});

export default apiClient;