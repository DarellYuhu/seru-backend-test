import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "This is SERU backend test api" });
});

export default app;
