-- Logo voor op de factuur-PDF.
alter table tenants add column if not exists logo_url text;

-- Contactformulier-inzendingen (support). Geen admin-UI in v1 — bekijk via
-- de Supabase Table Editor. Zie docs/setup.md voor hoe hier notificaties
-- op te zetten via n8n.
create table if not exists support_messages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants (id) on delete set null,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table support_messages enable row level security;

-- Iedereen (ook uitgelogd) mag een bericht aanmaken, niemand mag ze via de
-- app terug lezen (dat gebeurt via de Supabase dashboard/service-role).
create policy "support_messages_insert_anyone" on support_messages
  for insert
  with check (true);

-- Storage bucket voor tenant-logo's op facturen.
insert into storage.buckets (id, name, public)
values ('branding', 'branding', true)
on conflict (id) do nothing;

create policy "branding_tenant_rw" on storage.objects
  for all using (
    bucket_id = 'branding'
    and (storage.foldername(name))[1] = current_tenant_id()::text
  )
  with check (
    bucket_id = 'branding'
    and (storage.foldername(name))[1] = current_tenant_id()::text
  );
