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
// __dirname is artifacts/api-server/dist at runtime; resolve up to the frontend build
const staticDir = path.resolve(__dirname, "../../conversation-coach/dist/public");
console.log("[startup] __dirname:", __dirname);
console.log("[startup] staticDir:", staticDir);
console.log("[startup] staticDir exists:", existsSync(staticDir));
if (existsSync(staticDir)) {
  console.log("[startup] files:", readdirSync(staticDir));
  app.use(express.static(staticDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
}

export default app;
