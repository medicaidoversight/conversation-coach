import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import { existsSync, readdirSync } from "fs";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Serve React frontend in production
const cwd = process.cwd();
const staticDir = path.join(cwd, "artifacts/conversation-coach/dist/public");

console.log("[startup] cwd:", cwd);
console.log("[startup] staticDir:", staticDir, "exists:", existsSync(staticDir));

if (existsSync(staticDir)) {
  console.log("[startup] static files:", readdirSync(staticDir).slice(0, 5));
  app.use(express.static(staticDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
} else {
  // Diagnostic page when static files are missing
  app.get("*", (_req, res) => {
    const artifactsPath = path.join(cwd, "artifacts");
    const artifacts = existsSync(artifactsPath) ? readdirSync(artifactsPath) : ["<dir-missing>"];
    const convPath = path.join(cwd, "artifacts/conversation-coach");
    const conv = existsSync(convPath) ? readdirSync(convPath) : ["<dir-missing>"];
    res.json({ error: "no-static-files", cwd, staticDir, artifacts, "artifacts/conversation-coach": conv });
  });
}

export default app;
