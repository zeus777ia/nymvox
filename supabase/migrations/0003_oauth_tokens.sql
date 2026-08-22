alter table public.social_accounts add column if not exists access_token text;
alter table public.social_accounts add column if not exists refresh_token text;
alter table public.social_accounts add column if not exists token_expires_at timestamptz;
alter table public.social_accounts add column if not exists oauth_user_id text;
