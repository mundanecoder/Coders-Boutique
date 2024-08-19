import axios, { AxiosInstance, AxiosResponse } from "axios";
import { getAccessToken } from "./tokenManager";

export const runtime = "edge";

export interface ApiClient {
  register: (data: RegisterData) => Promise<AxiosResponse>;
  login: (data: LoginData) => Promise<AxiosResponse>;
  refresh: (data: RefreshData) => Promise<AxiosResponse>;
  logout: () => Promise<AxiosResponse>;
  forgotPassword: (email: string) => Promise<AxiosResponse>;
  resetPassword: (token: string, newPassword: string) => Promise<AxiosResponse>;
  getUserById: (data: GetUserById) => Promise<AxiosResponse>;
  deleteUserById: (data: DeleteUserById) => Promise<AxiosResponse>;
  getAllUsers: (page?: number, limit?: number) => Promise<AxiosResponse>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RefreshData {
  accessToken: string;
}

interface GetUserById {
  id: string;
}

interface DeleteUserById {
  id: string;
}

export class AxiosApiClient implements ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.request.use(async (config) => {
      const token = await getAccessToken();
      if (token) {
        console.log(token, "api client");
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const token = await getAccessToken();
          if (token) {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return this.client(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async getUserById(data: GetUserById): Promise<AxiosResponse> {
    return this.client.get(`/api/protected/user/${data.id}`);
  }

  async deleteUserById(data: DeleteUserById): Promise<AxiosResponse> {
    return this.client.delete(`/api/protected/user/delete/${data.id}`);
  }

  async getAllUsers(page?: number, limit?: number): Promise<AxiosResponse> {
    const params: Record<string, number> = {};
    if (page !== undefined) params.page = page;
    if (limit !== undefined) params.limit = limit;

    return this.client.get(`/api/protected/user`, { params });
  }
  async register(data: RegisterData): Promise<AxiosResponse> {
    return this.client.post("/api/auth/register", data);
  }

  async login(data: LoginData): Promise<AxiosResponse> {
    return this.client.post("/api/auth/login", data);
  }

  async refresh(data: RefreshData): Promise<AxiosResponse> {
    return this.client.post("/api/auth/refresh", data);
  }

  async logout(): Promise<AxiosResponse> {
    return this.client.post("/api/auth/logout");
  }

  async forgotPassword(email: string): Promise<AxiosResponse> {
    return this.client.post("/api/auth/forgot-password", { email });
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<AxiosResponse> {
    return this.client.post("/api/auth/reset-password", { token, newPassword });
  }
}
