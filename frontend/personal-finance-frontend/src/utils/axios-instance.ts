import axios from "axios";
import { BASE_URL } from "./api";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

//Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            console.log("Session expired, Please login again");
        } else if (error.response.status === 500) {
            console.log("Server Error, Please try again later");
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timeout, Please try again later");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

