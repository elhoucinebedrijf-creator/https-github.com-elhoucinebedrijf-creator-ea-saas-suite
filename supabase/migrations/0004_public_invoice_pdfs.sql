-- De "Invoice Generation" n8n-workflow slaat pdf_url op als een publieke
-- Storage-URL (/object/public/invoices/...). Dat werkt alleen als de bucket
-- ook echt publiek is — in 0002 stond hij per ongeluk op privé, terwijl de
-- RLS-policy tenant-scoped lezen via de API al regelde. Voor een simpele,
-- werkende PDF-link (zoals nu gebruikt in de facturen-pagina) maken we de
-- bucket publiek; het pad bevat tenant_id/invoice_id, dus niet direct
-- opzoekbaar zonder die UUID's te kennen.
update storage.buckets set public = true where id = 'invoices';
