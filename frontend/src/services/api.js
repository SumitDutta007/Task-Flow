import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Task API calls
export const taskAPI = {
  getAllTasks: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append("status", params.status);
    if (params.priority) queryParams.append("priority", params.priority);
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.order) queryParams.append("order", params.order);

    return api.get(`/api/tasks?${queryParams.toString()}`);
  },

  getTask: (id) => api.get(`/api/tasks/${id}`),

  createTask: (data) => api.post("/api/tasks", data),

  updateTask: (id, data) => api.put(`/api/tasks/${id}`, data),

  deleteTask: (id) => api.delete(`/api/tasks/${id}`),

  getStats: () => api.get("/api/tasks/stats/summary"),
};

export default api;
