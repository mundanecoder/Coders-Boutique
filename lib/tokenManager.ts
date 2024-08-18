// src/lib/tokenManager.ts

import { refresh } from "./auth";

let accessToken: string | null = null;
let refreshToken: string | null = null;
let accessTokenExpiry: number | null = null;

export const setTokens = (
  access: string,
  refresh: string,
  expiresIn: number
) => {
  accessToken = access;
  refreshToken = refresh;
  accessTokenExpiry = Date.now() + expiresIn * 1000;
};

export const getAccessToken = async (): Promise<string | null> => {
  if (!accessToken || !refreshToken) {
    return null;
  }

  if (accessTokenExpiry && Date.now() >= accessTokenExpiry - 60000) {
    try {
      const response = await refresh({ refreshToken });
      setTokens(
        response.data.accessToken,
        response.data.refreshToken,
        response.data.expiresIn
      );
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  }

  return accessToken;
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  accessTokenExpiry = null;
};
