-- Live core admin data tables. Run after the packages and vehicles migrations.

create table if not exists public.customers (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '', email text not null, phone text not null default '', city text not null default '',
  date_of_birth date, licence_number text, status text not null default 'active' check (status in ('active','inactive','blocked')),
  notes text, created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(), booking_number text not null unique,
  vehicle_id uuid references public.vehicles(id) on delete set null, customer_id uuid references public.customers(id) on delete set null,
  start_date date not null, end_date date not null, pickup_location text not null, drop_location text not null,
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled','rejected')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','partial','refunded','failed')),
  rental_amount numeric(12,2) not null default 0, security_deposit numeric(12,2) not null default 0,
  additional_charges numeric(12,2) not null default 0, total_amount numeric(12,2) not null default 0,
  notes text, cancellation_reason text, created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now()),
  check (end_date >= start_date)
);

create table if not exists public.destinations (
  id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null, description text not null default '',
  short_description text not null default '', image text, recommended_duration text not null default '', route_info text not null default '',
  tags text[] not null default '{}', featured boolean not null default false, created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(), name text not null, description text not null default '', discount_percent integer not null default 0 check (discount_percent between 0 and 100),
  type text not null default 'seasonal', start_date date not null, end_date date not null, status text not null default 'draft' check (status in ('active','scheduled','expired','draft')),
  terms text[] not null default '{}', created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(), customer_id uuid references public.customers(id) on delete set null, vehicle_id uuid references public.vehicles(id) on delete set null,
  customer_name text not null default '', destination text not null default '', rating integer not null check (rating between 1 and 5), text text not null default '', photo_url text,
  status text not null default 'pending' check (status in ('pending','approved','rejected','featured')), created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.availability (
  id uuid primary key default gen_random_uuid(), vehicle_id uuid not null references public.vehicles(id) on delete cascade, date date not null,
  status text not null default 'available' check (status in ('available','booked','blocked','maintenance')), note text, unique(vehicle_id, date)
);

create table if not exists public.pricing_config (
  id boolean primary key default true, default_price_per_day numeric(12,2) not null default 0, default_security_deposit numeric(12,2) not null default 0,
  seasonal_pricing jsonb not null default '[]', additional_charges jsonb not null default '[]', updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.business_settings (
  id boolean primary key default true, business_name text not null default 'Travel On Wheels', tagline text not null default '', email text not null default '', phone text not null default '',
  whatsapp_number text not null default '', address text not null default '', city text not null default '', state text not null default '', pincode text not null default '', social_links jsonb not null default '{}',
  advance_booking_days integer not null default 4, cancellation_policy_text text not null default '', security_deposit_policy_text text not null default '', rental_agreement_text text not null default '', self_drive_conditions_text text not null default '', updated_at timestamptz not null default timezone('utc', now())
);

alter table public.customers enable row level security;
alter table public.bookings enable row level security;
alter table public.destinations enable row level security;
alter table public.offers enable row level security;
alter table public.reviews enable row level security;
alter table public.availability enable row level security;
alter table public.pricing_config enable row level security;
alter table public.business_settings enable row level security;

-- Admins own the operations data. Customers may read and create their own bookings/profile data.
drop policy if exists "Admins manage customers" on public.customers; create policy "Admins manage customers" on public.customers for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "Users read own customer profile" on public.customers; create policy "Users read own customer profile" on public.customers for select to authenticated using ((select auth.uid()) = id);
drop policy if exists "Admins manage bookings" on public.bookings; create policy "Admins manage bookings" on public.bookings for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "Users read own bookings" on public.bookings; create policy "Users read own bookings" on public.bookings for select to authenticated using (customer_id = (select auth.uid()));
drop policy if exists "Admins manage destinations" on public.destinations; create policy "Admins manage destinations" on public.destinations for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "Anyone read destinations" on public.destinations; create policy "Anyone read destinations" on public.destinations for select to anon, authenticated using (true);
drop policy if exists "Admins manage offers" on public.offers; create policy "Admins manage offers" on public.offers for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "Anyone read active offers" on public.offers; create policy "Anyone read active offers" on public.offers for select to anon, authenticated using (status = 'active');
drop policy if exists "Admins manage reviews" on public.reviews; create policy "Admins manage reviews" on public.reviews for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "Anyone read approved reviews" on public.reviews; create policy "Anyone read approved reviews" on public.reviews for select to anon, authenticated using (status in ('approved','featured'));
drop policy if exists "Admins manage availability" on public.availability; create policy "Admins manage availability" on public.availability for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "Anyone read availability" on public.availability; create policy "Anyone read availability" on public.availability for select to anon, authenticated using (true);
drop policy if exists "Admins manage pricing" on public.pricing_config; create policy "Admins manage pricing" on public.pricing_config for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "Anyone read pricing" on public.pricing_config; create policy "Anyone read pricing" on public.pricing_config for select to anon, authenticated using (true);
drop policy if exists "Admins manage settings" on public.business_settings; create policy "Admins manage settings" on public.business_settings for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
drop policy if exists "Anyone read settings" on public.business_settings; create policy "Anyone read settings" on public.business_settings for select to anon, authenticated using (true);
