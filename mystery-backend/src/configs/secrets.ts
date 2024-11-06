import { envOrDefault } from "./env";

const jwtAccessTokenSecret = new TextEncoder().encode(
  envOrDefault("JWT_ACCESS_TOKEN_SECRET") as string
);

const jwtRefreshTokenSecret = new TextEncoder().encode(
  envOrDefault("JWT_REFRESH_TOKEN_SECRET") as string
);

const jwtAccessTokenName = envOrDefault("JWT_ACCESS_TOKEN_NAME") as string;
const jwtRefreshTokenName = envOrDefault("JWT_REFRESH_TOKEN_NAME") as string;

const jwtAccessTokenDuration = envOrDefault(
  "JWT_ACCESS_TOKEN_DURATION"
) as string;
const jwtRefreshTokenDuration = envOrDefault(
  "JWT_REFRESH_TOKEN_DURATION"
) as string;

const secrets = {
  jwtAccessTokenSecret,
  jwtRefreshTokenSecret,
  jwtAccessTokenName,
  jwtRefreshTokenName,
  jwtAccessTokenDuration,
  jwtRefreshTokenDuration,
};

export default secrets;
