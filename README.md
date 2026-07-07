# Conversation Coach

Upload a conversation recording and get coaching feedback: talk ratio, questions, interruptions, tone, and a transcript.

## Stack

| Layer | Host |
|-------|------|
| React SPA | Cloudflare Pages (static assets via Wrangler) |
| API (`POST /api/analyze`, `GET /api/healthz`) | Cloudflare Worker (same project) |
| Transcription | [AssemblyAI](https://www.assemblyai.com/) REST API (fetch-only, no Node SDK) |

The shared analysis logic lives in `lib/conversation-analysis` and runs in both the Express dev server and the Worker.

## Local development

```bash
pnpm install

# Terminal 1 — API (mock data without ASSEMBLYAI_API_KEY)
PORT=5000 pnpm --filter @workspace/api-server dev

# Terminal 2 — frontend (proxies /api if configured, or set VITE_API_URL)
pnpm --filter @workspace/conversation-coach dev
```

Set `ASSEMBLYAI_API_KEY` in the environment to use real transcription locally.

## Tests

```bash
pnpm test:analysis
```

On first install, if pnpm reports ignored build scripts, run `pnpm approve-builds` and allow `esbuild` (needed for `tsx` tests).

## Deploy to Cloudflare (Render-free)

1. Install [Wrangler](https://developers.cloudflare.com/workers/wrangler/) and log in (`wrangler login`).
2. Build the SPA: `pnpm build:web`
3. Set the AssemblyAI secret (optional — omit for demo/mock mode):
   ```bash
   wrangler secret put ASSEMBLYAI_API_KEY
   ```
4. Deploy: `pnpm deploy:cf`

### Workers limits

AssemblyAI upload + polling can take **1–3+ minutes** for longer clips. Cloudflare Workers **Paid** ($5/mo) is recommended so requests are not cut off by free-tier CPU limits. Short clips often work on the free tier when `ASSEMBLYAI_API_KEY` is set.

If you hit timeouts on long files, either upgrade Workers or run the Express API on Fly.io/Render and point the SPA at that URL.

## Environment

| Variable | Where | Purpose |
|----------|-------|---------|
| `ASSEMBLYAI_API_KEY` | Worker secret / local env | Real transcription; omit for mock demo data |
| `PORT` | Express only | Dev/prod Node server port |

No database is required (the `lib/db` package is unused by the app).
