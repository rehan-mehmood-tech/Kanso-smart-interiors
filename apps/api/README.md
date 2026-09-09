# Kanso API

FastAPI service backing the Kanso platform: room projects, wall-photo storage,
the AI generation pipeline, consultation leads, and the business/admin surfaces.

## Run it

```bash
cd apps/api
python -m venv .venv
.venv/Scripts/activate            # Windows;  source .venv/bin/activate on macOS/Linux
pip install -r requirements.txt
cp .env.example .env              # optional -- the service boots without it
uvicorn app.main:app --reload --port 8000
```

| | |
|---|---|
| Liveness | http://localhost:8000/health |
| Interactive docs | http://localhost:8000/docs |
| OpenAPI schema | http://localhost:8000/openapi.json |

Docs and the schema are disabled when `ENVIRONMENT=production`.

## Configuration

All settings come from the environment, loaded from `.env` in development —
see [.env.example](.env.example) for the full list.

Every credential is **optional**, so the service boots on a fresh clone with no
secrets. Anything that needs one asks through `settings.require_*()`, which
fails at call time with a `503 not_configured` naming the missing variable,
rather than at import time. `/health` reports which providers are configured
(presence only, never values):

```json
{"status":"ok","version":"0.2.0","environment":"development",
 "configured":{"supabase":false,"gemini":false,"replicate":false}}
```

`SUPABASE_SERVICE_ROLE_KEY` bypasses row-level security. It is server-side only
and must never reach the browser or a Next.js client component.

## Layout

```
app/
  main.py              application factory: CORS, middleware, error handlers, routers
  api/
    router.py          aggregates every route group under /api
    deps.py            authentication + role guards
    routes/            health, auth, projects, leads, business, admin
  core/
    config.py          settings and the require_* credential helpers
    errors.py          ApiError hierarchy and the single error envelope
    logging.py         log config + per-request X-Request-ID
    supabase.py        service-role and per-user client factories
  schemas/
    enums.py           controlled vocabularies, mirroring the PRD data model
    common.py          response envelopes, CurrentUser
  services/            (next slices land here — see its docstring)
```

## Conventions

**Errors.** Every failure returns one shape, so the client branches on `code`
rather than parsing prose:

```json
{"error": {"code": "not_found", "message": "...", "details": {}}}
```

`validation_error` (422), `not_configured` (503), `not_implemented` (501),
`unauthorized`, `forbidden`, `conflict`, `internal_error`. Unhandled exceptions
are logged with a traceback and returned as a bare `internal_error` — no
internals reach the caller.

**Request tracing.** Each request carries an `X-Request-ID` (honoured if the
caller sends one, generated otherwise), echoed on the response and stamped into
every log line for that request.

**Two Supabase clients.** `get_service_client()` bypasses RLS and is only for
trusted server work; `get_user_client(token)` acts as the caller so Postgres RLS
enforces ownership. Prefer the latter for anything touching a customer's rows.

## State

The full MVP URL surface from PRD §18 is declared — 27 endpoints plus
`/health` — and each handler returns `501 not_implemented` with the slice it
belongs to. The routes are real, the shapes are fixed, the behaviour is not
built. **Nothing is authenticated yet:** `get_current_user` refuses every
request rather than defaulting to a permissive stub, and no route has a guard
attached, so no route can serve data. Guards attach per route as each slice
lands.

Still to build: the Supabase schema and RLS migrations, storage service, the
Gemini→Flux generation pipeline, and every handler body.
