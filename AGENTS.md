# AGENTS.md

## Project

**Eszuri Public Local Storage** — Express 5 file manager with a single-page HTML frontend. Manages files on disk via REST API with path-traversal protection.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with hot reload (tsx watch) |
| `npm run online` | Dev server + bore tunnel (port 3000) |
| `npm run typecheck` | TypeScript check (no emit) |
| `npm run build` | Production bundle via tsup → `build/` |
| `npm start` | Run production bundle |
| `npm run public` | Expose via untun tunnel |

**There are no tests.** `npm test` just runs the app once (no watch).

## Architecture

- **Backend**: `src/index.ts` — single file, all Express routes and middleware
- **Frontend**: `src/client/index.html` — single-file SPA, no build step, served as static
- **Build output**: `build/` (gitignored), ESM format, Node 18+ target
- **Module system**: ESM (`"type": "module"`)

## Key Gotchas

- `PORT` is hardcoded to `4000` in `src/index.ts:14` — not read from `.env`
- `.env` key `STORAGE_PATH` controls which directory the app manages
- Path alias `@/*` → `src/*` is in tsconfig but **not configured in tsup** — will break at runtime after build
- `package-lock.json` is gitignored (unusual)
- No linter or formatter configured
- Express 5 (not 4) — handler signatures and error handling differ
- `runtime/` contains platform-specific tunnel binaries (cloudflared)

## Verification Order

`npm run typecheck` → `npm run build` → `npm start`
