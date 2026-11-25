-- Already applied to the codepath Supabase project; kept here as a record.
-- The old read policy only covered anonymous visitors. Signed-in users also need to read
-- avatars: uploads that replace a file (upsert) and listing their own folder both require it.
drop policy if exists "Allow public reads" on storage.objects;
create policy "Anyone can view avatars" on storage.objects for select to anon, authenticated
  using (bucket_id = 'avatars');
