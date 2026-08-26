-- מעקב מכולות - בסיס נתונים
create extension if not exists pgcrypto;

create table if not exists public.container_movements (
  id uuid primary key default gen_random_uuid(),
  container_no text not null,
  agent text not null,
  container_type integer not null check (container_type in (20,40)),
  current_location text not null,
  target_location text not null,
  movement_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists container_movements_movement_at_idx
  on public.container_movements (movement_at desc);

create index if not exists container_movements_container_no_idx
  on public.container_movements (container_no);

alter table public.container_movements enable row level security;

-- גרסה ראשונית: כל מי שיש לו גישה לאפליקציה יכול לקרוא/להוסיף/למחוק.
-- לפני שימוש חיצוני מומלץ להוסיף התחברות והרשאות.
drop policy if exists "container_movements_read" on public.container_movements;
create policy "container_movements_read"
on public.container_movements for select
to anon, authenticated
using (true);

drop policy if exists "container_movements_insert" on public.container_movements;
create policy "container_movements_insert"
on public.container_movements for insert
to anon, authenticated
with check (true);

drop policy if exists "container_movements_delete" on public.container_movements;
create policy "container_movements_delete"
on public.container_movements for delete
to anon, authenticated
using (true);
