import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import { existsSync } from "fs";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Debug endpoint
app.get("/debug", (_req, res) => {
  const cwd = process.cwd();
  const dir = path.join(cwd, "artifacts/conversation-coach/dist/public");
  const exists = existsSync(dir);
  const files = exists ? require("fs").readdirSync(dir) : [];
  res.json({ cwd, dir, exists, files });
});

// Serve React frontend in production
const staticDir = path.join(process.cwd(), "artifacts/conversation-coach/dist/public");
if (existsSync(staticDir)) {
  app.use(express.static(staticDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
}

export default app;
