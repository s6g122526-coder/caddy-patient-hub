# Caddy Patient Hub

Clone and inspect https://github.com/shayan5466/caddy-care-live. Build the PATIENT PROFILE screen for Caddy Care, using the Home screen as the strict source of truth for its color palette, typography, glass treatment, Caddy mascot, spring physics, and reduced-motion behavior. This is UI/motion only: use rich realistic placeholder patient data, but no backend wiring.

Implement ALL of the following with full responsive behavior and whileInView scroll-reveal motion (staggered where multiple items):
1) Profile hero: large glass banner with slow animated gradient, glowing patient avatar with pulse ring, a small animated 3D Caddy companion behind/beside it (idle float and greeting/wave on page load), name, member-since, Gold Patient tier badge with shine sweep.
2) Four animated-counter glass stat chips, responsive stack: Total Visits, Upcoming Appointments, Prescriptions on File, Lab Reports Available. Spring counters from zero when in view, small glowing 3D-style icons.
3) Engagement streak board: staggered spring pop-in glowing adherence tiles, large glowing current streak, contextual encouraging microcopy. Provide a brand-new-patient fallback with Caddy encouragement rather than a blank streak tracker.
4) Prominent upcoming appointment card: doctor photo/specialty/date/time, and if mocked as today/checked-in include live mini queue position using the live-queue number language. Pulsing border ring. Glass pill View Details, Reschedule, Cancel.
5) Visit history vertical timeline: frosted glass cards with doctor/name/date/complaint/status glows, attachment icon buttons. Staggered scroll entrances. Click a card to expand in place via Framer Motion layout/AnimatePresence, revealing complaint details, notes and medicines.
6) Horizontal prescription cards and glass modal with scale/fade showing medicine/dosage/duration/instructions.
7) Lab report grid: tilted glowing document icons, test/date/status; Ready glow, Processing shimmer. Add Upload Report glass button and drag/drop zone with drag glow and success check-pop. Ready reports open an in-app glass preview modal, mobile-friendly zoom gestures if feasible.
8) Fully designed graceful empty/new-patient alternatives for all sections, including zero animated stats, Caddy-led streak and appointment empty cards, and consistent history/prescription/lab empty illustrations and copy. Make the UI easy to toggle between populated and new-patient mock states so both are reviewable.

Do not omit functionality or sections. Ensure project builds cleanly. When done, summarize what you changed and identify how to view each mock state.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/19963c67-5de4-4c5e-a4bf-7e14a10cfffa).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
