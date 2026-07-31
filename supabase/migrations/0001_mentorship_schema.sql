-- Mentorship Program schema.
-- Reverse-engineered/hardened successor of IT Gulf Coast's mentorship tables,
-- rebuilt for Tee's House with a real minor/parental-consent flow.

-- ── Admin capability ─────────────────────────────────────────────────────
-- No pre-existing members/admin table in this project, so this is new and
-- minimal. Seeded manually (see supabase/README.md) — no self-serve signup.
create table admin_users (
  id           uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  email        text not null,
  created_at   timestamptz not null default now()
);

create or replace function is_admin(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admin_users where auth_user_id = uid);
$$;

-- ── Mentee applications ──────────────────────────────────────────────────
create table mentorship_applications (
  id                       uuid primary key default gen_random_uuid(),
  first_name               text not null,
  last_name                text not null,
  email                     text not null unique,
  phone                     text,
  linked_in                 text,
  grade_level               text,
  experience_level          text,
  areas_of_interest         text[] not null default '{}',
  looking_for                text[] not null default '{}',
  availability                text[] not null default '{}',
  bio                       text,
  date_of_birth             date not null,
  is_minor                  boolean not null default false,
  parent_name               text,
  parent_email              text,
  parent_token               text unique,
  parent_token_expires_at   timestamptz,
  parent_consent             boolean not null default false,
  parent_consent_at         timestamptz,
  consent_expires_at        timestamptz,
  agreed_to_terms           boolean not null default false,
  agreed_at                 timestamptz,
  status                    text not null default 'pending'
                              check (status in ('pending','reviewing','matched','active','completed','declined')),
  auth_user_id              uuid references auth.users(id),
  mentor_name                text,
  mentor_email                text,
  matched_at                 timestamptz,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);

create index on mentorship_applications (status);
create index on mentorship_applications (email);

-- ── Mentors ───────────────────────────────────────────────────────────────
create table mentors (
  id                    uuid primary key default gen_random_uuid(),
  first_name             text not null,
  last_name               text not null,
  email                   text not null unique,
  phone                   text,
  linkedin_url             text,
  company                 text,
  job_title                text,
  years_experience         int,
  bio                     text,
  location                text,
  areas_of_expertise       text[] not null default '{}',
  certifications           text[] not null default '{}',
  industries               text[] not null default '{}',
  mentoring_style          text[] not null default '{}',
  max_mentees              int not null default 2,
  availability             text[] not null default '{}',
  agreed_to_terms          boolean not null default false,
  agreed_at                timestamptz,
  background_self_cert     boolean not null default false,
  status                   text not null default 'pending'
                              check (status in ('pending','approved','active','inactive')),
  approved_at              timestamptz,
  auth_user_id             uuid references auth.users(id),
  photo_url                text,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- ── Cohorts ───────────────────────────────────────────────────────────────
create table mentorship_cohorts (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  season       text,
  year         int not null,
  start_date   date,
  end_date     date,
  max_pairs    int not null default 20,
  description  text,
  created_by   uuid references admin_users(id),
  status       text not null default 'upcoming' check (status in ('upcoming','active','completed')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── Pairs ─────────────────────────────────────────────────────────────────
create table mentorship_pairs (
  id                     uuid primary key default gen_random_uuid(),
  mentor_id               uuid not null references mentors(id),
  mentee_id               uuid not null references mentorship_applications(id),
  cohort_id               uuid references mentorship_cohorts(id),
  assigned_by             uuid references admin_users(id),
  status                  text not null default 'active' check (status in ('active','completed','ended_early')),
  started_at              timestamptz,
  ended_at                timestamptz,
  session_count            int not null default 0,
  last_session_at          timestamptz,
  flagged                  boolean not null default false,
  flag_reason              text,
  certificate_token        text unique,
  certificate_issued_at    timestamptz,
  checkin_sent_at          timestamptz,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index on mentorship_pairs (mentor_id);
create index on mentorship_pairs (mentee_id);
create index on mentorship_pairs (cohort_id);

-- Hard gate: a minor mentee cannot be placed in / kept in an active pair
-- without valid, unexpired parental consent. This is the backstop for the
-- consent flow described in supabase/README.md — app code also checks this
-- explicitly first so the failure surfaces as a clean 400, not a raw
-- Postgres error.
create or replace function enforce_minor_consent() returns trigger
language plpgsql as $$
declare
  app mentorship_applications%rowtype;
begin
  select * into app from mentorship_applications where id = new.mentee_id;
  if app.is_minor and (
       app.parent_consent is not true
       or app.consent_expires_at is null
       or app.consent_expires_at < now()
     ) then
    raise exception 'Cannot create/activate pair: mentee is a minor without valid parental consent';
  end if;
  return new;
end;
$$;

create trigger trg_enforce_minor_consent
  before insert or update of status on mentorship_pairs
  for each row execute function enforce_minor_consent();

-- Avoids a race-prone read-then-write increment in app code.
create or replace function increment_session_count(pair_id uuid) returns void
language sql as $$
  update mentorship_pairs
  set session_count = session_count + 1, last_session_at = now(), updated_at = now()
  where id = pair_id;
$$;

-- ── Sessions / goals / resources / scheduled sessions / check-ins ─────────
create table mentorship_sessions (
  id                 uuid primary key default gen_random_uuid(),
  pair_id             uuid not null references mentorship_pairs(id) on delete cascade,
  session_date        date not null,
  duration_mins        int,
  format              text,
  topics              text[] not null default '{}',
  summary             text,
  mentor_notes         text,
  next_session_date    date,
  action_items         text,
  logged_by            uuid,
  created_at           timestamptz not null default now()
);

create index on mentorship_sessions (pair_id);

create table mentorship_goals (
  id            uuid primary key default gen_random_uuid(),
  pair_id        uuid not null references mentorship_pairs(id) on delete cascade,
  title          text not null,
  description    text,
  target_date    date,
  created_by     uuid,
  status         text not null default 'in_progress' check (status in ('in_progress','completed','dropped')),
  completed_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index on mentorship_goals (pair_id);

create table mentorship_resources (
  id            uuid primary key default gen_random_uuid(),
  pair_id        uuid not null references mentorship_pairs(id) on delete cascade,
  title          text not null,
  url            text,
  description    text,
  category       text,
  added_by       uuid,
  created_at     timestamptz not null default now()
);

create index on mentorship_resources (pair_id);

create table mentorship_scheduled_sessions (
  id                uuid primary key default gen_random_uuid(),
  pair_id            uuid not null references mentorship_pairs(id) on delete cascade,
  scheduled_date      date not null,
  duration_mins        int,
  format              text,
  agenda              text,
  notes               text,
  meet_link            text,
  scheduled_by         uuid,
  status               text not null default 'scheduled' check (status in ('scheduled','completed','cancelled')),
  created_at           timestamptz not null default now()
);

create index on mentorship_scheduled_sessions (pair_id);

create table mentorship_checkin_responses (
  id            uuid primary key default gen_random_uuid(),
  pair_id        uuid not null references mentorship_pairs(id) on delete cascade,
  role           text not null check (role in ('mentor','mentee')),
  rating         int check (rating between 1 and 5),
  token          text unique,
  responded_at   timestamptz,
  created_at     timestamptz not null default now()
);

create index on mentorship_checkin_responses (pair_id);
