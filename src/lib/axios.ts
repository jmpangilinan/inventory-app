import axios, { type AxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ?? "https://inventory-api-production-8530.up.railway.app",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !error.config?.url?.includes("/auth/")
    ) {
      /* c8 ignore next -- browser navigation, covered by E2E */
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const axiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return instance(config).then((response) => response.data);
};

export default instance;
