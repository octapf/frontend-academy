import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { StoredUser } from "@/lib/auth/user-types";

type UserFile = {
  users: StoredUser[];
};

const DATA_DIR = path.join(process.cwd(), "data");
const USER_FILE = path.join(DATA_DIR, "users.json");

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readFileSafe(): Promise<UserFile> {
  try {
    const raw = await readFile(USER_FILE, "utf8");
    const parsed = JSON.parse(raw) as UserFile;
    if (!parsed.users || !Array.isArray(parsed.users)) return { users: [] };
    return parsed;
  } catch {
    return { users: [] };
  }
}

export async function findUserJson(
  username: string
): Promise<StoredUser | undefined> {
  const file = await readFileSafe();
  return file.users.find((u) => u.username === username);
}

export async function createUserJson(
  username: string,
  passwordHash: string
): Promise<StoredUser> {
  await ensureDataDir();
  const file = await readFileSafe();
  if (file.users.some((u) => u.username === username)) {
    throw new Error("USERNAME_TAKEN");
  }
  const user: StoredUser = {
    username,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  file.users.push(user);
  await writeFile(USER_FILE, JSON.stringify(file, null, 2), "utf8");
  return user;
}

export async function updateUserPasswordHashJson(
  username: string,
  passwordHash: string
): Promise<void> {
  await ensureDataDir();
  const file = await readFileSafe();
  const idx = file.users.findIndex((u) => u.username === username);
  if (idx < 0) {
    throw new Error("USER_NOT_FOUND");
  }
  const prev = file.users[idx]!;
  file.users[idx] = { ...prev, passwordHash };
  await writeFile(USER_FILE, JSON.stringify(file, null, 2), "utf8");
}
