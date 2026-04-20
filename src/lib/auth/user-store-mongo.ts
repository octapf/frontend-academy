import type { Document } from "mongodb";

import { getMongoDb } from "@/lib/auth/mongo-client";
import type { StoredUser } from "@/lib/auth/user-types";

const DEFAULT_COLLECTION = "users";
const DEFAULT_USER_FIELD = "username";
const DEFAULT_PASS_FIELD = "passwordHash";

function collectionName() {
  return process.env.MONGODB_USERS_COLLECTION?.trim() || DEFAULT_COLLECTION;
}

function usernameField() {
  return process.env.MONGODB_USERNAME_FIELD?.trim() || DEFAULT_USER_FIELD;
}

function passwordField() {
  return process.env.MONGODB_PASSWORD_FIELD?.trim() || DEFAULT_PASS_FIELD;
}

function createdAtField() {
  return process.env.MONGODB_CREATED_AT_FIELD?.trim() || "createdAt";
}

function docToStoredUser(doc: Document): StoredUser {
  const uf = usernameField();
  const pf = passwordField();
  const cf = createdAtField();
  const username = String(doc[uf] ?? "");
  const passwordHash = String(doc[pf] ?? "");
  const rawCreated = doc[cf];
  const createdAt =
    typeof rawCreated === "string"
      ? rawCreated
      : rawCreated instanceof Date
        ? rawCreated.toISOString()
        : new Date(0).toISOString();
  return { username, passwordHash, createdAt };
}

export async function findUserMongo(
  username: string
): Promise<StoredUser | undefined> {
  const db = await getMongoDb();
  const coll = db.collection(collectionName());
  const q = { [usernameField()]: username };
  const doc = await coll.findOne(q);
  if (!doc) return undefined;
  return docToStoredUser(doc);
}

export async function createUserMongo(
  username: string,
  passwordHash: string
): Promise<StoredUser> {
  const db = await getMongoDb();
  const coll = db.collection(collectionName());
  const uf = usernameField();
  const pf = passwordField();
  const cf = createdAtField();
  const now = new Date().toISOString();
  const insert: Document = {
    [uf]: username,
    [pf]: passwordHash,
    [cf]: now,
  };
  try {
    const r = await coll.insertOne(insert);
    if (!r.acknowledged) {
      throw new Error("Mongo insert not acknowledged");
    }
  } catch (e: unknown) {
    const code = typeof e === "object" && e && "code" in e ? (e as { code: number }).code : 0;
    if (code === 11000) {
      throw new Error("USERNAME_TAKEN");
    }
    throw e;
  }
  return { username, passwordHash, createdAt: now };
}

export async function updatePasswordHashMongo(
  username: string,
  passwordHash: string
): Promise<void> {
  const db = await getMongoDb();
  const coll = db.collection(collectionName());
  const uf = usernameField();
  const pf = passwordField();
  const r = await coll.updateOne({ [uf]: username }, { $set: { [pf]: passwordHash } });
  if (r.matchedCount === 0) {
    throw new Error("USER_NOT_FOUND");
  }
}
