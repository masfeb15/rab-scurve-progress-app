-- Supabase schema untuk MVP RAB S-Curve Progress
-- Jalankan di Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner text,
  location text,
  contract_value numeric(18,2) default 0,
  start_date date,
  end_date date,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);


-- Kolom tambahan agar table projects selaras dengan Google Sheet "PROJECT MONITORING".
-- Mapping header Sheet:
-- KODE, NO. SPI, BULAN SPI, TAHUN SP, NAMA PROYEK, PEKERJAAN, JENIS, JENIS2,
-- WILAYAH, AREA, REKAN KERJA, DOK SPK/TERM PAYMENT, STATUS, % PROGRESS,
-- TGL BA/BAST, START, END, DURASI, DELAY, Tgl RETENSI, NAMA RELASI,
-- PIC SALES, PIC TEKNIK, NILAI KONTRAK.
alter table public.projects add column if not exists kode text;
alter table public.projects add column if not exists no_spi text;
alter table public.projects add column if not exists bulan_spi text;
alter table public.projects add column if not exists tahun_sp int;
alter table public.projects add column if not exists nama_proyek text;
alter table public.projects add column if not exists pekerjaan text;
alter table public.projects add column if not exists jenis text;
alter table public.projects add column if not exists jenis2 text;
alter table public.projects add column if not exists wilayah text;
alter table public.projects add column if not exists project_area text;
alter table public.projects add column if not exists rekan_kerja text;
alter table public.projects add column if not exists dok_spk_term_payment text;
alter table public.projects add column if not exists sheet_progress_percent numeric(12,6) default 0;
alter table public.projects add column if not exists tgl_ba_bast date;
alter table public.projects add column if not exists duration_days int;
alter table public.projects add column if not exists delay_days int;
alter table public.projects add column if not exists tgl_retensi date;
alter table public.projects add column if not exists nama_relasi text;
alter table public.projects add column if not exists pic_sales text;
alter table public.projects add column if not exists pic_teknik text;
alter table public.projects add column if not exists nilai_kontrak numeric(18,2);
alter table public.projects add column if not exists source_sheet_gid text;
alter table public.projects add column if not exists source_row_id text;
create unique index if not exists idx_projects_source_row on public.projects(source_row_id) where source_row_id is not null;
create index if not exists idx_projects_monitoring_filters on public.projects(status, wilayah, project_area);

create table if not exists public.boq_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  area text not null,
  code text,
  description text not null,
  unit text,
  volume numeric(18,4) default 0,
  unit_price numeric(18,2) default 0,
  total_price numeric(18,2) default 0,
  -- Boleh diisi dari Google Sheet. Jika kosong, app tetap bisa menghitung dari total_price / contract_value.
  weight_percent numeric(12,6),
  source_row_id text, -- optional: ID/baris unik dari Google Sheet agar sync bisa upsert
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(project_id, source_row_id)
);

create table if not exists public.progress_targets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  period_date date not null,
  planned_percent numeric(12,6) not null default 0, -- kumulatif 0-100
  source_row_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(project_id, period_date)
);

create table if not exists public.progress_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  boq_item_id uuid not null references public.boq_items(id) on delete cascade,
  entry_date date not null,
  actual_volume numeric(18,4) default 0,
  actual_percent numeric(12,6) not null default 0 check (actual_percent >= 0 and actual_percent <= 100),
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);


-- Kolom tambahan untuk template RAB bertingkat seperti: I PEKERJAAN SIPIL, II MEP, III INTERIOR.
alter table public.boq_items add column if not exists section_code text;
alter table public.boq_items add column if not exists section_name text;
alter table public.boq_items add column if not exists sort_order int;
create index if not exists idx_boq_items_section on public.boq_items(project_id, section_code, sort_order);

create index if not exists idx_boq_items_project_area on public.boq_items(project_id, area);
create index if not exists idx_targets_project_date on public.progress_targets(project_id, period_date);
create index if not exists idx_entries_project_date on public.progress_entries(project_id, entry_date);
create index if not exists idx_entries_item_date on public.progress_entries(boq_item_id, entry_date desc);

-- Auto set created_by dari user login jika client tidak mengirim.
create or replace function public.set_progress_created_by()
returns trigger language plpgsql security definer as $$
begin
  if new.created_by is null then
    new.created_by := auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_progress_created_by on public.progress_entries;
create trigger trg_progress_created_by
before insert on public.progress_entries
for each row execute function public.set_progress_created_by();

-- RLS MVP: semua user terautentikasi bisa baca master dan input progress.
-- Untuk produksi, bisa diperketat berdasarkan project_members/role.
alter table public.projects enable row level security;
alter table public.boq_items enable row level security;
alter table public.progress_targets enable row level security;
alter table public.progress_entries enable row level security;

drop policy if exists "authenticated can read projects" on public.projects;
create policy "authenticated can read projects" on public.projects
for select to authenticated using (true);

drop policy if exists "authenticated can read boq" on public.boq_items;
create policy "authenticated can read boq" on public.boq_items
for select to authenticated using (true);

drop policy if exists "authenticated can read targets" on public.progress_targets;
create policy "authenticated can read targets" on public.progress_targets
for select to authenticated using (true);

drop policy if exists "authenticated can read entries" on public.progress_entries;
create policy "authenticated can read entries" on public.progress_entries
for select to authenticated using (true);

drop policy if exists "authenticated can insert entries" on public.progress_entries;
create policy "authenticated can insert entries" on public.progress_entries
for insert to authenticated with check (auth.uid() = created_by or created_by is null);


-- Upload file RAB Excel/PDF per proyek.
create table if not exists public.rab_uploads (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  file_name text not null,
  file_type text,
  file_size bigint,
  storage_path text,
  status text default 'uploaded', -- uploaded/stored/imported/failed
  uploaded_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_rab_uploads_project on public.rab_uploads(project_id, created_at desc);

alter table public.rab_uploads enable row level security;

drop policy if exists "authenticated can read rab uploads" on public.rab_uploads;
create policy "authenticated can read rab uploads" on public.rab_uploads
for select to authenticated using (true);

drop policy if exists "authenticated can insert rab uploads" on public.rab_uploads;
create policy "authenticated can insert rab uploads" on public.rab_uploads
for insert to authenticated with check (auth.uid() = uploaded_by or uploaded_by is null);

-- Bucket Supabase Storage untuk file RAB.
-- Jika gagal karena permission, buat manual via Dashboard: Storage > New bucket > rab-files.
insert into storage.buckets (id, name, public)
values ('rab-files', 'rab-files', false)
on conflict (id) do nothing;

-- Policy storage: user login boleh upload/read file di bucket rab-files.
drop policy if exists "authenticated can upload rab files" on storage.objects;
create policy "authenticated can upload rab files" on storage.objects
for insert to authenticated
with check (bucket_id = 'rab-files');

drop policy if exists "authenticated can read rab files" on storage.objects;
create policy "authenticated can read rab files" on storage.objects
for select to authenticated
using (bucket_id = 'rab-files');

-- Optional seed contoh project. Hapus jika Google Sheet sudah sync data.
-- insert into public.projects (name, owner, location, contract_value, start_date, end_date)
-- values ('Renovasi Ruang OK RS Ibunda - Kupang', 'RS Ibunda', 'Kupang', 9857458390, '2026-06-01', '2026-09-30');
