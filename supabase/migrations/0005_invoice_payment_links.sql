-- Mollie-betaallink per factuur, zodat de klant van de taxi-ondernemer
-- (niet de taxi-ondernemer zelf) de factuur direct online kan betalen — o.a.
-- met iDEAL, wat wél mag voor eenmalige betalingen (in tegenstelling tot de
-- terugkerende RitFactuur-abonnementsbetaling, die geen iDEAL ondersteunt).
alter table invoices add column if not exists mollie_payment_id text;
alter table invoices add column if not exists payment_url text;

create index if not exists invoices_mollie_payment_id_idx on invoices (mollie_payment_id);
