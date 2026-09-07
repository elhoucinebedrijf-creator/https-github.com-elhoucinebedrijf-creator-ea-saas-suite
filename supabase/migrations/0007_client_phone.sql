-- Telefoonnummer bij klanten — nodig om klanten te kunnen bewerken met
-- volledige gegevens, en een voorwaarde voor toekomstige WhatsApp-verzending
-- van facturen (vereist een WhatsApp Business API-koppeling, zie docs).
alter table clients add column if not exists phone text;
