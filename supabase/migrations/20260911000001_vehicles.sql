-- Live vehicle inventory for Travel On Wheels.
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  model text not null default '',
  registration_number text not null default '',
  description text not null default '',
  short_description text not null default '',
  price_per_day numeric(12, 2) not null default 0 check (price_per_day >= 0),
  security_deposit numeric(12, 2) not null default 0 check (security_deposit >= 0),
  passenger_capacity integer not null default 1 check (passenger_capacity > 0),
  sleeping_capacity integer not null default 1 check (sleeping_capacity > 0),
  fuel_type text not null default 'diesel' check (fuel_type in ('petrol', 'diesel', 'cng', 'electric')),
  transmission text not null default 'manual' check (transmission in ('manual', 'automatic')),
  dimensions jsonb not null default '{"lengthFt":0,"widthFt":0,"heightFt":0}'::jsonb,
  dimensions_text text not null default '',
  driving_requirements text[] not null default '{}',
  driving_requirements_text text not null default '',
  amenities text[] not null default '{}',
  facilities jsonb not null default '{"bedroom":[],"washroom":[],"kitchen":[],"storage":[],"charging":[]}'::jsonb,
  facility_details jsonb not null default '{"sleeping":"","kitchen":"","washroom":"","storage":"","charging":"","essentials":[]}'::jsonb,
  images text[] not null default '{}',
  image_tags jsonb not null default '{"exterior":[],"interior":[],"kitchen":[],"bedroom":[],"washroom":[],"storage":[]}'::jsonb,
  video_url text,
  cover_image text,
  additional_charges jsonb not null default '[]'::jsonb,
  status text not null default 'available' check (status in ('available', 'booked', 'on_rent', 'maintenance', 'inactive')),
  featured boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.vehicles enable row level security;
create index if not exists vehicles_status_idx on public.vehicles(status);

insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Anyone can read vehicle images" on storage.objects;
create policy "Anyone can read vehicle images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'vehicle-images');

drop policy if exists "Admins can upload vehicle images" on storage.objects;
create policy "Admins can upload vehicle images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'vehicle-images' and (select public.is_admin()));

drop policy if exists "Admins can update vehicle images" on storage.objects;
create policy "Admins can update vehicle images"
on storage.objects for update
to authenticated
using (bucket_id = 'vehicle-images' and (select public.is_admin()))
with check (bucket_id = 'vehicle-images' and (select public.is_admin()));

drop policy if exists "Admins can delete vehicle images" on storage.objects;
create policy "Admins can delete vehicle images"
on storage.objects for delete
to authenticated
using (bucket_id = 'vehicle-images' and (select public.is_admin()));

drop policy if exists "Anyone can read active vehicles" on public.vehicles;
create policy "Anyone can read active vehicles" on public.vehicles for select to anon, authenticated using (status <> 'inactive');
drop policy if exists "Admins can manage vehicles" on public.vehicles;
create policy "Admins can manage vehicles" on public.vehicles for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
