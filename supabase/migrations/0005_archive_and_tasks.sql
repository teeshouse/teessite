-- 1) ARCHIVING ---------------------------------------------------------------
-- A mentor or intern can be archived. An archived record no longer blocks the
-- same email from applying again, so "unique email" now only applies to
-- records that are not archived.

do $$
declare c record;
begin
  for c in
    select conrelid::regclass::text as tbl, conname
    from pg_constraint
    where conrelid in ('mentors'::regclass, 'mentorship_applications'::regclass)
      and (
        (contype = 'c' and pg_get_constraintdef(oid) ilike '%status%')
        or (contype = 'u' and pg_get_constraintdef(oid) ilike 'UNIQUE (email)')
      )
  loop
    execute format('alter table %s drop constraint %I', c.tbl, c.conname);
  end loop;
end $$;

alter table mentors add constraint mentors_status_check
  check (status in ('pending', 'approved', 'active', 'inactive', 'archived'));
alter table mentorship_applications add constraint mentorship_applications_status_check
  check (status in ('pending', 'reviewing', 'matched', 'active', 'completed', 'declined', 'archived'));

create unique index mentors_email_not_archived_key
  on mentors (lower(email)) where status <> 'archived';
create unique index mentorship_applications_email_not_archived_key
  on mentorship_applications (lower(email)) where status <> 'archived';


-- 2) TASKS (replace Goals) ----------------------------------------------------
-- A mentor creates tasks for their assigned intern, optionally with a due date.
-- Both people can add notes to a task, and a note can carry documents.

create table mentorship_tasks (
  id            uuid primary key default gen_random_uuid(),
  pair_id       uuid not null references mentorship_pairs(id) on delete cascade,
  title         text not null,
  description   text,
  due_date      date,
  status        text not null default 'open' check (status in ('open', 'submitted', 'completed')),
  created_by    uuid,
  completed_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index on mentorship_tasks (pair_id);

create table mentorship_task_notes (
  id              uuid primary key default gen_random_uuid(),
  task_id         uuid not null references mentorship_tasks(id) on delete cascade,
  author_role     text not null check (author_role in ('mentor', 'mentee')),
  author_auth_id  uuid,
  body            text not null default '',
  created_at      timestamptz not null default now()
);
create index on mentorship_task_notes (task_id);

create table mentorship_task_files (
  id            uuid primary key default gen_random_uuid(),
  note_id       uuid not null references mentorship_task_notes(id) on delete cascade,
  task_id       uuid not null references mentorship_tasks(id) on delete cascade,
  storage_path  text not null,
  file_name     text not null,
  content_type  text not null,
  size_bytes    int not null,
  created_at    timestamptz not null default now()
);
create index on mentorship_task_files (task_id);
create index on mentorship_task_files (note_id);

-- Only the website's server (service role) and admins can touch these tables
-- directly. Mentors and interns go through the portal, which checks that the
-- task belongs to their own pair.
alter table mentorship_tasks enable row level security;
alter table mentorship_task_notes enable row level security;
alter table mentorship_task_files enable row level security;

create policy tasks_admin_all on mentorship_tasks
  for all to authenticated using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
create policy task_notes_admin_all on mentorship_task_notes
  for all to authenticated using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
create policy task_files_admin_all on mentorship_task_files
  for all to authenticated using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- Private storage for uploaded documents: PNG, PDF and DOCX only, 4 MB each.
-- No public access; files are only handed out through short-lived links the
-- portal creates after checking the person belongs to the pair.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'mentorship-task-files', 'mentorship-task-files', false, 4194304,
  array['image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do update
  set public = false,
      file_size_limit = 4194304,
      allowed_mime_types = excluded.allowed_mime_types;
