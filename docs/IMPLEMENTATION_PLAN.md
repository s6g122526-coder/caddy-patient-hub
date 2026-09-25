# Caddy Care — Implementation Plan

Team assumption: 1 frontend dev/designer + 1 backend dev (Django). ~12 weeks to first paying clinic.
Detailed task checklists: **FRONTEND.md** and **BACKEND.md**. Task IDs map to REQUIREMENTS.md.

## Phase 0 — Clean-up the prototype (Week 1) · Frontend
- Fix known UX issues from `/main_content.md`: tokens-only queue board, unify nav + working mobile menu, remove visible mock toggle, remove/shorten splash, reduce infinite animations, contrast fixes, emergency disclaimer.
- Merge `/dashboard` into `/profile` (one health vault).
- Build missing screens with mock data: `/book`, `/chat`, `/admin`, `/tv/$clinic`.
**Done when:** every screen clickable end-to-end with mock data, no console errors.

## Phase 1 — Backend foundation (Weeks 1–3) · Backend
- Django project, Docker, Postgres, Redis, CI, Sentry, OpenAPI docs.
- Accounts (phone OTP + staff email), JWT, roles, tenant middleware.
- Clinics, doctors, schedules; seed script with demo clinic "Caddy Smile Studio".
**Done when:** `/api/docs/` live on staging; login works from frontend.

## Phase 2 — Core clinic flow (Weeks 3–6) · Both
- Slot engine + booking API; frontend `/book` wired.
- Queue: tokens, check-in, call next, WebSocket; `/queue`, `/doctor`, TV board wired.
- Records: visits, prescriptions (PDF), lab upload (S3 signed URLs); `/profile` wired.
**Done when:** a patient books, checks in, waits live, doctor completes visit + prescription, patient sees it in history.

## Phase 3 — AI assistant (Weeks 6–8) · Both
- Gemini client, system prompt, function tools, safety layer, streaming SSE.
- `/chat` page + floating Caddy widget.
- Clinic FAQ editor in admin; conversation logs.
**Done when:** "Book me with the dentist tomorrow evening" books a real slot after confirmation.

## Phase 4 — Sell-ready (Weeks 8–10)
- Notifications (reminders, leave-home alert) via Celery + SMS/WhatsApp.
- WhatsApp bot channel.
- Admin analytics, staff management, clinic branding.
- Urdu language.
- Billing: plans, trial, invoices.

## Phase 5 — Launch hardening (Weeks 10–12)
- Security review, pen-test checklist, load test (500 concurrent queue watchers).
- Backups + restore drill, monitoring alerts.
- Legal: Terms, Privacy Policy, clinic DPA, consent flow.
- Pilot with 2–3 clinics, fix feedback, case study with numbers.

## Phase 6 — Edge features (after launch)
Doctor AI pre-visit summary, voice → prescription, family accounts, lab-partner uploads, online payments (JazzCash/Easypaisa), reviews, telemedicine.

## Definition of Done (every task)
- Works on 360 px phone and desktop; reduced-motion respected.
- API has tests (pytest) and permission tests (other clinic cannot read).
- No secrets in code; errors handled with friendly message.
- Documented in OpenAPI / updated in these docs.

## Risks
| Risk | Mitigation |
|---|---|
| AI books wrong slot | Confirmation step + tool validation server-side |
| AI gives medical advice | Safety pre-filter + strict prompt + disclaimer |
| WhatsApp API approval delay | Start Meta business verification in Week 1 |
| Data leak between clinics | Tenant-scoped base classes + automated tests |
| Clinics resist change | Free setup, receptionist training video, walk-in mode |
