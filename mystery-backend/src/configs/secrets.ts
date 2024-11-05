import { envOrDefault } from "./env";

export const jwtSecret = new TextEncoder().encode(
  envOrDefault("JWT_SECRET") as string
);
