-- 1. subscription：本人は読むだけ。書き込みはサーバー（service role）だけにする
drop policy "update policy" on public.subscription;
drop policy "Enable insert for users based on user_id" on public.subscription;
drop policy "Enable delete for users based on user_id" on public.subscription;
drop policy "Enable read access for all users" on public.subscription;
create policy "Users can read their own subscription" on public.subscription
  for select to authenticated using ((select auth.uid()) = user_id);

-- 2. profile：全員が読めるポリシーと、無条件のINSERTを削除。本人が更新できる列を name / avatar_url に限定
drop policy "Enable read access for all users" on public.profile;
drop policy "Enable insert for authenticated users only" on public.profile;
revoke update on public.profile from anon, authenticated;
grant update (name, avatar_url) on public.profile to authenticated;

-- 3. user_with_profile：自分の行だけを返すようにし、anon からは読めなくする
create or replace view public.user_with_profile as
 select u.id as user_id, u.email, u.created_at,
        p.id as profile_id, p.name, p.avatar_url, p.stripe_uuid
   from auth.users u
   left join public.profile p on p.supabase_uuid = u.id
  where u.id = auth.uid();
revoke all on public.user_with_profile from anon;
revoke insert, update, delete on public.user_with_profile from authenticated;
