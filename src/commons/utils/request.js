import axios from 'axios';
const baseURL = import.meta.env.VITE_BASE_API;

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
const service = axios.create({
  baseURL: baseURL, //VITE_BASE_API=https://n904dv9q-3000.asse.devtunnels.ms/api
  timeout: 300000, //300 giây (5 phút)
  withCredentials: true, // ⚠️ Cho phép gửi cookie connect.sid
});

// Interceptor xử lý response
service.interceptors.response.use(
  (response) => {
    // Nếu backend trả về dạng { success: true, data: {...} }
    if (response.data && response.data.success) {
      return response.data.data;
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