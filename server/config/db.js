import { MongoClient } from "mongodb";

export const client = new MongoClient("mongodb://admin:admin@54.242.40.241/storageApp?authSource=admin");

export async function connectDB() {
  await client.connect();
  const db = client.db("storageApp"); // 👈 Explicitly specify database
  console.log("Database connected:", db.databaseName);
  return db;
}

process.on("SIGINT", async () => {
  await client.close();
  console.log("Client Disconnected!");
  process.exit(0);
});

