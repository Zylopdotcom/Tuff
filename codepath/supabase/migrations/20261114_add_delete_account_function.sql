-- Lets the app delete one account by email. A function is used instead of an
-- open DELETE policy so a single request can never remove more than one row.
-- Already applied to the codepath Supabase project; kept here as a record.
create or replace function public.delete_account(p_email text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  deleted_count integer;
begin
  delete from public.users where email = p_email;
  get diagnostics deleted_count = row_count;
  return deleted_count > 0;
end;
$$;

revoke all on function public.delete_account(text) from public;
grant execute on function public.delete_account(text) to anon, authenticated;
