# Caddy Care — Data Model (PostgreSQL via Django ORM)

All tables have `id UUID PK`, `created_at`, `updated_at`. Tables marked **[T]** also have `clinic_id FK → Clinic` (tenant scope, indexed).

## Diagram
```text
User 1─1 PatientProfile ─< FamilyMember
User ─< Membership >─ Clinic ─< Branch
Clinic ─< DoctorProfile ─< Schedule / TimeOff
PatientProfile ─< Appointment >─ DoctorProfile
Appointment 1─1 Token >─ QueueDay (doctor+date)
Appointment 1─1 Visit ─< Prescription ─< PrescriptionItem
Visit ─< Attachment ;  PatientProfile ─< LabReport
User ─< Notification ; Conversation ─< Message
Clinic ─ Subscription >─ Plan ; AuditLog
```

## Tables

### accounts
**User** — `phone (unique, E.164)`, `email (unique, null)`, `password`, `full_name`, `is_active`, `last_login`, `preferred_language (en|ur)`.
**OTPCode** — `phone`, `code_hash`, `expires_at`, `attempts`, `used_at`.

### clinics
**Clinic** — `name`, `slug (subdomain, unique)`, `logo_url`, `primary_color`, `phone`, `whatsapp_number`, `address`, `city`, `timezone (Asia/Karachi)`, `faq_text` (fed to AI), `is_active`.
**Branch [T]** — `name`, `address`, `lat`, `lng`.
**Membership [T]** — `user FK`, `role (doctor|receptionist|clinic_admin)`, unique(user, clinic).

### doctors
**DoctorProfile [T]** — `user FK`, `branch FK`, `specialty`, `qualifications`, `photo_url`, `fee_pkr int`, `avg_consult_minutes (default 6)`, `rating`, `bio`, `is_accepting`.
**Schedule [T]** — `doctor FK`, `weekday 0-6`, `start_time`, `end_time`, `slot_minutes`, `max_patients`.
**TimeOff [T]** — `doctor FK`, `start`, `end`, `reason`.

### records (patient)
**PatientProfile** — `user FK (null for family member)`, `owner_user FK`, `full_name`, `dob`, `gender`, `blood_group`, `city`, `allergies text`, `conditions text`, `emergency_name`, `emergency_phone`, `insurance`, `consent_at`.
**PatientClinicLink [T]** — `patient FK`, `mrn (clinic's patient number)`, `first_visit_at`. (Patient can visit many clinics; each clinic sees only its own records.)

### appointments
**Appointment [T]** — `patient FK`, `doctor FK`, `branch FK`, `start_at timestamptz`, `end_at`, `status (booked|confirmed|checked_in|in_consult|completed|cancelled|no_show)`, `source (app|ai_web|ai_whatsapp|walk_in|staff)`, `reason`, `fee_pkr`, `paid bool`, `cancel_reason`.
Constraint: exclusion / unique(doctor, start_at) where status not in (cancelled). Index (doctor, start_at).

### queue
**QueueDay [T]** — `doctor FK`, `date`, `prefix ('A')`, `current_number int`, `is_paused`, unique(doctor, date).
**Token [T]** — `queue_day FK`, `appointment FK (1-1, null for walk-in)`, `patient FK`, `number int`, `label ('A-24')`, `status (waiting|called|serving|done|skipped|no_show)`, `checked_in_at`, `called_at`, `done_at`. unique(queue_day, number).
ETA = people_ahead × rolling avg of (done_at − called_at) over last 20 tokens.

### visits & prescriptions
**Visit [T]** — `appointment FK 1-1`, `patient FK`, `doctor FK`, `complaint`, `complaint_detail`, `diagnosis`, `notes`, `follow_up_on date null`, `ai_summary text`.
**Prescription [T]** — `visit FK`, `issued_at`, `refills_left`, `pdf_url`.
**PrescriptionItem** — `prescription FK`, `medicine_name`, `dosage`, `frequency`, `duration`, `instructions`.
**Attachment [T]** — `visit FK`, `kind (lab|image|prescription|other)`, `file_key`, `label`.

### labs
**LabReport [T]** — `patient FK`, `visit FK null`, `test_name`, `lab_name`, `status (processing|ready)`, `file_key`, `summary`, `values JSONB [{name,value,range,flag}]`, `uploaded_by FK`, `reported_at`.

### engagement
**MedicationCheckIn** — `patient FK`, `prescription_item FK`, `date`, `taken bool`. Streak = consecutive days with ≥1 taken.

### notifications
**Notification** — `user FK`, `clinic FK null`, `kind (queue|appointment|report|streak|system)`, `title`, `body`, `data JSONB`, `read_at`, `channels_sent text[]`.
**DeviceToken** — `user FK`, `platform`, `token`.

### ai_assistant
**Conversation [T]** — `patient FK null`, `channel (web|whatsapp)`, `external_id (wa phone)`, `status`, `tokens_used`.
**Message** — `conversation FK`, `role (user|assistant|tool)`, `content`, `tool_name`, `tool_payload JSONB`.
**AIUsage [T]** — `month`, `tokens_in`, `tokens_out`, `cost_usd`, `limit_usd`.

### billing
**Plan** — `code (starter|growth|enterprise)`, `price_pkr`, `max_doctors`, `features JSONB`.
**Subscription [T]** — `plan FK`, `status (trial|active|past_due|cancelled)`, `trial_ends_at`, `current_period_end`.
**Invoice [T]** — `amount_pkr`, `status`, `paid_at`, `provider_ref`.

### audit
**AuditLog [T]** — `actor FK`, `action (view|create|update|delete|export)`, `object_type`, `object_id`, `ip`, `at`.

## Mapping from current mock files
| Mock (frontend) | Real table |
|---|---|
| `profile-data.ts → patient` | PatientProfile |
| `stats` | computed by `/patients/me/summary` |
| `streak` | MedicationCheckIn |
| `appointment` + `live-visit.ts` | Appointment + Token + QueueDay |
| `visits` | Visit + Attachment |
| `prescriptions` | Prescription + PrescriptionItem |
| `labs` | LabReport |
| `caddy-store.ts notifications` | Notification |
| `DOCTOR_PATIENTS` | PatientClinicLink + Visit (doctor view) |
