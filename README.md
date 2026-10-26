# KANSO Smart Interiors

KANSO is an AI-powered interior-design and consultation platform. A homeowner captures all four walls of a real room, selects a room type, style, budget, and location, and receives spatially grounded redesign concepts. The customer can compare, like, save, and select a concept, then route it to an eligible interior specialist as a qualified consultation lead.

The product serves homeowners, interior businesses, and KANSO administrators through independently deployable frontend and backend applications.

## Technology

### Frontend

- Next.js 16 with App Router and React 19
- TypeScript
- Tailwind CSS 4
- Supabase browser authentication
- Framer Motion and Motion
- Vercel deployment

### Backend and data

- Python FastAPI and Pydantic 2
- Supabase PostgreSQL, Auth, and private Storage
- Gemini spatial image analysis
- Pluggable image-generation providers
- Database-backed generation worker
- Render web-service and background-worker deployment

## Architecture

```text
Browser
  |
  | HTTPS; /api/*; Supabase bearer token
  v
Next.js on Vercel
  |
  | same-origin external rewrite
  v
FastAPI on Render --------------------+
  |                                   |
  +--> Supabase Auth/JWKS              |
  +--> PostgreSQL generation queue <--+-- Render worker
  +--> Private Supabase Storage        |
  +--> Gemini spatial analysis         |
  +--> Image-generation provider ------+
```

The browser calls relative `/api/...` paths. Next.js rewrites these calls to the Render API using `NEXT_PUBLIC_API_URL`. FastAPI verifies the Supabase access token, resolves roles from `profiles`, and applies resource ownership checks. Backend secrets never enter the frontend bundle.

Generation requests are persisted as `pending` database jobs. A separate Render worker claims jobs atomically with `FOR UPDATE SKIP LOCKED`, records attempts, and requeues stale claims after a crash or restart.

## Repository structure

```text
.
├── apps/
│   ├── web/                    # Next.js application deployed to Vercel
│   │   ├── app/                # App Router pages and layouts
│   │   ├── components/         # Customer, vendor, admin, and UI components
│   │   ├── lib/api/            # Typed FastAPI clients
│   │   ├── lib/supabase/       # Browser/server Supabase clients
│   │   ├── next.config.ts      # API rewrite and image policy
│   │   └── proxy.ts            # Session refresh and route protection
│   └── api/                    # FastAPI service and durable worker
│       ├── app/api/            # Health and versioned API routers
│       ├── app/core/           # Auth, config, errors, and logging
│       ├── app/db/             # Supabase repositories
│       ├── app/schemas/        # Pydantic contracts
│       ├── app/services/       # AI, storage, gating, and inventory
│       └── app/worker.py       # Persistent generation consumer
├── supabase/migrations/        # Ordered PostgreSQL migrations and RLS
├── scripts/                    # Repository verification utilities
├── render.yaml                 # Render web + worker blueprint
├── package.json                # npm workspace commands
└── PRD.md                      # Product requirements
```

## Key features

### Guided four-wall capture

Customers upload north, south, east, and west wall photographs. A unique database constraint makes each angle authoritative and permits safe replacement. Photos are stored in a private bucket and displayed only through signed URLs.

### Spatial AI generation

The pipeline validates ownership and four-wall completeness, creates a Gemini spatial brief, adds room/style/budget/inventory context, and generates the configured number of concepts. KANSO targets five concepts and enforces the PRD-supported range of four to six.

### Design interactions

Customers can like, save, and select concepts. Like/save toggles execute atomically in PostgreSQL. `room_projects.selected_design_id` is the single source of truth for the one selected design per project.

### Consultation routing

A consultation requires an owned project and selected design. PostgreSQL enforces one consultation per project, making repeated or concurrent submissions safe. Eligible specialists are matched by availability and location; unmatched requests remain in the administrator queue.

### Business and administration portals

Role-protected FastAPI endpoints provide assigned leads to business owners with server-side contact masking and expose users, businesses, leads, disputes, assignments, verification, and moderation to administrators.

## Prerequisites

- Node.js 20+
- npm
- Python 3.13
- A Supabase project
- Gemini credentials
- Credentials for the selected image-generation provider, where required

## Environment variables

Never commit real `.env` files. Values prefixed with `NEXT_PUBLIC_` are public and embedded into frontend builds. Service-role keys, JWT secrets, and AI credentials belong only in Render.

