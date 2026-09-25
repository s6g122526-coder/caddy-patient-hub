# Caddy Care — Requirements

IDs are used in tasks (FRONTEND.md / BACKEND.md). Priority: **P0** = MVP, **P1** = sell-ready, **P2** = later.

## 1. Functional requirements

### Auth & accounts
| ID | Requirement | P |
|---|---|---|
| AUTH-1 | Patient signs up / logs in with phone number + OTP (SMS/WhatsApp) | P0 |
| AUTH-2 | Staff (doctor, receptionist, admin) log in with email + password; optional 2FA | P0 |
| AUTH-3 | Roles: patient, doctor, receptionist, clinic_admin, super_admin; enforced on server | P0 |
| AUTH-4 | JWT access (15 min) + refresh (7 days, rotating, httpOnly cookie) | P0 |
| AUTH-5 | Forgot password / resend OTP with rate limit (5/hour) | P0 |
| AUTH-6 | Family members under one patient account | P1 |

### Multi-tenant clinics
| ID | Requirement | P |
|---|---|---|
| TEN-1 | Every clinic is a tenant; all data scoped by clinic | P0 |
| TEN-2 | Clinic branding: name, logo, primary color, subdomain `clinic.caddycare.pk` | P0 |
| TEN-3 | Clinic can have many branches and doctors | P1 |
| TEN-4 | Custom domain | P2 |

### Patient profile & history
| ID | Requirement | P |
|---|---|---|
| PAT-1 | Profile: name, DOB, gender, blood group, city, allergies, conditions, emergency contact | P0 |
| PAT-2 | Visit timeline with complaint, notes, medicines, attachments | P0 |
| PAT-3 | Prescriptions list + detail + PDF download | P0 |
| PAT-4 | Lab reports: upload (PDF/JPG/PNG ≤ 10 MB), status Ready/Processing, preview | P0 |
| PAT-5 | Stats (visits, upcoming, prescriptions, labs) computed from real data | P0 |
| PAT-6 | Adherence streak from medication check-ins | P1 |
| PAT-7 | Share a record with another doctor via expiring link | P2 |

### Booking
| ID | Requirement | P |
|---|---|---|
| BOOK-1 | List doctors with specialty, fee (Rs), rating, next free slot | P0 |
| BOOK-2 | Doctor schedules: weekly hours, slot length, breaks, holidays | P0 |
| BOOK-3 | Book, reschedule, cancel (cancel cut-off configurable) | P0 |
| BOOK-4 | Prevent double-booking (DB constraint + transaction) | P0 |
| BOOK-5 | Walk-in added by receptionist | P0 |
| BOOK-6 | Advance payment (JazzCash / Easypaisa / card) | P2 |

### Live queue
| ID | Requirement | P |
|---|---|---|
| Q-1 | Token generated at check-in (e.g. A-24), per doctor per day | P0 |
| Q-2 | Patient sees position, people ahead, ETA (rolling avg consult time) | P0 |
| Q-3 | Doctor/staff: call next, skip, mark no-show, pause | P0 |
| Q-4 | Real-time updates via WebSocket (fallback polling 15 s) | P0 |
| Q-5 | Alert when 3 ahead and "leave home now" (push/SMS/WhatsApp) | P1 |
| Q-6 | TV board page: tokens only, no names or reasons | P1 |

### AI assistant (Caddy)
| ID | Requirement | P |
|---|---|---|
| AI-1 | Chat widget in patient app; streaming answers (Gemini) | P0 |
| AI-2 | Tools: list doctors, find slots, book, cancel, my queue status, clinic FAQ | P0 |
| AI-3 | Never diagnoses; red-flag symptoms → emergency message (1122) | P0 |
| AI-4 | Always confirm before booking ("Book Dr. X, Tue 4:30 PM?") | P0 |
| AI-5 | English, Urdu, Roman Urdu | P1 |
| AI-6 | WhatsApp channel (Meta Cloud API) with same brain | P1 |
| AI-7 | Doctor-side: pre-visit summary, voice → prescription draft | P1 |
| AI-8 | Conversation logs visible to clinic admin | P1 |

### Doctor console & admin
| ID | Requirement | P |
|---|---|---|
| DOC-1 | Today's queue, current patient, patient timeline | P0 |
| DOC-2 | Write visit note + prescription (templates, medicine autocomplete) | P0 |
| ADM-1 | Manage doctors, staff, schedules, fees, clinic info/FAQ for bot | P0 |
| ADM-2 | Analytics: patients/day, avg wait, no-show rate, revenue | P1 |
| ADM-3 | Subscription & billing | P1 |

### Notifications
| ID | Requirement | P |
|---|---|---|
| NOT-1 | In-app notification center | P0 |
| NOT-2 | Reminders 24 h and 2 h before appointment | P1 |
| NOT-3 | Channels: web push, SMS, WhatsApp, email | P1 |

## 2. Non-functional requirements
| Area | Requirement |
|---|---|
| Performance | p95 API < 300 ms; first page < 2 s on 4G; no blocking splash screen |
| Availability | 99.5 % monthly; daily DB backup, 30-day retention, point-in-time restore |
| Security | OWASP Top-10; HTTPS only; bcrypt/argon2 passwords; rate limits; CORS allow-list; files via signed URLs |
| Privacy | Tenant isolation; audit log of record views; data export/delete on request |
| Accessibility | WCAG 2.1 AA; min 12 px text; contrast ≥ 4.5:1; reduced-motion respected |
| Responsive | 360 px phones → 1440 px desktop |
| i18n | English + Urdu (RTL) |
| Observability | Sentry errors, structured logs, uptime monitor |
| AI safety | Emergency disclaimer, no diagnosis, PII not sent beyond need, per-clinic AI cost cap |
