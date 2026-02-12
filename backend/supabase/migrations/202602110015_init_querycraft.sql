create extension if not exists pgcrypto;

create table if not exists public.database_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  connection_name text not null,
  host text not null,
  port integer not null default 5432,
  database_name text not null,
  username text not null,
  encrypted_password text not null,
  database_type text not null check (database_type in ('postgresql', 'mysql')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_queries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  connection_id uuid not null references public.database_connections(id) on delete cascade,
  query_name text not null,
  query_config jsonb not null,
  generated_sql text not null,
  last_executed timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.query_executions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  query_id uuid references public.saved_queries(id) on delete set null,
  executed_sql text not null,
  rows_returned integer not null default 0,
  execution_time_ms integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_database_connections_user_id on public.database_connections(user_id);
create index if not exists idx_saved_queries_user_id on public.saved_queries(user_id);
create index if not exists idx_saved_queries_connection_id on public.saved_queries(connection_id);
create index if not exists idx_query_executions_user_id on public.query_executions(user_id);
create index if not exists idx_query_executions_created_at on public.query_executions(created_at desc);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_database_connections_updated_at on public.database_connections;
create trigger trg_database_connections_updated_at
before update on public.database_connections
for each row
execute function public.handle_updated_at();

alter table public.database_connections enable row level security;
alter table public.saved_queries enable row level security;
alter table public.query_executions enable row level security;

drop policy if exists "Users can view own connections" on public.database_connections;
create policy "Users can view own connections"
  on public.database_connections
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own connections" on public.database_connections;
create policy "Users can insert own connections"
  on public.database_connections
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own connections" on public.database_connections;
create policy "Users can update own connections"
  on public.database_connections
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own connections" on public.database_connections;
create policy "Users can delete own connections"
  on public.database_connections
  for delete
  using (auth.uid() = user_id);

drop policy if exists "Users can view own queries" on public.saved_queries;
create policy "Users can view own queries"
  on public.saved_queries
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own queries" on public.saved_queries;
create policy "Users can insert own queries"
  on public.saved_queries
  for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.database_connections dc
      where dc.id = connection_id
        and dc.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update own queries" on public.saved_queries;
create policy "Users can update own queries"
  on public.saved_queries
  for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.database_connections dc
      where dc.id = connection_id
        and dc.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete own queries" on public.saved_queries;
create policy "Users can delete own queries"
  on public.saved_queries
  for delete
  using (auth.uid() = user_id);

drop policy if exists "Users can view own executions" on public.query_executions;
create policy "Users can view own executions"
  on public.query_executions
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own executions" on public.query_executions;
create policy "Users can insert own executions"
  on public.query_executions
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own executions" on public.query_executions;
create policy "Users can delete own executions"
  on public.query_executions
  for delete
  using (auth.uid() = user_id);
