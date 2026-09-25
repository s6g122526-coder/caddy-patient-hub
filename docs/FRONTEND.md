# Caddy Care — Frontend Task List

Stack: TanStack Start v1, React 19, Tailwind v4 (`src/styles.css` tokens), `motion`, `three`. Home page (`/`) is the design source of truth. Auth = full pages, never modals.

## Rules
- Colors only via tokens in `src/styles.css` — no `text-white`, no hex in components.
- Every animation must check `prefers-reduced-motion`; infinite loops only for "live" signals.
- Money: `formatFee()` from `src/lib/live-visit.ts` (Rs).
- Every route has its own `head()` title/description.
- Data: TanStack Query (`ensureQueryData` in loader + `useSuspenseQuery`).

## F0 — Clean-up (Phase 0)
- [ ] F0-1 Queue board shows tokens only (remove names + reasons) — `routes/queue.tsx`, `lib/live-visit.ts`
- [ ] F0-2 One shared `SiteNav` for all pages; working mobile menu (Sheet); role-aware links
- [ ] F0-3 Hide mock toggle on `/profile` unless `?dev=1`
- [ ] F0-4 Remove `BootLoader` splash or show only on first visit < 800 ms
- [ ] F0-5 Cut looping animations (marquee, orbit chips) to hover/in-view only
- [ ] F0-6 Contrast: min 12 px labels, fix teal-on-teal and gold-on-gold
- [ ] F0-7 Emergency disclaimer in footer + chat ("Not for emergencies — call 1122")
- [ ] F0-8 Merge `/dashboard` content into `/profile`; redirect `/dashboard` → `/profile`
- [ ] F0-9 Doctor carousel: edge fade mask, arrows outside cards
- [ ] F0-10 Auth forms: validation (zod), error + loading states, patient/doctor toggle changes form

## F1 — New screens (mock first)
- [ ] F1-1 `/book` — doctor list → date → slots → confirm → success (BOOK-1..3)
- [ ] F1-2 `/chat` + floating Caddy widget — streaming bubbles, quick-reply chips, booking confirm card (AI-1..4)
- [ ] F1-3 `/tv/$clinic` — full-screen token board, big current token, auto-refresh (Q-6)
- [ ] F1-4 `/admin` — doctors, schedules, staff, clinic info/FAQ, branding (ADM-1)
- [ ] F1-5 `/admin/analytics` — charts (recharts) (ADM-2)
- [ ] F1-6 Doctor console: write note + prescription form with medicine autocomplete (DOC-2)
- [ ] F1-7 Settings page: language, notifications, family members

## F2 — API wiring
- [ ] F2-1 `src/lib/api/client.ts` — fetch wrapper, base URL `VITE_API_URL`, JWT attach, auto refresh on 401, error shape `{error:{code,message}}`
- [ ] F2-2 `src/lib/api/queries.ts` — queryOptions per resource (me, doctors, slots, appointments, queue, visits, prescriptions, labs, notifications)
- [ ] F2-3 Auth context + route guards (`_authenticated` layout, role check) — replace `caddy-context.tsx` localStorage
- [ ] F2-4 Replace `profile-data.ts` with `/patients/me/summary` etc. Keep mock files for Storybook/demo mode
- [ ] F2-5 Replace `live-visit.ts` with queue API + WebSocket hook `useQueueSocket(doctorId)`
- [ ] F2-6 Lab upload: get pre-signed URL → PUT file → confirm
- [ ] F2-7 Chat: consume SSE from `/api/v1/ai/chat`
- [ ] F2-8 Notifications: list + mark read + web push subscribe

## F3 — Quality
- [ ] F3-1 Urdu translations (i18next), RTL check
- [ ] F3-2 Empty, loading (skeleton), error state for every section
- [ ] F3-3 Lighthouse ≥ 90 mobile; lazy-load three.js mascot
- [ ] F3-4 Playwright smoke tests: signup → book → queue → history
- [ ] F3-5 Clinic branding: read clinic color/logo from API and set CSS variables at runtime

## Folder map
```text
src/routes/         pages (file-based)
src/components/caddy/   shared brand pieces (nav, footer, mascot, carousel)
src/components/profile/ profile sections
src/components/ui/      shadcn primitives
src/lib/            mock data today, api/ tomorrow
src/styles.css      design tokens
```
