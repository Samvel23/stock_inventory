import axios from "axios";
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { apiClient } from "@/api/client/apiClient";
import { refreshAuth } from "../auth/refreshAuth";
import { useUserStore } from "@/stores/useUserStore";
import { redirectToLogin } from "@/utils/auth/redirectToLogin";

interface ICustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface IRefreshCredentials {
  accessToken: string;
  refreshToken: string;
}

let refreshPromise: {
  refreshToken: string;
  promise: Promise<IRefreshCredentials>;
} | null = null;

let isRedirectingToLogin = false;

const refreshAccessToken = async (
  refreshToken: string,
): Promise<IRefreshCredentials> => {
  if (!refreshPromise || refreshPromise.refreshToken !== refreshToken) {
    const promise = refreshAuth(refreshToken)
      .then((response) => {
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        const currentCredentials = useUserStore.getState().credentials;

        if (
          !currentCredentials ||
          currentCredentials.refreshToken !== refreshToken
        ) {
          throw new Error("Authentication state changed during token refresh.");
        }

        const credentials = {
          accessToken,
          refreshToken: newRefreshToken,
        };

        useUserStore.getState().setCredentials(credentials);

        return credentials;
      })
      .finally(() => {
        if (refreshPromise?.promise === promise) {
          refreshPromise = null;
        }
      });

    refreshPromise = { refreshToken, promise };
  }

  return refreshPromise.promise;
};

const handleRefreshFailure = (expectedRefreshToken?: string) => {
  const currentRefreshToken = useUserStore.getState().credentials?.refreshToken;

  if (
    expectedRefreshToken !== undefined &&
    currentRefreshToken !== expectedRefreshToken
  ) {
    return;
  }

  useUserStore.getState().removeCredentials();

  if (!isRedirectingToLogin) {
    isRedirectingToLogin = true;
    redirectToLogin();
  }
};

export const responseInterceptor = (response: AxiosResponse) => {
  return response;
};

export const responseErrorInterceptor = async (error: AxiosError) => {
  const originalRequest = error.config as ICustomAxiosRequestConfig | undefined;

  if (
    error.response?.status !== 401 ||
    !originalRequest ||
    originalRequest._retry
  ) {
    return Promise.reject(error);
  }

  if (
    originalRequest.url
      ?.split("?")[0]
      .replace(/\/+$/, "")
      .endsWith("/auth/login")
  ) {
    return Promise.reject(error);
  }

  originalRequest._retry = true;

  const refreshToken = useUserStore.getState().credentials?.refreshToken;

  if (!refreshToken) {
    handleRefreshFailure();

    return Promise.reject(error);
  }

  try {
    const refreshedCredentials = await refreshAccessToken(refreshToken);

    const currentCredentials = useUserStore.getState().credentials;

    if (
      !currentCredentials ||
      currentCredentials.refreshToken !== refreshedCredentials.refreshToken
    ) {
      return Promise.reject(error);
    }

    return apiClient(originalRequest);
  } catch (refreshError) {
    if (
      axios.isAxiosError(refreshError) &&
      [400, 401, 403].includes(refreshError.response?.status ?? 0)
    ) {
      handleRefreshFailure(refreshToken);
    }

    return Promise.reject(refreshError);
  }
};
