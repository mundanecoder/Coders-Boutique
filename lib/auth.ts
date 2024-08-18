// src/lib/auth.ts

import { AxiosResponse } from "axios";
import { ApiClient, AxiosApiClient } from "./apiClient";

const apiClient: ApiClient = new AxiosApiClient();

export const register = (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => apiClient.register(data);

export const login = (data: { email: string; password: string }) =>
  apiClient.login(data);

export const refresh = (data: { refreshToken: string }) =>
  apiClient.refresh(data);

export const logout = () => {
  apiClient.logout();
  // Clear tokens from memory
};

export const requestPasswordReset = (email: string): Promise<AxiosResponse> =>
  apiClient.forgotPassword(email);

export const resetPassword = (
  token: string,
  newPassword: string
): Promise<AxiosResponse> => apiClient.resetPassword(token, newPassword);
