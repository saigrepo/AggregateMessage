import axios from "axios";
import {HOST} from "../utils/Constants.ts";


const apiClient = axios.create({
    baseURL: HOST
});

export default apiClient;