import express from "express";
import { client, connectOrExit, envOrDefault, morgan } from "./src/configs";
import { authController, userController } from "./src/controllers";
import { users } from "./src/data/users.json";
import { UserService } from "./src/services/UserService";
import cookieParser from "cookie-parser";

// Set up middleware
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan);

// Ensure connection to DB
await connectOrExit(client);
await client.connect();

// Run any startup code
await UserService.createUsers(users);

// Set up endpoints
app.use("/users", userController);
app.use("/auth", authController);

const port = envOrDefault("APP_PORT");
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
