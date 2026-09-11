-- Live vehicle inventory for Travel On Wheels.
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  model text not null default '',
  description text not null default '',
  short_description text not null default '',
  price_per_day numeric(12, 2) not null default 0 check (price_per_day >= 0),
  security_deposit numeric(12, 2) not null default 0 check (security_deposit >= 0),
  passenger_capacity integer not null default 1 check (passenger_capacity > 0),
  sleeping_capacity integer not null default 1 check (sleeping_capacity > 0),
  fuel_type text not null default 'diesel',
  transmission text not null default 'manual',
  dimensions jsonb not null default '{}'::jsonb,
  driving_requirements text[] not null default '{}',
  amenities text[] not null default '{}',
  facilities jsonb not null default '{}'::jsonb,
  images text[] not null default '{}',
  video_url text,
  status text not null default 'available' check (status in ('available', 'booked', 'maintenance', 'inactive')),
  featured boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.vehicles enable row level security;
create index if not exists vehicles_status_idx on public.vehicles(status);

drop policy if exists "Anyone can read active vehicles" on public.vehicles;
create policy "Anyone can read active vehicles" on public.vehicles for select to anon, authenticated using (status <> 'inactive');
drop policy if exists "Admins can manage vehicles" on public.vehicles;
create policy "Admins can manage vehicles" on public.vehicles for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
