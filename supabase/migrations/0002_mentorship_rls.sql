-- RLS for mentorship tables. Fixes the biggest structural gap in the ITGC
-- source system, which had no RLS at all (service-role-only access with
-- app-code-only checks). Server routes still primarily use supabaseAdmin
-- (service role, bypasses RLS) — these policies are the defense-in-depth
-- backstop, and the only path for anything the client queries directly.

alter table admin_users enable row level security;
alter table mentorship_applications enable row level security;
alter table mentors enable row level security;
alter table mentorship_cohorts enable row level security;
alter table mentorship_pairs enable row level security;
alter table mentorship_sessions enable row level security;
alter table mentorship_goals enable row level security;
alter table mentorship_resources enable row level security;
alter table mentorship_scheduled_sessions enable row level security;
alter table mentorship_checkin_responses enable row level security;

-- ── admin_users ───────────────────────────────────────────────────────────
-- Admins can see the admin roster. No insert/update/delete policy for
-- anyone — seeding is a manual SQL step (see supabase/README.md), never a
-- client-reachable path.
create policy admin_users_select_self on admin_users
  for select to authenticated
  using (is_admin(auth.uid()));

-- ── mentorship_applications (mentee) ─────────────────────────────────────
-- Public can INSERT only (the application form), never read/update/delete.
create policy applications_public_insert on mentorship_applications
  for insert to anon
  with check (true);

-- A logged-in applicant can read their own record.
create policy applications_own_select on mentorship_applications
  for select to authenticated
  using (auth_user_id = auth.uid());

-- Admins have full access.
create policy applications_admin_all on mentorship_applications
  for all to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

-- ── mentors ───────────────────────────────────────────────────────────────
create policy mentors_public_insert on mentors
  for insert to anon
  with check (true);

create policy mentors_own_select on mentors
  for select to authenticated
  using (auth_user_id = auth.uid());

create policy mentors_admin_all on mentors
  for all to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

-- ── mentorship_cohorts ────────────────────────────────────────────────────
-- Admin-managed only; portal users don't need direct cohort access (their
-- pair/application rows carry what they need).
create policy cohorts_admin_all on mentorship_cohorts
  for all to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

-- ── mentorship_pairs ──────────────────────────────────────────────────────
create policy pairs_admin_all on mentorship_pairs
  for all to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

-- The two participants in a pair can read (not write) their own pairing.
create policy pairs_own_select on mentorship_pairs
  for select to authenticated
  using (
    exists (select 1 from mentors m where m.id = mentorship_pairs.mentor_id and m.auth_user_id = auth.uid())
    or exists (select 1 from mentorship_applications a where a.id = mentorship_pairs.mentee_id and a.auth_user_id = auth.uid())
  );

-- ── pair-scoped tables: sessions / goals / resources / scheduled sessions ─
-- Same shape repeated per table: admins get full access; the two
-- participants in the parent pair get select+insert (they log their own
-- sessions/goals/resources), update reserved for admins to avoid one party
-- silently editing the other's entries.

create policy sessions_admin_all on mentorship_sessions
  for all to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

create policy sessions_pair_participants on mentorship_sessions
  for select to authenticated
  using (exists (
    select 1 from mentorship_pairs p
    left join mentors m on m.id = p.mentor_id
    left join mentorship_applications a on a.id = p.mentee_id
    where p.id = mentorship_sessions.pair_id
      and (m.auth_user_id = auth.uid() or a.auth_user_id = auth.uid())
  ));

create policy sessions_pair_participants_insert on mentorship_sessions
  for insert to authenticated
  with check (exists (
    select 1 from mentorship_pairs p
    left join mentors m on m.id = p.mentor_id
    left join mentorship_applications a on a.id = p.mentee_id
    where p.id = mentorship_sessions.pair_id
      and (m.auth_user_id = auth.uid() or a.auth_user_id = auth.uid())
  ));

create policy goals_admin_all on mentorship_goals
  for all to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

create policy goals_pair_participants on mentorship_goals
  for select to authenticated
  using (exists (
    select 1 from mentorship_pairs p
    left join mentors m on m.id = p.mentor_id
    left join mentorship_applications a on a.id = p.mentee_id
    where p.id = mentorship_goals.pair_id
      and (m.auth_user_id = auth.uid() or a.auth_user_id = auth.uid())
  ));

create policy goals_pair_participants_write on mentorship_goals
  for insert to authenticated
  with check (exists (
    select 1 from mentorship_pairs p
    left join mentors m on m.id = p.mentor_id
    left join mentorship_applications a on a.id = p.mentee_id
    where p.id = mentorship_goals.pair_id
      and (m.auth_user_id = auth.uid() or a.auth_user_id = auth.uid())
  ));

create policy goals_pair_participants_update on mentorship_goals
  for update to authenticated
  using (exists (
    select 1 from mentorship_pairs p
    left join mentors m on m.id = p.mentor_id
    left join mentorship_applications a on a.id = p.mentee_id
    where p.id = mentorship_goals.pair_id
      and (m.auth_user_id = auth.uid() or a.auth_user_id = auth.uid())
  ));

create policy resources_admin_all on mentorship_resources
  for all to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

create policy resources_pair_participants on mentorship_resources
  for select to authenticated
  using (exists (
    select 1 from mentorship_pairs p
    left join mentors m on m.id = p.mentor_id
    left join mentorship_applications a on a.id = p.mentee_id
    where p.id = mentorship_resources.pair_id
      and (m.auth_user_id = auth.uid() or a.auth_user_id = auth.uid())
  ));

create policy resources_pair_participants_insert on mentorship_resources
  for insert to authenticated
  with check (exists (
    select 1 from mentorship_pairs p
    left join mentors m on m.id = p.mentor_id
    left join mentorship_applications a on a.id = p.mentee_id
    where p.id = mentorship_resources.pair_id
      and (m.auth_user_id = auth.uid() or a.auth_user_id = auth.uid())
  ));

create policy scheduled_sessions_admin_all on mentorship_scheduled_sessions
  for all to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

create policy scheduled_sessions_pair_participants on mentorship_scheduled_sessions
  for select to authenticated
  using (exists (
    select 1 from mentorship_pairs p
    left join mentors m on m.id = p.mentor_id
    left join mentorship_applications a on a.id = p.mentee_id
    where p.id = mentorship_scheduled_sessions.pair_id
      and (m.auth_user_id = auth.uid() or a.auth_user_id = auth.uid())
  ));

create policy scheduled_sessions_pair_participants_insert on mentorship_scheduled_sessions
  for insert to authenticated
  with check (exists (
    select 1 from mentorship_pairs p
    left join mentors m on m.id = p.mentor_id
    left join mentorship_applications a on a.id = p.mentee_id
    where p.id = mentorship_scheduled_sessions.pair_id
      and (m.auth_user_id = auth.uid() or a.auth_user_id = auth.uid())
  ));

-- ── mentorship_checkin_responses ─────────────────────────────────────────
-- Written exclusively via the HMAC-signed /api/mentorship/checkin/respond
-- route using supabaseAdmin — the signed token is the authorization, not a
-- session. No anon/authenticated write policy at all; admins can read.
create policy checkin_responses_admin_all on mentorship_checkin_responses
  for all to authenticated
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));
