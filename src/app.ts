import { Hono } from "hono";
import { auth } from "./api";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "This is SERU backend test api" });
});

app.route("/auth", auth);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json<TResponse>(
      { status: "Failed", message: err.message, error: err.cause },
      err.status
    );
  }
  console.log(err);
  return c.json<TResponse>(
    { status: "Failed", message: "Something went wrong", error: err },
    500
  );
});

export default app;
