import { MongoClient } from "mongodb";

const globalForMongo = globalThis as typeof globalThis & {
  __feaMongoClientPromise?: Promise<MongoClient>;
};

function getUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri?.trim()) {
    throw new Error("MONGODB_URI is not set");
  }
  return uri.trim();
}

/** Cliente compartido (recomendado para Next.js / serverless-friendly reuse en proceso). */
export function getMongoClientPromise(): Promise<MongoClient> {
  if (!globalForMongo.__feaMongoClientPromise) {
    const client = new MongoClient(getUri());
    globalForMongo.__feaMongoClientPromise = client.connect();
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
