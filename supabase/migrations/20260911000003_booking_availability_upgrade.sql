-- Booking and availability upgrade. Keeps the existing public.availability table name.
alter table public.bookings add column if not exists guest_name text;
alter table public.bookings add column if not exists guest_email text;
alter table public.bookings add column if not exists guest_phone text;
alter table public.bookings add column if not exists travellers integer not null default 1 check (travellers > 0);
alter table public.bookings add column if not exists booking_status text;

update public.bookings set booking_status = status where booking_status is null;

alter table public.bookings drop constraint if exists bookings_status_check;
alter table public.bookings add constraint bookings_status_check check (status in ('pending','confirmed','completed','cancelled','rejected'));

create index if not exists bookings_vehicle_dates_idx on public.bookings(vehicle_id, start_date, end_date);
create index if not exists availability_vehicle_date_idx on public.availability(vehicle_id, date);

-- Guests can create pending bookings only. They cannot update or delete bookings.
drop policy if exists "Guests can create pending bookings" on public.bookings;
create policy "Guests can create pending bookings" on public.bookings for insert to anon, authenticated with check (status = 'pending' and payment_status = 'pending');
