import { Request } from "express";
import { Bearer } from "permit";
import jwt from "jwt-simple";
import { HttpError } from "./http.error";
import { env } from "./env";

const permit = new Bearer({
  query: "access_token",
});

export type JWTPayload = {
  id: number;
  identity: "admin" | "shop_owner" | "member";
};

export function getJWTPayload(req: Request) {
  let token: string;

  try {
    token = permit.check(req);
  } catch (error) {
    throw new HttpError(401, "missing jwt token");
  }
  if (!token) {
    throw new HttpError(401, "empty jwt token");
  }

  let payload: JWTPayload;
  try {
    payload = jwt.decode(token, env.JWT_SECRET);
  } catch (error) {
    throw new HttpError(403, "invalid jwt token");
  }
  return payload;
}

export function encodeJWT(payload: JWTPayload) {
  return jwt.encode(payload, env.JWT_SECRET);
}
