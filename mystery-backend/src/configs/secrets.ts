import { envOrDefault } from "./env";

const jwtAccessTokenSecret = new TextEncoder().encode(
  envOrDefault<string>("JWT_ACCESS_TOKEN_SECRET")
);

const jwtRefreshTokenSecret = new TextEncoder().encode(
  envOrDefault<string>("JWT_REFRESH_TOKEN_SECRET")
);

const jwtAccessTokenName = envOrDefault<string>(
  "JWT_ACCESS_TOKEN_NAME",
  "mystery-token"
);
const jwtRefreshTokenName = envOrDefault<string>(
  "JWT_REFRESH_TOKEN_NAME",
  "mystery-refresh-token"
);

const jwtAccessTokenDuration = envOrDefault<string>(
  "JWT_ACCESS_TOKEN_DURATION",
  "15m"
);
const jwtRefreshTokenDuration = envOrDefault<string>(
  "JWT_REFRESH_TOKEN_DURATION",
  "5d"
);

const secrets = {
  jwtAccessTokenSecret,
  jwtRefreshTokenSecret,
  jwtAccessTokenName,
  jwtRefreshTokenName,
  jwtAccessTokenDuration,
  jwtRefreshTokenDuration,
};

export default secrets;
