-- Profiles: one per auth user
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  birth_date date,
  locale text not null default 'en' check (locale in ('en','pt','es')),
  ai_training_opt_in boolean not null default false,
  plan text not null default 'free' check (plan in ('free','supporter')),
  terms_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Dreams: one row per dream; reinterpretations live in interpretations
create table public.dreams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  content text not null check (char_length(content) between 10 and 8000),
  dreamed_on date not null default current_date,
  sentiment smallint check (sentiment between -1 and 1),
  search tsvector generated always as (
    to_tsvector('simple', coalesce(title,'') || ' ' || content)
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index dreams_user_dreamed_idx on public.dreams (user_id, dreamed_on desc);
create index dreams_search_idx on public.dreams using gin (search);

create table public.interpretations (
  id uuid primary key default gen_random_uuid(),
  dream_id uuid not null references public.dreams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  style text not null check (style in ('default','freud','jung','emotional','spiritual','cultural','science')),
  content text not null,
  model text not null,
  feedback smallint check (feedback in (-1, 1)),
  created_at timestamptz not null default now()
);
create index interpretations_dream_idx on public.interpretations (dream_id, created_at desc);
create index interpretations_user_idx on public.interpretations (user_id, created_at desc);

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger dreams_updated_at before update on public.dreams
  for each row execute function public.set_updated_at();

-- Create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, locale, terms_accepted_at)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'locale',''), 'en'),
    case when (new.raw_user_meta_data->>'terms_accepted')::boolean then now() else null end
  );
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.dreams enable row level security;
alter table public.interpretations enable row level security;

create policy "profiles: owner read" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles: owner update" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "dreams: owner read" on public.dreams for select to authenticated using ((select auth.uid()) = user_id);
create policy "dreams: owner insert" on public.dreams for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "dreams: owner update" on public.dreams for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "dreams: owner delete" on public.dreams for delete to authenticated using ((select auth.uid()) = user_id);

create policy "interp: owner read" on public.interpretations for select to authenticated using ((select auth.uid()) = user_id);
create policy "interp: owner insert" on public.interpretations for insert to authenticated
  with check ((select auth.uid()) = user_id and exists (select 1 from public.dreams d where d.id = dream_id and d.user_id = (select auth.uid())));
create policy "interp: owner feedback" on public.interpretations for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "interp: owner delete" on public.interpretations for delete to authenticated using ((select auth.uid()) = user_id);

-- (superseded by 20261105202959_harden_profile_grants: column revoke has no effect under a table-level grant)
revoke update (plan) on public.profiles from authenticated;

-- Account deletion by the user themselves (LGPD/GDPR erasure)
create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = '' as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not authenticated'; end if;
  delete from auth.users where id = uid;
end $$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- Free-tier quota check, counted server-side
create or replace function public.interpretations_used()
returns integer language sql stable security invoker set search_path = '' as $$
  select count(*)::int from public.interpretations where user_id = (select auth.uid());
$$;
