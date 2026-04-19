import { createUserJson, findUserJson } from "@/lib/auth/user-store-json";
import { createUserMongo, findUserMongo } from "@/lib/auth/user-store-mongo";
import type { StoredUser } from "@/lib/auth/user-types";

export type { StoredUser } from "@/lib/auth/user-types";

function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI?.trim());
}

/** Usuario por nombre (MongoDB si `MONGODB_URI`, si no `data/users.json`). */
export async function findUser(username: string): Promise<StoredUser | undefined> {
  if (isMongoConfigured()) {
    return findUserMongo(username);
  }
  return findUserJson(username);
}

/** Alta de usuario (misma fuente que `findUser`). */
export async function createUser(
  username: string,
  passwordHash: string
): Promise<StoredUser> {
  if (isMongoConfigured()) {
    return createUserMongo(username, passwordHash);
  }
  return createUserJson(username, passwordHash);
}
