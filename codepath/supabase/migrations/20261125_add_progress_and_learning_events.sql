-- Already applied to the codepath Supabase project; kept here as a record.

-- Completed levels, as "<pathId>:<stepIndex>:<levelId>" keys, so progress is kept per path.
alter table public.users add column if not exists completed_levels text[] not null default '{}';

-- One row per learning attempt (quiz answer, code review, hint, interview).
-- This is CodePath's own knowledge tracing dataset.
create table if not exists public.learning_events (
  id bigint generated always as identity primary key,
  user_email text not null references public.users(email) on delete cascade on update cascade,
  path text not null,
  step_index integer,
  level_id integer,
  kind text not null check (kind in ('quiz', 'review', 'hint', 'error_explained', 'interview')),
  correct boolean,
  detail jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists learning_events_user_time_idx on public.learning_events (user_email, created_at);

-- The website may add events but never read them: there is no select policy.
alter table public.learning_events enable row level security;
drop policy if exists "Allow anon insert" on public.learning_events;
create policy "Allow anon insert" on public.learning_events for insert to anon with check (true);
