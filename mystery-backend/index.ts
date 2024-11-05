import express from "express";
import { client, testConnection, envOrDefault } from "./src/configs";
import { authController, userController } from "./src/controllers";
import { users } from "./src/data/users.json";
import { UserService } from "./src/services/UserService";

const app = express();
app.use(express.json());

try {
  await testConnection(client);
} catch (err) {
  console.error(err);
  process.exit(1);
}

await client.connect();

await UserService.createUsers(users);

app.use("/users", userController);
app.use("/auth", authController);

const port = envOrDefault("APP_PORT");
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
