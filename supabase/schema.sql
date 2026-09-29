-- DreamCatcher Homes — database schema
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run.

create extension if not exists pgcrypto;

-- ─── Admins ─────────────────────────────────────────────────────────────
-- Only emails listed here can use the admin panel.
create table if not exists public.admins (
  email text primary key
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins where email = auth.jwt() ->> 'email')
$$;

-- ─── Bookings ───────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  villa       text check (villa in ('two-bedroom', 'deluxe')),
  checkin     date not null,
  checkout    date not null,
  adults      int  not null default 2 check (adults between 0 and 20),
  children    int  not null default 0 check (children between 0 and 20),
  name        text not null check (length(name) <= 200),
  phone       text not null default '' check (length(phone) <= 50),
  email       text check (length(email) <= 200),
  requests    text check (length(requests) <= 2000),
  status      text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'blocked')),
  source      text not null default 'website' check (length(source) <= 50),
  notes       text check (length(notes) <= 4000),
  constraint dates_ok check (checkout > checkin)
);
create index if not exists bookings_dates on public.bookings (checkin, checkout);

-- ─── Messages (contact form) ────────────────────────────────────────────
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (length(name) <= 200),
  email       text not null check (length(email) <= 200),
  phone       text check (length(phone) <= 50),
  subject     text check (length(subject) <= 200),
  message     text not null check (length(message) <= 5000),
  read        boolean not null default false
);

-- ─── Reviews ────────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (length(name) <= 100),
  country     text not null default '' check (length(country) <= 100),
  text        text not null check (length(text) <= 2000),
  rating      int  not null default 10 check (rating between 1 and 10),
  published   boolean not null default true
);

-- ─── Row-level security ─────────────────────────────────────────────────
alter table public.admins   enable row level security;
alter table public.bookings enable row level security;
alter table public.messages enable row level security;
alter table public.reviews  enable row level security;

-- Visitors may only submit new, pending website requests and messages.
drop policy if exists "visitors request bookings" on public.bookings;
create policy "visitors request bookings" on public.bookings
  for insert to anon, authenticated
  with check (status = 'pending' and source = 'website' and notes is null);

drop policy if exists "visitors send messages" on public.messages;
create policy "visitors send messages" on public.messages
  for insert to anon, authenticated
  with check (read = false);

drop policy if exists "visitors read published reviews" on public.reviews;
create policy "visitors read published reviews" on public.reviews
  for select to anon, authenticated
  using (published);

-- Admins can do everything.
drop policy if exists "admins manage bookings" on public.bookings;
create policy "admins manage bookings" on public.bookings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage messages" on public.messages;
create policy "admins manage messages" on public.messages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage reviews" on public.reviews;
create policy "admins manage reviews" on public.reviews
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins read admins" on public.admins;
create policy "admins read admins" on public.admins
  for select to authenticated using (public.is_admin());

-- Public availability: only dates + villa, never guest details.
create or replace function public.booked_ranges()
returns table (villa text, checkin date, checkout date)
language sql
security definer
set search_path = public
stable
as $$
  select villa, checkin, checkout
  from public.bookings
  where status in ('confirmed', 'blocked') and checkout >= current_date
$$;
grant execute on function public.booked_ranges() to anon, authenticated;
grant execute on function public.is_admin() to authenticated;

-- ─── Your admin account ─────────────────────────────────────────────────
-- 1. Authentication → Users → Add user (email + password).
-- 2. Replace the email below with that address and run this line:
-- insert into public.admins (email) values ('you@example.com');
