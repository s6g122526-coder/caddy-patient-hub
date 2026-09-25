# Caddy Care — Architecture

## 1. Big picture
```text
 Patient app / Doctor console / Admin (React, TanStack Start)   WhatsApp users
            |  HTTPS (REST + JWT)      | WebSocket (queue)            |
            v                          v                              v
 +---------------------------------------------------------------------------+
 |                 Django 5 + Django REST Framework (API)                     |
 |  apps: accounts | clinics | doctors | appointments | queue | records       |
 |        prescriptions | labs | notifications | ai_assistant | billing       |
 |  Django Channels (WebSocket)     Celery workers (reminders, AI, SMS)       |
 +---------------------------------------------------------------------------+
        |              |               |                |             |
   PostgreSQL 16     Redis        S3 / R2 storage    Google Gemini   SMS/WhatsApp
   (data)       (cache, queue    (reports, PDFs)     API (AI bot)    (Twilio / Meta
                 pub/sub, Celery)                                     Cloud API)
```

## 2. Frontend (exists now)
- **Framework:** TanStack Start v1 (React 19, Vite 7), file routes in `src/routes/`.
- **Styling:** Tailwind v4, tokens in `src/styles.css` ("Warm Clinic" oklch palette, glass utilities).
- **Motion:** `motion` (Framer Motion) + `three` / `@react-three/fiber` for the Caddy mascot.
- **Data today:** mock files `src/lib/profile-data.ts`, `live-visit.ts`, `home-data.ts`, `caddy-store.ts` (localStorage).
- **Data tomorrow:** TanStack Query calling the Django API through one client `src/lib/api/client.ts`. Mock files get replaced one screen at a time (see FRONTEND.md).

| Route | Screen | Role |
|---|---|---|
| `/` | Home (design source of truth) | public |
| `/login`, `/signup` | Auth pages (two-column, NOT modals) | public |
| `/onboarding` | Profile setup | patient |
| `/profile` | Patient profile / health vault | patient |
| `/dashboard` | Patient dashboard (to merge with profile) | patient |
| `/queue` | Live queue | patient |
| `/doctor` | Doctor console | doctor |
| to build: `/book`, `/chat`, `/admin/*`, `/tv/:clinic` | | |

## 3. Backend (to build) — Django
- **Python 3.12, Django 5, DRF, SimpleJWT, django-channels, Celery, Redis, PostgreSQL.**
- Project layout:
```text
backend/
  config/            settings (base/dev/prod), urls.py, asgi.py, celery.py
  apps/
    accounts/        User, OTP, roles, JWT views
    clinics/         Clinic (tenant), Branch, Membership, branding
    doctors/         DoctorProfile, Schedule, TimeOff
    appointments/    Appointment, slot engine
    queue/           QueueDay, Token, WebSocket consumer
    records/         Visit, Note, Attachment, PatientProfile
    prescriptions/   Prescription, Medicine, PDF generator
    labs/            LabReport, upload
    notifications/   Notification, channels (push/SMS/WhatsApp/email)
    ai_assistant/    Conversation, Message, Gemini client, tools
    billing/         Plan, Subscription, Invoice
    audit/           AuditLog middleware
  requirements/ base.txt prod.txt
  Dockerfile  docker-compose.yml
```

### Multi-tenancy
Shared DB, `clinic_id` FK on every tenant table. A `TenantMiddleware` resolves clinic from subdomain or `X-Clinic` header; a base `TenantScopedViewSet` filters every queryset by `request.clinic` and checks membership role. Never trust clinic id from the body.

### API style
- REST under `/api/v1/`, JSON, cursor pagination, OpenAPI docs via `drf-spectacular` at `/api/docs/`.
- Errors: `{ "error": { "code": "slot_taken", "message": "..." } }`.
- Full endpoint list: `BACKEND.md`.

### Real-time queue
`ws/queue/<doctor_id>/<date>/` — Channels consumer joins Redis group; any queue change (call next, check-in) broadcasts `{token_now, positions, eta}`. Patient only receives *their own* position + current token.

### AI assistant (Gemini)
```text
Patient msg -> POST /api/v1/ai/chat (stream SSE)
  -> safety pre-check (red-flag words -> emergency reply, stop)
  -> Gemini (gemini-2.5-flash) with system prompt + clinic FAQ + function declarations:
       list_doctors, find_slots, book_appointment(confirm=true), cancel_appointment,
       my_queue_status, clinic_info
  -> Django executes tool with the patient's permissions -> result back to Gemini
  -> streamed answer; conversation saved
```
- API key `GEMINI_API_KEY` only in server env. Per-clinic monthly token budget.
- Booking tools require an explicit "yes" turn before writing.
- WhatsApp webhook `/api/v1/webhooks/whatsapp/` feeds the same service.

### Background jobs (Celery + beat)
Reminders (24 h / 2 h), "leave home now", follow-up due, no-show auto-mark at end of day, analytics roll-ups, PDF generation, AI summaries.

### Files
S3-compatible (Cloudflare R2 / AWS S3). Upload via pre-signed PUT; downloads via 5-min signed URL. Virus scan (ClamAV) optional.

## 4. Deployment (production)
| Piece | Suggested |
|---|---|
| Frontend | Lovable publish / Cloudflare |
| API + Channels | Docker on Railway / Render / AWS ECS (gunicorn + uvicorn workers) |
| DB | Managed Postgres (Neon, RDS, Supabase) |
| Redis | Upstash / ElastiCache |
| Files | Cloudflare R2 |
| Monitoring | Sentry + Better Uptime |
| CI/CD | GitHub Actions: lint, test, build image, migrate, deploy |

Environments: `dev`, `staging`, `prod` with separate DBs and keys.

## 5. Security checklist
HTTPS/HSTS · CORS allow-list · CSRF for cookie endpoints · throttling (DRF) · argon2 · JWT rotation + blacklist · object-level permissions · audit log · secrets in env (never in git) · dependency scanning · backups tested monthly.
