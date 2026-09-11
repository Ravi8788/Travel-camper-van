-- Travel On Wheels Phase 1: package management and admin authorization
-- Run this migration in the Supabase SQL editor or through the Supabase CLI.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.profiles is 'Application roles for authenticated users. New users are customers by default.';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  location text not null check (length(trim(location)) > 0),
  description text not null default '',
  duration_days integer not null check (duration_days > 0),
  price numeric(12, 2) not null check (price >= 0),
  inclusions text[] not null default '{}',
  exclusions text[] not null default '{}',
  itinerary jsonb not null default '[]'::jsonb,
  images text[] not null default '{}',
  status text not null default 'Draft' check (status in ('Draft', 'Published', 'Unavailable')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on column public.packages.location is 'Extensible location label; launch values are Mahabaleshwar, Panchgani, and Tapola.';
comment on column public.packages.itinerary is 'JSON array of day objects, for example [{"day":1,"title":"...","activities":[]}].';

create index if not exists packages_status_idx on public.packages(status);
create index if not exists packages_location_idx on public.packages(location);

 drop trigger if exists packages_set_updated_at on public.packages;
create trigger packages_set_updated_at
before update on public.packages
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.packages enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

 drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

 drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles"
on public.profiles for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

 drop policy if exists "Anyone can read published packages" on public.packages;
create policy "Anyone can read published packages"
on public.packages for select
to anon, authenticated
using (status = 'Published');

 drop policy if exists "Admins can read all packages" on public.packages;
create policy "Admins can read all packages"
on public.packages for select
to authenticated
using ((select public.is_admin()));

 drop policy if exists "Admins can insert packages" on public.packages;
create policy "Admins can insert packages"
on public.packages for insert
to authenticated
with check ((select public.is_admin()));

 drop policy if exists "Admins can update packages" on public.packages;
create policy "Admins can update packages"
on public.packages for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

 drop policy if exists "Admins can delete packages" on public.packages;
create policy "Admins can delete packages"
on public.packages for delete
to authenticated
using ((select public.is_admin()));

insert into storage.buckets (id, name, public)
values ('package-images', 'package-images', true)
on conflict (id) do update set public = excluded.public;

 drop policy if exists "Anyone can read package images" on storage.objects;
create policy "Anyone can read package images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'package-images');

 drop policy if exists "Admins can upload package images" on storage.objects;
create policy "Admins can upload package images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'package-images' and (select public.is_admin()));

 drop policy if exists "Admins can update package images" on storage.objects;
create policy "Admins can update package images"
on storage.objects for update
to authenticated
using (bucket_id = 'package-images' and (select public.is_admin()))
with check (bucket_id = 'package-images' and (select public.is_admin()));

 drop policy if exists "Admins can delete package images" on storage.objects;
create policy "Admins can delete package images"
on storage.objects for delete
to authenticated
using (bucket_id = 'package-images' and (select public.is_admin()));

-- After creating the first account, promote it from the Supabase SQL editor.
-- Replace the email with the exact address used in Authentication > Users.
-- insert into public.profiles (id, role)
-- select id, 'admin'
-- from auth.users
-- where email = 'your-admin-email@example.com'
-- on conflict (id) do update set role = 'admin', updated_at = timezone('utc', now());
