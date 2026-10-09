-- 1. get_script_count：未ログイン（anon）からは呼べなくする
--    Postgres は関数の実行権限を PUBLIC（全ロール）にも付けるため、PUBLIC からも外す。
--    台本の作成上限をチェックする RLS が authenticated ロールでこの関数を呼ぶので、authenticated の権限は残す
revoke execute on function public.get_script_count(uuid) from anon, public;

-- 2. 使っていない Stripe Wrapper を削除する
drop schema if exists stripe cascade;                        -- 外部テーブル customers / prices / products / subscriptions
drop server if exists stripe_wrapper_server cascade;
drop foreign data wrapper if exists stripe_wrapper cascade;

-- 3. avatars バケットを作る（db push で本番にも作られるように migration に書く）
--    上限は、アプリのバリデーション（1MB、JPEG / PNG）に合わせる
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', false, 1048576, array['image/jpeg', 'image/png'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
