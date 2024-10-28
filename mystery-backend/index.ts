import express from "express";
import { client, testConnection, envOrDefault } from "./src/configs";

const app = express();
app.use(express.json());

try {
  await testConnection(client);
} catch (err) {
  console.error(err);
  process.exit(1);
}

const port = envOrDefault("APP_PORT");
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
