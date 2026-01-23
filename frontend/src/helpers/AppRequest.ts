import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { toast } from "sonner";

interface RequestConfig extends AxiosRequestConfig {
  showError?: boolean;
  showSuccess?: boolean;
  successMessage?: string;
}

class AppRequest {
  private api: AxiosInstance;

  constructor() {
    // create baseurl based on environment
    const baseURL = import.meta.env.PROD
      ? import.meta.env.VITE_API_URL_PROD
      : import.meta.env.VITE_API_URL_DEV;

    // Validate that baseURL is defined
    if (!baseURL) {
      console.error("⚠️ API Base URL is not defined!");
      console.error("Environment:", import.meta.env.MODE);
      console.error("PROD:", import.meta.env.PROD);
      console.error("Available env vars:", import.meta.env);
      throw new Error(
        "API Base URL is not configured. Please set VITE_API_URL_DEV or VITE_API_URL_PROD in your environment variables.",
      );
    }

    console.log("✅ API Base URL:", baseURL);
    console.log("🌍 Environment:", import.meta.env.MODE);

    this.api = axios.create({
      baseURL: baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("auth-storage");
        if (token) {
          try {
            const authData = JSON.parse(token);
            if (authData?.state?.token) {
              config.headers.Authorization = `Bearer ${authData.state.token}`;
            }
          } catch (error) {
            console.error("Error parsing auth token:", error);
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        this.handleError(error);
        return Promise.reject(error);
      },
    );
  }

  private handleError(error: AxiosError) {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message =
        (error.response.data as any)?.message || "An error occurred";

      switch (status) {
        case 400:
          toast.error("Bad Request", { description: message });
          break;
        case 401:
          toast.error("Unauthorized", { description: "Please login again" });
          // Could trigger logout here
          break;
        case 403:
          toast.error("Forbidden", {
            description: "You do not have permission",
          });
          break;
        case 404:
          toast.error("Not Found", { description: message });
          break;
        case 500:
          toast.error("Server Error", {
            description: "Please try again later",
          });
          break;
        default:
          toast.error("Error", { description: message });
      }
    } else if (error.request) {
      // Request made but no response
      toast.error("Network Error", {
        description: "Unable to connect to server",
      });
    } else {
      // Error in request setup
      toast.error("Error", { description: error.message });
    }
  }

  async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    try {
      const response = await this.api.get<T>(url, config);
      if (config?.showSuccess) {
        toast.success(config.successMessage || "Success");
      }
      return response.data;
    } catch (error) {
      if (config?.showError !== false) {
        // Error already handled in interceptor
      }
      throw error;
    }
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> {
    try {
      const response = await this.api.post<T>(url, data, config);
      if (config?.showSuccess) {
        toast.success(config.successMessage || "Success");
      }
      return response.data;
    } catch (error) {
      if (config?.showError !== false) {
        // Error already handled in interceptor
      }
      throw error;
    }
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> {
    try {
      const response = await this.api.put<T>(url, data, config);
      if (config?.showSuccess) {
        toast.success(config.successMessage || "Success");
      }
      return response.data;
    } catch (error) {
      if (config?.showError !== false) {
        // Error already handled in interceptor
      }
      throw error;
    }
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> {
    try {
      const response = await this.api.patch<T>(url, data, config);
      if (config?.showSuccess) {
        toast.success(config.successMessage || "Success");
      }
      return response.data;
    } catch (error) {
      if (config?.showError !== false) {
        // Error already handled in interceptor
      }
      throw error;
    }
  }

  async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    try {
      const response = await this.api.delete<T>(url, config);
      if (config?.showSuccess) {
        toast.success(config.successMessage || "Success");
      }
      return response.data;
    } catch (error) {
      if (config?.showError !== false) {
        // Error already handled in interceptor
      }
      throw error;
    }
  }

  // Method to update base URL if needed
  setBaseURL(baseURL: string) {
    this.api.defaults.baseURL = baseURL;
  }

  // Method to set custom headers
  setHeader(key: string, value: string) {
    this.api.defaults.headers.common[key] = value;
  }

  // Get the axios instance for advanced usage
  getInstance(): AxiosInstance {
    return this.api;
  }
}

export const appRequest = new AppRequest();
export default appRequest;
