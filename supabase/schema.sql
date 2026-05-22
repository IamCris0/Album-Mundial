create extension if not exists "pgcrypto";

create table if not exists public.album_pages (
  id uuid primary key default gen_random_uuid(),
  page_number integer unique not null,
  title text not null,
  section text,
  description text,
  created_at timestamp with time zone default now()
);

create table if not exists public.stickers (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  number text,
  album_page integer references public.album_pages(page_number) on delete set null,
  section text,
  country text,
  name text not null,
  type text,
  rarity text,
  verified boolean default false,
  source text,
  image_url text,
  created_at timestamp with time zone default now()
);

create table if not exists public.user_stickers (
  id uuid primary key default gen_random_uuid(),
  sticker_id uuid not null references public.stickers(id) on delete cascade,
  profile_key text not null default 'ammycita-single-user',
  owned boolean default false,
  obtained_at timestamp with time zone,
  updated_at timestamp with time zone default now(),
  unique (profile_key, sticker_id)
);

create index if not exists stickers_album_page_idx on public.stickers(album_page);
create index if not exists stickers_country_idx on public.stickers(country);
create index if not exists stickers_section_idx on public.stickers(section);
create index if not exists user_stickers_profile_key_idx on public.user_stickers(profile_key);

alter table public.album_pages enable row level security;
alter table public.stickers enable row level security;
alter table public.user_stickers enable row level security;

create policy "Album pages are readable"
  on public.album_pages for select
  using (true);

create policy "Stickers are readable"
  on public.stickers for select
  using (true);

create policy "Single album progress is readable"
  on public.user_stickers for select
  using (profile_key = 'ammycita-single-user');

create policy "Single album progress can be inserted"
  on public.user_stickers for insert
  with check (profile_key = 'ammycita-single-user');

create policy "Single album progress can be updated"
  on public.user_stickers for update
  using (profile_key = 'ammycita-single-user')
  with check (profile_key = 'ammycita-single-user');

-- Para multiples usuarios en el futuro:
-- 1. Agrega auth_user_id uuid references auth.users(id) a user_stickers.
-- 2. Reemplaza profile_key por auth.uid() en las politicas.
-- 3. Exige autenticacion antes de insertar o actualizar progreso.
