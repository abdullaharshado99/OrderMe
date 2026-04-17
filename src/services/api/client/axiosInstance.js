import axios from "axios";
import { store } from "../../../redux/store";
import { dispatchUserLogout } from "../../../redux/slices/userSlice";
import { API_BASE_URL } from "../../../config/constants";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use(
  (config) => {
    // Redux shape: store → { userReducer: { user: { id, name, email, token }, isLoggedIn } }
    // Token is stored at userReducer.user.token after dispatchUser(data.user)
    const userState = store.getState()?.userReducer?.user;
    const token = userState?.token || userState?.accessToken;
console.log("config", config)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (__DEV__) {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
      );
      console.log(
        `🔑 Token: ${
          token
            ? token.substring(0, 20) + "..."
            : "MISSING — check Redux userReducer.user.token"
        }`,
      );
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor - Handle global errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (__DEV__) {
      console.log(`✅ API Response: ${response.config.url}`, response.status);
    }
    return response;
  },
  async (error) => {
    const { response, config } = error;

    // Handle 401 - Unauthorized (token expired/invalid)
    if (response?.status === 401) {
      console.warn("🔒 Unauthorized - Logging out user");
      store.dispatch(dispatchUserLogout());

      // Optional: Implement token refresh logic here
      // const refreshToken = store.getState()?.user?.user?.refreshToken;
      // if (refreshToken) {
      //   try {
      //     const newToken = await refreshAccessToken(refreshToken);
      //     config.headers.Authorization = `Bearer ${newToken}`;
      //     return axiosInstance(config); // Retry original request
      //   } catch (refreshError) {
      //     store.dispatch(dispatchUserLogout());
      //   }
      // }
    }
    if (response?.status === 500) {
      console.error("🔥 Server Error:", response.data);
    }
    if (!response) {
      console.error("🌐 Network Error - No response from server");
    }
    if (__DEV__) {
      console.error("❌ API Error:", {
        url: config?.url,
        method: config?.method,
        status: response?.status,
        message: response?.data?.message || error.message,
      });
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
