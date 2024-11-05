import { NextFunction, Request, Response } from "express";
import * as jose from "jose";
import { jwtSecret } from "../configs/secrets";

export async function ensureValidJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const jwt = req.cookies["mysterious-token"];
  if (jwt == undefined) {
    return res
      .status(401)
      .json("Go away you little elfish person. Go to login page!");
  }

  const { payload } = await jose.jwtVerify(jwt, jwtSecret);

  // JWT payload is in s, date wants ms
  const expDate = new Date(payload.exp! * 1000);

  // The expiration date has passed
  if (new Date() > expDate) {
    return res.status(401).json("Your time has expired. Login again!");
  }
  next();
}
