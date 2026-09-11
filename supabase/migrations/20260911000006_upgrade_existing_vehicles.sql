-- Backfill the extended vehicle schema for projects where vehicles existed
-- before the richer vehicle editor was introduced.
alter table public.vehicles add column if not exists registration_number text not null default '';
alter table public.vehicles add column if not exists short_description text not null default '';
alter table public.vehicles add column if not exists security_deposit numeric(12, 2) not null default 0;
alter table public.vehicles add column if not exists sleeping_capacity integer not null default 1;
alter table public.vehicles add column if not exists fuel_type text not null default 'diesel';
alter table public.vehicles add column if not exists transmission text not null default 'manual';
alter table public.vehicles add column if not exists dimensions jsonb not null default '{"lengthFt":0,"widthFt":0,"heightFt":0}'::jsonb;
alter table public.vehicles add column if not exists dimensions_text text not null default '';
alter table public.vehicles add column if not exists driving_requirements text[] not null default '{}';
alter table public.vehicles add column if not exists driving_requirements_text text not null default '';
alter table public.vehicles add column if not exists amenities text[] not null default '{}';
alter table public.vehicles add column if not exists facilities jsonb not null default '{"bedroom":[],"washroom":[],"kitchen":[],"storage":[],"charging":[]}'::jsonb;
alter table public.vehicles add column if not exists facility_details jsonb not null default '{"sleeping":"","kitchen":"","washroom":"","storage":"","charging":"","essentials":[]}'::jsonb;
alter table public.vehicles add column if not exists images text[] not null default '{}';
alter table public.vehicles add column if not exists image_tags jsonb not null default '{"exterior":[],"interior":[],"kitchen":[],"bedroom":[],"washroom":[],"storage":[]}'::jsonb;
alter table public.vehicles add column if not exists video_url text;
alter table public.vehicles add column if not exists cover_image text;
alter table public.vehicles add column if not exists additional_charges jsonb not null default '[]'::jsonb;
alter table public.vehicles add column if not exists featured boolean not null default false;

create index if not exists vehicles_status_idx on public.vehicles(status);
