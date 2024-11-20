import socket from "@/lib/socket";
import {
  type InternalAxiosRequestConfig,
  AxiosError,
  isAxiosError,
} from "axios";
import client from "./client";
import { logout } from "./auth";

let isRefreshing = false;
let retryQueue: {
  reject: (error: Error | AxiosError | unknown) => void;
  resolve: (value?: unknown) => void;
}[] = [];

const refreshToken = async () => {
  return client.post("/auth/refresh");
};

const processQueue = (error: Error | AxiosError | null | unknown) => {
  retryQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  retryQueue = [];
};

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }

    const response = error.response;
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (response?.status !== 403 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      try {
        await new Promise((resolve, reject) =>
          retryQueue.push({ resolve, reject })
        );
        return client.request(originalRequest);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await refreshToken();
      processQueue(null);
      isRefreshing = false;
      return client(originalRequest);
    } catch (e) {
      processQueue(e);
      throw e;
    }
  }
);

// docs: https://socket.io/docs/v4/troubleshooting-connection-issues/#troubleshooting-steps
export const handleSocketAuthErrors = (onUnauthorized: () => void) => {
  async function errorHandler() {
    try {
      await refreshToken();

      if (!socket.active) {
        socket.connect();
      }
    } catch {
      logout();
      socket.close();
      onUnauthorized();
    }
  }

  socket.on("connect_error", errorHandler);
  return errorHandler;
};

export const handleAxiosUnauthorized = (onUnauthorized: () => void) =>
  client.interceptors.response.use(
    (res) => res,
    async (error) => {
      if (!isAxiosError(error)) {
        return Promise.reject(error);
      }

      const response = error.response;

      if (response?.status !== 401) {
        return Promise.reject(error);
      }

      logout();
      onUnauthorized();
    }
  );

export const clearAxiosMiddleware = (middlewareId: number) =>
  client.interceptors.response.eject(middlewareId);

export const clearSocketMiddleware = (handlerRef: (error: Error) => void) =>
  socket.off("connect_error", handlerRef);
