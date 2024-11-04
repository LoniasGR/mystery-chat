import "./env.ts";
import { client, db, testConnection } from "./mongo.ts";
import { envOrDefault } from "./env";

export { client, db, testConnection, envOrDefault };
