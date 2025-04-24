import axios from "axios";
import API_URL from "../components/config"

// Create an Axios instance
const api = axios.create({

  // For deployment
  baseURL: `${API_URL}`,

  // For Production
  // baseURL: "/api"

});

// Add a request interceptor to attach the Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-access-token"] = token; // Attach token to headers
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Optionally dispatch a logout action or redirect here
    }
    return Promise.reject(error);
  }
);

export default api;