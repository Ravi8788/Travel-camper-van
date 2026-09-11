-- Only customer-role users may create pending bookings.
drop policy if exists "Authenticated users can create pending bookings" on public.bookings;
drop policy if exists "Customer users can create pending bookings" on public.bookings;

create policy "Customer users can create pending bookings"
on public.bookings
for insert
to authenticated
with check (
  status = 'pending'
  and payment_status = 'pending'
  and exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'customer'
  )
);
