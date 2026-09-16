/**
 * Single source of truth for the live visit / queue mock.
 *
 * Every surface that mentions the queue (home teaser, /queue token board,
 * profile appointment card, notifications) derives its numbers from here so
 * the same fact never shows two different values.
 */

export const MINUTES_PER_PATIENT = 6;

export type QueueEntry = {
  token: string;
  /** Patient label shown on the public board */
  name: string;
  reason: string;
};

export const LIVE_VISIT = {
  doctor: "Dr. Aisha Rahman",
  specialty: "Dentist",
  clinic: "Caddy Smile Studio",
  room: "Room 3",
  token: "A-24",
  date: "Today, 17 Aug",
  time: "4:30 PM",
  reason: "Dental cleaning",
  /** patients called before you */
  aheadOfYou: 3,
} as const;

/** Your place in line, counting yourself. */
export const QUEUE_POSITION = LIVE_VISIT.aheadOfYou + 1;

/** Minutes until you're called, for a given number of patients ahead. */
export function waitMinutes(ahead: number) {
  return Math.max(2, ahead * MINUTES_PER_PATIENT);
}

/** Minutes before you should leave home (travel buffer of 14 minutes). */
export function leaveHomeInMinutes(ahead: number) {
  return Math.max(0, waitMinutes(ahead) - 14);
}

/** The public token board: 3 patients ahead, you, then 2 behind. */
export const QUEUE_BOARD: QueueEntry[] = [
  { token: "A-21", name: "Bilal A.", reason: "BP review" },
  { token: "A-22", name: "Hina R.", reason: "Migraine follow-up" },
  { token: "A-23", name: "Hamza I.", reason: "Sugar check" },
  { token: LIVE_VISIT.token, name: "You", reason: LIVE_VISIT.reason },
  { token: "A-25", name: "Nida F.", reason: "Skin consult" },
  { token: "A-26", name: "Rehan K.", reason: "Vaccination" },
];

/** Consultation fees are Pakistani rupees everywhere. */
export function formatFee(rupees: number) {
  return `Rs ${rupees.toLocaleString("en-PK")}`;
}
