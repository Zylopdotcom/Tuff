-- Badge ids the learner has earned, e.g. {'pathfinder','first-level'}.
-- Already applied to the codepath Supabase project; kept here as a record.
alter table public.users add column if not exists badges text[] not null default '{}';
