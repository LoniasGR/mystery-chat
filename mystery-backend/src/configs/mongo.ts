import { MongoClient } from "mongodb";

import { envOrDefault } from "./env";

const username = envOrDefault("MONGO_USERNAME");
const password = envOrDefault("MONGO_PASSWORD");
const port = envOrDefault("MONGO_PORT");
const host = envOrDefault("MONGO_HOST");
const dbName = envOrDefault("MONGO_DATABASE");
const connectionString = `mongodb://${username}:${password}@${host}:${port}`;
const client = new MongoClient(connectionString);

console.log("Connecting to MongoDB...");
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

export { client, db, testConnection, connectOrExit };
