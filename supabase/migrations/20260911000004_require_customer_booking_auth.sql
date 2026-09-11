-- Require a Supabase-authenticated customer for every new booking.
-- This replaces the previous anonymous insert policy from 20260911000003.
drop policy if exists "Guests can create pending bookings" on public.bookings;
drop policy if exists "Authenticated users can create pending bookings" on public.bookings;

create policy "Authenticated users can create pending bookings"
on public.bookings
for insert
to authenticated
with check (
  status = 'pending'
  and payment_status = 'pending'
);
