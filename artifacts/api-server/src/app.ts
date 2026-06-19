import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import { existsSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import router from "./routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Serve React frontend in production
const cwd = process.cwd();
const staticDir = path.resolve(__dirname, "../../conversation-coach/dist/public");
const staticDirAlt = path.join(cwd, "artifacts/conversation-coach/dist/public");

console.log("[startup] cwd:", cwd);
console.log("[startup] __dirname:", __dirname);
console.log("[startup] staticDir:", staticDir, "exists:", existsSync(staticDir));
console.log("[startup] staticDirAlt:", staticDirAlt, "exists:", existsSync(staticDirAlt));

const serveDir = existsSync(staticDir) ? staticDir : existsSync(staticDirAlt) ? staticDirAlt : null;

if (serveDir) {
  console.log("[startup] serving static from:", serveDir);
  app.use(express.static(serveDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(serveDir, "index.html"));
  });
} else {
  // Diagnostic page when static files are missing (Vite build didn't run or path is wrong)
  app.get("*", (_req, res) => {
    const artifacts = existsSync(path.join(cwd, "artifacts")) ? readdirSync(path.join(cwd, "artifacts")) : "missing";
    res.json({
      error: "no-static-files",
      cwd,
      __dirname,
      staticDir,
      staticDirAlt,
      artifacts,
    });
  });
}

export default app;
