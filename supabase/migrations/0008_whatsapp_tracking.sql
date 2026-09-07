-- Bijhouden of/wanneer een factuur of herinnering ook via WhatsApp is
-- verstuurd (naast e-mail) — puur informatief, stuurt geen logica aan.
alter table invoices add column if not exists whatsapp_sent_at timestamptz;
alter table reminder_log add column if not exists sent_via_whatsapp boolean not null default false;
