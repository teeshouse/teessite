# Supabase migrations

Apply in order via the Supabase SQL editor (project → SQL Editor) or the
Supabase CLI (`supabase db push`), against project `fwgrxykyctwqrwujxdpl`:

1. `migrations/0001_mentorship_schema.sql` — tables, the minor-consent
   enforcement trigger, `increment_session_count()`.
2. `migrations/0002_mentorship_rls.sql` — RLS policies.

## Seeding the first admin

There's no signup UI for admins by design (avoids a chicken-and-egg "who can
create the first admin" hole) — it's a two-step manual process:

1. Create the person's login: Supabase Dashboard → Authentication → Users →
   Add User (email + password, or send an invite). Copy the resulting user's
   UUID.
2. In the SQL Editor, run:
   ```sql
   insert into admin_users (auth_user_id, email)
   values ('<uuid-from-step-1>', 'tierra@teeshouse.org');
   ```

Repeat step 2 for each additional admin. There is no self-service path —
this is intentional for a 2-person admin team.

## Verifying the minor-consent trigger

After applying `0001_mentorship_schema.sql`, sanity-check the safeguard
before building anything on top of it:

```sql
-- Insert a minor mentee with no consent yet.
insert into mentorship_applications (first_name, last_name, email, date_of_birth, is_minor)
values ('Test', 'Minor', 'test-minor@example.com', '2012-01-01', true)
returning id;

-- Insert a mentor to pair against (or reuse an existing one).
insert into mentors (first_name, last_name, email) values ('Test', 'Mentor', 'test-mentor@example.com') returning id;

-- This should FAIL with "Cannot create/activate pair: mentee is a minor
-- without valid parental consent" — parent_consent is still false.
insert into mentorship_pairs (mentor_id, mentee_id) values ('<mentor-id>', '<mentee-id>');

-- Grant consent, then retry — this should now succeed.
update mentorship_applications
set parent_consent = true, parent_consent_at = now(), consent_expires_at = now() + interval '1 year'
where id = '<mentee-id>';

insert into mentorship_pairs (mentor_id, mentee_id) values ('<mentor-id>', '<mentee-id>');
```

Clean up the test rows afterward (`delete from mentorship_pairs ...`, etc.)
— they're not fixtures, just a one-time smoke test.
