-- מעקב מכולות v2.3 — תמונה בלבד + שמירת תאריך מקור בעריכה

alter table public.container_movements
  alter column container_no drop not null;

alter table public.container_movements
  alter column container_type drop not null;

-- אם עמודות נוספות עדיין הוגדרו NOT NULL בגרסה ישנה, אפשר צילום בלבד:
alter table public.container_movements
  alter column agent drop not null;

alter table public.container_movements
  alter column current_location drop not null;

alter table public.container_movements
  alter column target_location drop not null;
