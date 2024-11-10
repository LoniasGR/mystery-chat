import client from "./client";

export const login = (loginData: LoginPayload) => {
  return client.post<Pick<LoginPayload, "username">>("/auth/login", loginData);
};

export const logout = () => {
  return client.post<unknown>("/auth/logout");
};

type LoginPayload = {
  username: string;
  password: string;
};
