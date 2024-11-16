import {
  type InternalAxiosRequestConfig,
  AxiosError,
  isAxiosError,
} from "axios";
import client from "./client";
import socket from "@/lib/socket";
import { useLogoutMutation } from "@/hooks/auth";
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

// TODO: Peak error handling here, a little bit of thought is needed on how to handle this
// docs: https://socket.io/docs/v4/troubleshooting-connection-issues/#troubleshooting-steps
socket.on("connect_error", (error) => {
  console.log(JSON.stringify(error));
  refreshToken()
    .then((ret) => {
      if (socket.active) {
        // temporary failure, the socket will automatically try to reconnect
      } else {
        // the connection was denied by the server
        // in that case, `socket.connect()` must be manually called in order to reconnect
        socket.connect();
      }
    })
    .catch((err) => {
      console.log(err);
      logout();
      socket.close();
    });
});
