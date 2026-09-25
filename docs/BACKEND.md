# Caddy Care — Backend Task List (Django)

Stack: Python 3.12 · Django 5 · DRF · SimpleJWT · django-channels · Celery + Redis · PostgreSQL 16 · drf-spectacular · google-genai (Gemini) · boto3 (S3/R2) · Sentry · pytest.

## Setup
```bash
python -m venv .venv && source .venv/bin/activate
pip install django djangorestframework djangorestframework-simplejwt channels channels-redis \
  celery redis psycopg[binary] drf-spectacular django-cors-headers django-environ \
  google-genai boto3 argon2-cffi sentry-sdk weasyprint pytest-django factory-boy
django-admin startproject config .
docker compose up -d db redis
python manage.py migrate && python manage.py seed_demo
```

### Environment variables
```text
DJANGO_SECRET_KEY, DEBUG, ALLOWED_HOSTS, DATABASE_URL, REDIS_URL,
CORS_ALLOWED_ORIGINS, GEMINI_API_KEY, GEMINI_MODEL=gemini-2.5-flash,
S3_BUCKET, S3_ENDPOINT, S3_KEY, S3_SECRET,
TWILIO_SID, TWILIO_TOKEN, WHATSAPP_TOKEN, WHATSAPP_PHONE_ID, WHATSAPP_VERIFY_TOKEN,
SENTRY_DSN
```

## B0 — Foundation
- [ ] B0-1 Project skeleton, settings split, Dockerfile, docker-compose (db, redis, api, worker, beat)
- [ ] B0-2 GitHub Actions: ruff, pytest, build image
- [ ] B0-3 drf-spectacular at `/api/docs/`, Sentry, JSON logging, health `/api/health`
- [ ] B0-4 Base classes: `TimeStampedUUIDModel`, `TenantModel`, `TenantScopedViewSet`, `TenantMiddleware`, role permissions
- [ ] B0-5 AuditLog middleware for patient-record reads

## B1 — Accounts (AUTH-*)
- [ ] `POST /api/v1/auth/otp/request` {phone} — rate limited
- [ ] `POST /api/v1/auth/otp/verify` {phone, code} → access + refresh
- [ ] `POST /api/v1/auth/login` (staff email/password), `POST /auth/refresh`, `POST /auth/logout`
- [ ] `GET/PATCH /api/v1/me`

## B2 — Clinics & doctors (TEN-*, BOOK-1/2, ADM-1)
- [ ] `GET /api/v1/clinic` (public branding by subdomain)
- [ ] `GET /api/v1/doctors?specialty=` · `GET /doctors/{id}`
- [ ] Admin CRUD: `/admin/doctors`, `/admin/schedules`, `/admin/timeoff`, `/admin/staff`, `/admin/clinic`
- [ ] `seed_demo` command matching current mock data (Dr. Aisha Rahman, Caddy Smile Studio, etc.)

## B3 — Booking (BOOK-*)
- [ ] Slot engine service: schedule − time off − booked = free slots
- [ ] `GET /api/v1/doctors/{id}/slots?date=`
- [ ] `POST /api/v1/appointments` (select_for_update + unique constraint → 409 `slot_taken`)
- [ ] `GET /appointments?upcoming=1` · `PATCH /appointments/{id}` (reschedule) · `POST /appointments/{id}/cancel`
- [ ] Staff: `POST /appointments/walk-in`

## B4 — Queue (Q-*)
- [ ] `POST /api/v1/appointments/{id}/check-in` → Token
- [ ] `GET /api/v1/queue/me` → {token, ahead, position, eta_minutes, now_serving}
- [ ] Staff: `POST /queue/{doctor}/call-next`, `/skip`, `/no-show`, `/pause`
- [ ] Channels consumer `ws/queue/{doctor_id}/` (JWT in query), broadcast on change
- [ ] Public `GET /api/v1/tv/{clinic_slug}` → tokens only
- [ ] Celery: alert when ahead == 3; auto no-show at day end

## B5 — Records (PAT-*, DOC-*)
- [ ] `GET/PATCH /api/v1/patients/me` · `GET /patients/me/summary` (stats + streak)
- [ ] `GET /patients/me/visits` · `GET /visits/{id}`
- [ ] Doctor: `POST /visits` (note, diagnosis, follow-up) · `GET /patients/{id}/timeline`
- [ ] `POST /prescriptions` + items · `GET /prescriptions/{id}/pdf` (WeasyPrint, QR)
- [ ] Labs: `POST /labs/upload-url` → pre-signed PUT · `POST /labs` confirm · `GET /labs` · `GET /labs/{id}/file` signed URL
- [ ] `POST /checkins` medication adherence

## B6 — AI assistant (AI-*)
- [ ] `ai_assistant/gemini.py` — client using `google-genai`, model from env, streaming
- [ ] System prompt: clinic name, hours, FAQ, "never diagnose", "confirm before booking", reply in user's language, emergency → 1122
- [ ] Safety pre-filter (chest pain, can't breathe, unconscious, heavy bleeding, suicide…) → fixed emergency reply, no model call
- [ ] Function declarations: `list_doctors`, `find_slots`, `book_appointment`, `cancel_appointment`, `my_queue_status`, `clinic_info` — executed with the patient's permissions
- [ ] `POST /api/v1/ai/chat` → SSE stream; saves Conversation/Message; tracks AIUsage; returns 402 `ai_budget_reached` when over clinic cap
- [ ] Handle Gemini 429/5xx with backoff (max 3), other errors → friendly message
- [ ] WhatsApp webhook `GET/POST /api/v1/webhooks/whatsapp/` (verify token + signature) → same service
- [ ] Doctor tools: `POST /visits/{id}/ai-summary`, `POST /ai/transcribe-prescription` (P1)

Example tool call flow:
```python
resp = client.models.generate_content_stream(
    model=settings.GEMINI_MODEL,
    contents=history,
    config=types.GenerateContentConfig(system_instruction=prompt, tools=[caddy_tools]),
)
# on function_call -> run tool -> append function_response -> continue
```

## B7 — Notifications & billing
- [ ] Notification model + `GET /notifications`, `POST /notifications/{id}/read`
- [ ] Senders: web push (pywebpush), SMS (Twilio/local gateway), WhatsApp templates, email
- [ ] Celery beat: reminders 24 h / 2 h, follow-up due
- [ ] Plans, subscription, trial expiry job, invoices
- [ ] Analytics endpoint `/admin/analytics?from=&to=`

## B8 — Hardening
- [ ] Permission test matrix: every endpoint × every role × other clinic → 403/404
- [ ] Throttles, CORS, HSTS, secure cookies
- [ ] Load test queue WebSocket (locust), DB indexes check
- [ ] Backup + restore drill; data export/delete endpoint for patients
