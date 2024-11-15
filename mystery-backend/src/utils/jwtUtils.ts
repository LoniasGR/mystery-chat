import * as jose from "jose";
import { secrets } from "@/configs";

export async function verifyJwt(
  jwt: string,
  secret: Uint8Array = secrets.jwtAccessTokenSecret
): ReturnType {
  try {
    const { payload } = await jose.jwtVerify<Payload>(jwt, secret);

    // JWT payload is in s, date wants ms
    const expDate = new Date(payload.exp! * 1000);

    // The expiration date has passed
    if (new Date() > expDate) {
      return { status: "expired", expDate };
    }

    return { status: "success", payload };
  } catch (error) {
    return { status: "verification-error", error };
  }
}

type ReturnType = Promise<
  | {
      status: "success";
      payload: Payload;
    }
  | {
      status: "expired";
      expDate: Date;
    }
  | {
      status: "verification-error";
      error: unknown;
    }
>;

type Payload = jose.JWTPayload & {
  username: string;
};
