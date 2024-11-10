import { NextFunction, Request, Response } from "express";
import { secrets } from "../configs";
import { verifyJwt } from "../utils/jwtUtils";
import {
  handleExpired,
  handleForbidden,
  handleUnauthorized,
} from "../utils/controllerUtils";

export async function ensureValidJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const jwt = req.cookies[secrets.jwtAccessTokenName];
  const refreshToken = req.cookies[secrets.jwtRefreshTokenName];

  if (!jwt && !refreshToken) {
    handleUnauthorized(res);
    return;
  }

  if (!jwt) {
    handleForbidden(res);
    return;
  }

  const verification = await verifyJwt(jwt);

  if (verification.status === "success") {
    req.username = verification.payload.username;
    return next();
  }

  if (verification.status === "expired") {
    handleExpired(res);
    return;
  }

  const error = verification.error;
  const details = error instanceof Error ? error.message : String(error);
  if (refreshToken) {
    handleForbidden(res, details);
    return;
  }
  handleUnauthorized(res, details);
}
