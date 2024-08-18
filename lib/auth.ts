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

export const refresh = (data: { accessToken: string }) =>
  apiClient.refresh(data);

export const logout = () => {
  return apiClient.logout();
};

export const getAllUsers = (params?: {
  page?: number;
  limit?: number;
}): Promise<AxiosResponse> => {
  const { page, limit } = params || {};
  return apiClient.getAllUsers(page, limit);
};
export const getUserById = (userId: string) => {
  return apiClient.getUserById({ id: userId });
};

export const deleteUserById = (userId: string) => {
  return apiClient.deleteUserById({ id: userId });
};
export const requestPasswordReset = (email: string): Promise<AxiosResponse> =>
  apiClient.forgotPassword(email);

export const resetPassword = (
  token: string,
  newPassword: string
): Promise<AxiosResponse> => apiClient.resetPassword(token, newPassword);
