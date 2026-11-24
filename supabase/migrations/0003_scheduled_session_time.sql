-- Scheduled sessions need a time of day, not just a date. The column was a
-- plain `date`, so the time picked in the portal was discarded and the date
-- showed up a day early. Existing rows keep their day (as midnight Central).
alter table mentorship_scheduled_sessions
  alter column scheduled_date type timestamptz
  using (scheduled_date::timestamp at time zone 'America/Chicago');
