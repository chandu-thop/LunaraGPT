import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiBaseUrl || "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      const isLocalhostApi = api.defaults.baseURL?.includes("localhost");
      const message =
        import.meta.env.PROD && isLocalhostApi
          ? "API URL is not configured. Set VITE_API_URL to your deployed backend URL ending with /api, then redeploy the frontend."
          : "Could not reach the server. Check that the backend is running and CORS allows this site.";

      error.userMessage = message;
    }

    return Promise.reject(error);
  }
);

export default api;
