# Caddy Care — Product Requirements Document (PRD)

> Version 1.0 · Sep 2026 · Owner: Founder · Status: Frontend prototype done, backend not started

## 1. What Caddy Care is
Caddy Care is a **white-label clinic operating app** sold to private clinics and individual doctors (starting in Pakistan — Karachi, Lahore, Islamabad). Patients get a beautiful app to book, wait in a **live queue from home**, and keep their **health history** in one place. Clinics get a **doctor console**, **queue control**, and an **AI receptionist** ("Caddy") that chats with patients and books appointments 24/7.

**One-line pitch for clinics:** "Stop crowded waiting rooms and missed calls. Caddy books your patients, tells them exactly when to come, and keeps every visit record in one place."

## 2. Problems we solve
| Who | Pain today | Caddy Care answer |
|---|---|---|
| Patient | Waits 1–3 h in a crowded waiting room | Live token + "leave home now" alert |
| Patient | Loses paper prescriptions / reports | Health vault: visits, prescriptions, labs |
| Receptionist | Phone rings all day for bookings | AI chat bot books 24/7 (web + WhatsApp) |
| Doctor | No history of the patient at the desk | One-click patient timeline |
| Clinic owner | No numbers on no-shows, revenue, wait time | Owner dashboard + reports |

## 3. Target customers (who pays)
1. **Solo doctors / small clinics** (1–3 doctors) — Starter plan.
2. **Multi-specialty clinics** (4–20 doctors) — Growth plan.
3. **Hospital OPDs / chains** — Enterprise (custom domain, SSO, SLA).

## 4. Users & roles
- **Patient** — books, joins queue, sees history, chats with Caddy.
- **Doctor** — sees today's queue, calls next, writes notes/prescriptions.
- **Receptionist / Staff** — walk-in check-in, manages queue, reschedules.
- **Clinic Admin (Owner)** — doctors, schedules, fees, branding, billing, analytics.
- **Super Admin (us)** — manages all clinic tenants, plans, support.

## 5. Core features (MVP — must ship to sell)
1. **Clean branded UI** per clinic (logo, colors, name) — the current "Warm Clinic" glass design.
2. **Auth** — phone OTP for patients, email+password for staff, roles.
3. **Patient profile** — details, allergies, conditions, emergency contact, stats, streak.
4. **Booking** — pick doctor → slot → confirm; reschedule/cancel; fee in Rs.
5. **Live patient queue** — tokens, position, ETA, "call next", real-time updates, SMS/WhatsApp/push alert.
6. **Visit history** — timeline of visits, notes, prescriptions, lab reports (upload + view).
7. **Doctor console** — today's queue, patient timeline, write prescription, mark done.
8. **AI chat bot (Caddy)** — Gemini-powered; answers clinic FAQs, checks free slots, books/cancels, triage "is this urgent?" with safe emergency disclaimer.
9. **Notifications** — queue, appointment reminders, report ready.
10. **Clinic admin panel** — doctors, schedules, holidays, fees, staff.

## 6. "Edge" features — what makes clinics say yes
Ranked by selling power:
1. **WhatsApp booking bot** — Pakistan runs on WhatsApp. Caddy on the clinic's WhatsApp number is the #1 closer.
2. **No-show reducer** — auto reminders + "confirm/cancel" buttons + optional advance deposit (JazzCash/Easypaisa). Show clinics "no-shows down 30%".
3. **Waiting-room TV board** — token screen for the clinic TV (tokens only, never names).
4. **AI visit summary for doctors** — before the patient enters, Gemini writes a 3-line summary of history + today's complaint.
5. **Voice-to-prescription** — doctor speaks, AI drafts the prescription in a template, doctor approves.
6. **Urdu + English** (Roman Urdu in chat too).
7. **Owner analytics** — patients/day, avg wait, revenue, no-show rate, busiest hours.
8. **Digital prescription PDF + QR** — shareable with pharmacies.
9. **Follow-up automation** — "Your 5-day follow-up is due" with 1-tap booking.
10. **Family accounts** — one phone, many patients (kids, parents).
11. **Lab partner integration** — labs upload reports straight into patient vault.
12. **Offline walk-in mode** — receptionist adds walk-ins into the same queue.
13. **Reviews & rating** after visit (clinic can use for Google reviews).
14. **Telemedicine video call** (Phase 3).

## 7. Trust & compliance (clinics will ask)
- Data encrypted in transit (HTTPS) and at rest; daily backups.
- Each clinic's data is isolated (multi-tenant with tenant_id on every row).
- Audit log: who viewed which patient record, when.
- Consent at signup; "Not for emergencies — call 1122 / 115" everywhere AI talks.
- Public queue board shows **tokens only**.
- Align with Pakistan PECA 2016 + Personal Data Protection Bill; HIPAA-style practices for foreign clients.

## 8. Pricing idea (monthly, PKR)
| Plan | Price | Includes |
|---|---|---|
| Starter | Rs 4,999 / doctor | Booking, queue, history, web chat bot |
| Growth | Rs 12,999 / clinic (up to 5 doctors) | + WhatsApp bot, reminders, analytics, TV board |
| Enterprise | Custom | + custom domain, SSO, lab integration, SLA |
14-day free trial, setup fee waived for first 20 clinics.

## 9. Success metrics
- Clinic: avg waiting-room time ↓ 50 %, no-shows ↓ 30 %, bookings via bot ≥ 40 %.
- Product: onboarding a clinic in < 30 min; p95 page load < 2 s; 99.5 % uptime.
- Business: 20 paying clinics in first 6 months.

## 10. Out of scope (v1)
Insurance claims, pharmacy e-commerce, hospital inpatient (IPD), full EMR/ICD billing.

## 11. Current status (honest)
- ✅ Frontend prototype (TanStack Start + React) with mock data: home, login, signup, onboarding, profile, dashboard, queue, doctor console.
- ❌ No real backend, auth, database, AI bot, notifications.
- ⚠️ Known UX issues listed in `/main_content.md` (privacy of token board, nav, splash, motion).
See `IMPLEMENTATION_PLAN.md` for the road to production.