### Frontend — `apps/web/.env.local`

Copy `apps/web/.env.example`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

### Backend — `apps/api/.env`

Copy `apps/api/.env.example`:

```env
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=INFO
API_V1_PREFIX=/api

CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_PRIVATE_SERVICE_ROLE_KEY
# Only for legacy HS256 Supabase projects:
SUPABASE_JWT_SECRET=

ROOM_PHOTOS_BUCKET=room-photos
GENERATED_DESIGNS_BUCKET=generated-designs

GEMINI_API_KEY=
GEMINI_VISION_MODEL=gemini-3.6-flash
IMAGE_GENERATOR_PROVIDER=pollinations
HUGGINGFACE_API_TOKEN=
HUGGINGFACE_IMAGE_MODEL=black-forest-labs/FLUX.1-schnell
REPLICATE_API_TOKEN=
FLUX_MODEL=black-forest-labs/flux-1.1-pro

DESIGNS_PER_GENERATION=5
GENERATION_TIMEOUT_SECONDS=180
ENABLE_CARD_GATING=false
ENABLE_DAILY_QUOTA_LIMIT=false
DAILY_ROOM_LIMIT=3
DAILY_RENDER_LIMIT=12
```

The service-role key bypasses Row Level Security. Never give it a `NEXT_PUBLIC_` prefix or expose it to Vercel client code.

## Database setup

Apply every SQL file in `supabase/migrations` in filename order. The migrations create the application schema, private-resource policies, uniqueness invariants, atomic interaction function, durable job claim function, and moderation audit log.

Create private Storage buckets matching:

```text
room-photos
generated-designs
```

Verify migration ordering:

```bash
python scripts/verify_migration_order.py
```

## Local development

Install frontend dependencies from the repository root:

```bash
npm ci
```

Create the backend environment and start the API:

```bash
cd apps/api
python -m venv .venv
# Windows: .\.venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

In a second terminal, start the durable worker:

```bash
cd apps/api
python -m app.worker
```

Start Next.js from the repository root:

```bash
npm run dev
```

Local URLs:

- Frontend: `http://localhost:3000`
- API: `http://127.0.0.1:8000`
- Health: `http://127.0.0.1:8000/health`
- Development OpenAPI: `http://127.0.0.1:8000/docs`

## Quality checks

```bash
npm run typecheck:web
npm run lint:web
npm run build:web
python -m compileall apps/api/app
```

## API conventions

The API is mounted at `/api/v1`. Authenticated requests use:

```http
Authorization: Bearer <supabase-access-token>
```

Core routes include:

```text
POST /api/v1/projects
GET  /api/v1/projects/{project_id}
POST /api/v1/projects/{project_id}/photos
POST /api/v1/projects/{project_id}/generate
POST /api/v1/projects/{project_id}/select-design
POST /api/v1/designs/{design_id}/like
POST /api/v1/designs/{design_id}/save
POST /api/v1/consultations
GET  /api/v1/business/leads
GET  /api/v1/admin/users
GET  /api/v1/admin/businesses
GET  /api/v1/admin/leads
```

Errors use one envelope:

```json
{
  "error": {
    "code": "validation_error",
    "message": "Request payload failed validation.",
    "details": {}
  }
}
```

## Deploying to Vercel

1. Import the repository and set the project Root Directory to `apps/web`.
2. Select the Next.js preset.
3. Configure `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Set `NEXT_PUBLIC_API_URL` to the Render web-service origin without a trailing slash.
5. Deploy, then smoke-test the `/api` rewrite.

Public variables are frozen during `next build`; redeploy after changing them.

## Deploying to Render

Create a Blueprint from `render.yaml`. It provisions:

- `kanso-api`: the FastAPI web service with `/health` monitoring.
- `kanso-generation-worker`: the persistent database-backed generation consumer.
- A shared secret environment-variable group for both processes.

Populate all `sync: false` values in Render, apply migrations before accepting traffic, and set `CORS_ORIGINS` to the exact production Vercel/custom origins. The configured preview regex accepts only hosts belonging to the KANSO Vercel project.

After Render deploys, set its HTTPS origin as Vercel’s `NEXT_PUBLIC_API_URL` and rebuild the frontend.

## Product documentation

See [`PRD.md`](./PRD.md) for product scope, user journeys, data relationships, security requirements, edge cases, testing expectations, and acceptance criteria.

## License

Add the chosen project license before public distribution.
