import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "./env.js";

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

if (process.env.VITEST !== "true") {
  app.listen(env.port, () => {
    console.log(`Backend listening on :${env.port} (${env.nodeEnv})`);
  });
}
