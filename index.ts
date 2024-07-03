import app from "./src/app";
import { Config } from "@config";

const server = Bun.serve({
  fetch: app.fetch,
  port: Config.PORT,
});

console.log(`Server is running on port: ${server.port}`);
