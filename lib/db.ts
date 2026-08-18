import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "portfolio";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set");
}

let cachedDb: typeof mongoose | null = null;

export async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  cachedDb = await mongoose.connect(MONGODB_URI!, { dbName: DB_NAME });
  console.log(`Connected to MongoDB (db: ${DB_NAME})`);
  return cachedDb;
}