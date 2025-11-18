import axios from 'axios';
const baseURL = import.meta.env.VITE_BASE_API;

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
const service = axios.create({
  baseURL: baseURL, //VITE_BASE_API=http://localhost:3000/api
  timeout: 300000, //(5 phút)
  // withCredentials: true, // Cho phép gửi cookie connect.sid
  withCredentials: true,
});


service.interceptors.response.use(
  (response) => {
    // backend trả về dạng { success: true, data: {...}, total: ... }
    if (response.data && response.data.success) {
       return response.data;
    } else {
      console.error("Request error:", response.data);
      return Promise.reject(response.data.message || "Request failed");
    }
  },
  (error) => {
    console.error("Network error:", error);
    return Promise.reject(error);
  }
);



export default service;