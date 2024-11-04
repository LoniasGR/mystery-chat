import express from "express";
import { client, db, testConnection, envOrDefault } from "./src/configs";
import { authController, userController } from "./src/controllers";
import { UsersRepository } from "./src/repositories/userRepository";

const app = express();
app.use(express.json());

try {
  await testConnection(client);
} catch (err) {
  console.error(err);
  process.exit(1);
}

await client.connect();
const userRepository = new UsersRepository(db);
userRepository.insert();

app.use("/users", userController);
app.use("/auth", authController);

const port = envOrDefault("APP_PORT");
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
