import { envOrDefault } from "./env";

const jwtAccessTokenSecret = new TextEncoder().encode(
  envOrDefault<string>("JWT_ACCESS_TOKEN_SECRET")
);

const jwtRefreshTokenSecret = new TextEncoder().encode(
  envOrDefault<string>("JWT_REFRESH_TOKEN_SECRET")
);

const jwtAccessTokenName = envOrDefault<string>("JWT_ACCESS_TOKEN_NAME");
const jwtRefreshTokenName = envOrDefault<string>("JWT_REFRESH_TOKEN_NAME");

const jwtAccessTokenDuration = envOrDefault<string>(
  "JWT_ACCESS_TOKEN_DURATION"
);
const jwtRefreshTokenDuration = envOrDefault<string>(
  "JWT_REFRESH_TOKEN_DURATION"
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
