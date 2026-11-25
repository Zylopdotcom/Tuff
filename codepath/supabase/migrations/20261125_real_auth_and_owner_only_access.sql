-- Already applied to the codepath Supabase project; kept here as a record.
-- Real login: every profile belongs to a Supabase Auth user, and each user can only
-- see and change their own data. All existing accounts were deleted before this ran.

-- 1. Profiles are keyed by the Auth user id; deleting the Auth user deletes the profile.
alter table public.users alter column id drop default;
alter table public.users
  add constraint users_id_fkey foreign key (id) references auth.users(id) on delete cascade;

-- 2. Replace the old open policies with owner-only ones.
drop policy if exists "Allow public insert" on public.users;
drop policy if exists "Allow public select" on public.users;
drop policy if exists "Allow update" on public.users;
create policy "Users read own profile" on public.users for select to authenticated using (id = (select auth.uid()));
create policy "Users create own profile" on public.users for insert to authenticated with check (id = (select auth.uid()));
create policy "Users update own profile" on public.users for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- 3. Learning events belong to a user id instead of an email.
alter table public.learning_events drop column user_email;
alter table public.learning_events
  add column user_id uuid not null references public.users(id) on delete cascade;
drop index if exists learning_events_user_time_idx;
create index learning_events_user_time_idx on public.learning_events (user_id, created_at);
drop policy if exists "Allow anon insert" on public.learning_events;
create policy "Users log own events" on public.learning_events for insert to authenticated
  with check (user_id = (select auth.uid()));
-- Still no select policy: the website can add events but never read them.

-- 4. Deleting an account removes the signed-in user only (and, by cascade, their profile and events).
drop function if exists public.delete_account(text);
create or replace function public.delete_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;
revoke all on function public.delete_account() from public, anon;
grant execute on function public.delete_account() to authenticated;

-- 5. Avatars: anyone may view them (public bucket), but each user may only write in their own folder.
drop policy if exists "Allow public uploads" on storage.objects;
create policy "Users upload own avatar" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Users replace own avatar" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Users delete own avatar" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
