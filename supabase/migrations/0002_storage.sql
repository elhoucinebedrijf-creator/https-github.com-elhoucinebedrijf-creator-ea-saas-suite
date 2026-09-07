-- Storage bucket voor geüploade rittenbestanden (CSV). Privé bucket: bestanden
-- worden alleen via RLS-gecontroleerde paden (tenant_id/...) gelezen/geschreven.
insert into storage.buckets (id, name, public)
values ('ride-uploads', 'ride-uploads', false)
on conflict (id) do nothing;

-- Storage bucket voor gegenereerde factuur-PDF's. Ook privé; n8n schrijft
-- hierheen met de service-role key (bypassed RLS), de app leest terug via
-- een ondertekende URL of de publieke pdf_url die bij het genereren wordt
-- opgeslagen.
insert into storage.buckets (id, name, public)
values ('invoices', 'invoices', false)
on conflict (id) do nothing;

-- Gebruikers mogen alleen binnen hun eigen tenant-map (eerste padsegment =
-- tenant_id) lezen/schrijven in ride-uploads.
create policy "ride_uploads_tenant_rw" on storage.objects
  for all using (
    bucket_id = 'ride-uploads'
    and (storage.foldername(name))[1] = current_tenant_id()::text
  )
  with check (
    bucket_id = 'ride-uploads'
    and (storage.foldername(name))[1] = current_tenant_id()::text
  );

-- Gebruikers mogen hun eigen facturen lezen (geschreven door n8n via
-- service-role, dus geen browser-write policy nodig).
create policy "invoices_tenant_read" on storage.objects
  for select using (
    bucket_id = 'invoices'
    and (storage.foldername(name))[1] = current_tenant_id()::text
  );
