-- Anonymous visitors could insert rows straight into these tables through the
-- public Supabase API, skipping the website's forms (validation, rate
-- limits, parental-consent logic) and choosing any column value, including
-- status, parent_consent, and auth_user_id.
--
-- The website never needs this: every form saves through a server route that
-- uses the service-role key, which bypasses row-level security. Dropping the
-- anonymous insert policies leaves RLS denying anything the anon key tries.

drop policy if exists applications_public_insert on mentorship_applications;
drop policy if exists mentors_public_insert on mentors;

-- volunteer_applications and contact_submissions had insert policies created
-- outside the migrations, so drop whatever anonymous insert policies exist on
-- the four tables rather than guessing their names.
do $$
declare p record;
begin
  for p in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('volunteer_applications', 'contact_submissions', 'mentorship_applications', 'mentors')
      and cmd in ('INSERT', 'ALL')
      and ('anon' = any(roles) or 'public' = any(roles))
  loop
    execute format('drop policy %I on %I.%I', p.policyname, p.schemaname, p.tablename);
  end loop;
end $$;
