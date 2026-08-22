-- Repair: older posts table may exist without scheduled_at / published_at / updated_at
-- Safe to re-run.

alter table if exists public.profiles
  add column if not exists full_name text,
  add column if not exists avatar_url text,
  add column if not exists company_name text,
  add column if not exists role text default 'user',
  add column if not exists plan text default 'free',
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

alter table if exists public.social_accounts
  add column if not exists account_handle text default '',
  add column if not exists profile_image_url text default '',
  add column if not exists followers_count integer default 0,
  add column if not exists is_active boolean default true,
  add column if not exists created_at timestamptz default now();

alter table if exists public.posts
  add column if not exists account_id uuid,
  add column if not exists content text,
  add column if not exists status text default 'draft',
  add column if not exists scheduled_at timestamptz,
  add column if not exists published_at timestamptz,
  add column if not exists ai_generated boolean default false,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

alter table if exists public.subscriptions
  add column if not exists plan text default 'free',
  add column if not exists status text default 'active',
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists current_period_end timestamptz,
  add column if not exists created_at timestamptz default now();

create index if not exists social_accounts_user_id_idx on public.social_accounts (user_id);
create index if not exists posts_user_id_idx on public.posts (user_id);
create index if not exists posts_scheduled_at_idx on public.posts (scheduled_at);
create index if not exists posts_status_idx on public.posts (status);
