import { SignJWT, jwtVerify } from "jose";

import { getJwtSecretKey } from "@/lib/auth/secret";

const ISS = "frontend-academy";
const AUD = "web";

export async function signSessionToken(username: string): Promise<string> {
  const key = getJwtSecretKey();
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(username)
    .setIssuedAt()
    .setIssuer(ISS)
    .setAudience(AUD)
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifySessionToken(token: string) {
  const key = getJwtSecretKey();
  return jwtVerify(token, key, {
    issuer: ISS,
    audience: AUD,
    algorithms: ["HS256"],
  });
}
