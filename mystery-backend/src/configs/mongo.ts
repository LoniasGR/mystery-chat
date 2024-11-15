import { envOrDefault } from "@/configs/env";
import { MongoClient } from "mongodb";

const username = envOrDefault<string>("MONGO_USERNAME", "");
const password = envOrDefault<string>("MONGO_PASSWORD", "");
const port = envOrDefault<number>("MONGO_PORT", 27017);
const host = envOrDefault<string>("MONGO_HOST", "localhost");
const dbName = envOrDefault<string>("MONGO_DATABASE");
const connectionString = envOrDefault<string>(
  "MONGO_CONNECTION_URL",
  `mongodb://${username}:${password}@${host}:${port}`
);

const client = new MongoClient(connectionString);

console.log(`Connecting to MongoDB: ${connectionString}`);
const db = client.db(dbName as string);

async function testConnection(client: MongoClient) {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function connectOrExit(client: MongoClient) {
  try {
    await testConnection(client);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

export { client, connectOrExit, db, testConnection };
