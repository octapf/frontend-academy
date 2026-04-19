import { MongoClient, type MongoClientOptions } from "mongodb";

import { normalizeMongoUri } from "@/lib/auth/mongo-uri";

const globalForMongo = globalThis as typeof globalThis & {
  __feaMongoClientPromise?: Promise<MongoClient>;
};

const clientOptions: MongoClientOptions = {
  serverSelectionTimeoutMS: 15_000,
  maxPoolSize: 10,
  appName: "frontend-academy",
};

function getUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri?.trim()) {
    throw new Error("MONGODB_URI is not set");
  }
  return normalizeMongoUri(uri);
}

/**
 * Cliente compartido (serverless-friendly).
 * Si `connect()` falla, no dejamos una promesa rechazada en global: el siguiente request reintenta
 * (útil tras corregir MONGODB_URI en Vercel sin esperar cold start).
 */
export function getMongoClientPromise(): Promise<MongoClient> {
  if (!globalForMongo.__feaMongoClientPromise) {
    const client = new MongoClient(getUri(), clientOptions);
    const connected = client.connect();
    globalForMongo.__feaMongoClientPromise = connected.catch(async (err) => {
      globalForMongo.__feaMongoClientPromise = undefined;
      try {
        await client.close();
      } catch {
        /* ignore */
      }
      throw err;
    });
  }
  return globalForMongo.__feaMongoClientPromise;
}

export async function getMongoDb() {
  const client = await getMongoClientPromise();
  const name = process.env.MONGODB_DB?.trim();
  if (name) {
    return client.db(name);
  }
  return client.db();
}
