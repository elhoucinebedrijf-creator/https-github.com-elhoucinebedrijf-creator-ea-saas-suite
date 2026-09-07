-- RitFactuur — initiële schema
-- Multi-tenant (per taxibedrijf) facturatie-SaaS. Tenant-isolatie via RLS op
-- basis van auth.uid() -> profiles.tenant_id.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- tenants
-- ---------------------------------------------------------------------------
create table tenants (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  kvk_number text,
  btw_number text,
  iban text,
  address_line text,
  postal_code text,
  city text,
  invoice_prefix text not null default 'RF',
  next_invoice_seq integer not null default 1,
  subscription_status text not null default 'trialing'
    check (subscription_status in ('trialing', 'active', 'past_due', 'canceled')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- profiles (koppelt auth.users aan een tenant)
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  tenant_id uuid not null references tenants (id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'staff')),
  full_name text,
  email text not null,
  created_at timestamptz not null default now()
);

create index profiles_tenant_id_idx on profiles (tenant_id);

-- Stable functie die de tenant van de huidige gebruiker teruggeeft.
-- security definer zodat RLS op profiles zichzelf niet in de weg zit.
create or replace function current_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select tenant_id from profiles where id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- clients (de klanten van het taxibedrijf: particulier/bedrijf/zorgverzekeraar)
-- ---------------------------------------------------------------------------
create table clients (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null default current_tenant_id() references tenants (id) on delete cascade,
  name text not null,
  type text not null default 'particulier'
    check (type in ('particulier', 'bedrijf', 'zorgverzekeraar')),
  email text,
  address_line text,
  postal_code text,
  city text,
  kvk_number text,
  btw_number text,
  payment_terms_days integer not null default 14,
  created_at timestamptz not null default now()
);

create index clients_tenant_id_idx on clients (tenant_id);

-- ---------------------------------------------------------------------------
-- file_uploads (CSV-uploads met rittendata)
-- ---------------------------------------------------------------------------
create table file_uploads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null default current_tenant_id() references tenants (id) on delete cascade,
  storage_path text not null,
  status text not null default 'pending'
    check (status in ('pending', 'parsed', 'failed')),
  parsed_ride_count integer,
  error_message text,
  uploaded_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

create index file_uploads_tenant_id_idx on file_uploads (tenant_id);

-- ---------------------------------------------------------------------------
-- invoices (aangemaakt vóór de PDF bestaat — status volgt de levenscyclus)
-- ---------------------------------------------------------------------------
create table invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants (id) on delete cascade,
  client_id uuid not null references clients (id),
  invoice_number text not null,
  invoice_date date not null default current_date,
  due_date date not null,
  status text not null default 'draft'
    check (status in ('draft', 'generated', 'sent', 'paid', 'overdue', 'cancelled')),
  subtotal_excl_btw integer not null default 0, -- centen
  btw_total integer not null default 0, -- centen
  total_incl_btw integer not null default 0, -- centen
  pdf_url text,
  sent_at timestamptz,
  paid_at timestamptz,
  payment_reference text,
  created_at timestamptz not null default now(),
  unique (tenant_id, invoice_number)
);

create index invoices_tenant_id_idx on invoices (tenant_id);
create index invoices_client_id_idx on invoices (client_id);
create index invoices_status_idx on invoices (status);

-- ---------------------------------------------------------------------------
-- rides
-- ---------------------------------------------------------------------------
create table rides (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null default current_tenant_id() references tenants (id) on delete cascade,
  client_id uuid references clients (id),
  ride_date date not null,
  pickup_address text,
  dropoff_address text,
  distance_km numeric(8, 2),
  amount_excl_btw integer not null, -- centen
  btw_rate integer not null default 9 check (btw_rate in (0, 9, 21)),
  amount_incl_btw integer not null,
  source text not null default 'manual' check (source in ('csv_upload', 'manual')),
  file_upload_id uuid references file_uploads (id),
  external_ride_id text,
  invoice_id uuid references invoices (id),
  status text not null default 'unbilled' check (status in ('unbilled', 'invoiced')),
  raw_data jsonb,
  created_at timestamptz not null default now()
);

create index rides_tenant_id_idx on rides (tenant_id);
create index rides_client_id_idx on rides (client_id);
create index rides_status_idx on rides (status);
create index rides_invoice_id_idx on rides (invoice_id);

-- ---------------------------------------------------------------------------
-- invoice_line_items
-- ---------------------------------------------------------------------------
create table invoice_line_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices (id) on delete cascade,
  ride_id uuid references rides (id),
  description text not null,
  quantity numeric(8, 2) not null default 1,
  unit_price_excl_btw integer not null, -- centen
  btw_rate integer not null default 9 check (btw_rate in (0, 9, 21)),
  line_total_excl_btw integer not null,
  line_btw_amount integer not null,
  line_total_incl_btw integer not null
);

create index invoice_line_items_invoice_id_idx on invoice_line_items (invoice_id);

-- ---------------------------------------------------------------------------
-- reminder_log
-- ---------------------------------------------------------------------------
create table reminder_log (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices (id) on delete cascade,
  sent_at timestamptz not null default now(),
  reminder_number integer not null default 1
);

-- ---------------------------------------------------------------------------
-- subscriptions (SaaS-abonnement van de tenant zelf, via Mollie)
-- ---------------------------------------------------------------------------
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants (id) on delete cascade,
  plan text not null default 'starter',
  status text not null default 'trialing'
    check (status in ('trialing', 'active', 'past_due', 'canceled')),
  mollie_customer_id text,
  mollie_mandate_id text,
  current_period_start date,
  current_period_end date,
  price_cents integer not null default 2900,
  created_at timestamptz not null default now()
);

create index subscriptions_tenant_id_idx on subscriptions (tenant_id);

create table subscription_payments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants (id) on delete cascade,
  subscription_id uuid not null references subscriptions (id) on delete cascade,
  mollie_payment_id text not null,
  amount_cents integer not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'expired')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index subscription_payments_tenant_id_idx on subscription_payments (tenant_id);

-- ---------------------------------------------------------------------------
-- generate_invoice_number: reserveert atomisch het volgende factuurnummer.
-- Roep dit aan BINNEN dezelfde transactie als de invoices-insert vanuit de
-- Next.js server (nooit vanuit n8n) — dit voorkomt dubbele/overslagen
-- nummers bij gelijktijdige aanvragen.
-- ---------------------------------------------------------------------------
create or replace function generate_invoice_number(p_tenant_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prefix text;
  v_seq integer;
  v_year text := to_char(current_date, 'YYYY');
begin
  update tenants
  set next_invoice_seq = next_invoice_seq + 1
  where id = p_tenant_id
  returning invoice_prefix, next_invoice_seq - 1 into v_prefix, v_seq;

  if v_prefix is null then
    raise exception 'Tenant % niet gevonden', p_tenant_id;
  end if;

  return v_prefix || '-' || v_year || '-' || lpad(v_seq::text, 4, '0');
end;
$$;

-- ---------------------------------------------------------------------------
-- create_invoice_from_rides: atomisch een draft-factuur aanmaken uit een set
-- onfactureerde ritten van dezelfde klant. Reserveert het factuurnummer,
-- berekent totalen en zet de ritten op 'invoiced' — allemaal in één
-- transactie. Wordt aangeroepen vanuit de Next.js server (RLS-scoped
-- client), niet vanuit n8n: de invoice-rij moet bestaan vóórdat n8n de PDF
-- gaat genereren.
-- ---------------------------------------------------------------------------
create or replace function create_invoice_from_rides(
  p_client_id uuid,
  p_ride_ids uuid[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_invoice_id uuid;
  v_invoice_number text;
  v_payment_terms_days integer;
  v_subtotal integer := 0;
  v_btw_total integer := 0;
begin
  -- Tenant wordt afgeleid van de ingelogde gebruiker, nooit van een
  -- meegegeven parameter — voorkomt dat een caller een andere tenant_id
  -- kan opgeven en zo bij een andere tenant een factuur aanmaakt.
  v_tenant_id := current_tenant_id();
  if v_tenant_id is null then
    raise exception 'Geen tenant gekoppeld aan huidige gebruiker.';
  end if;

  select payment_terms_days into v_payment_terms_days
  from clients where id = p_client_id and tenant_id = v_tenant_id;

  if v_payment_terms_days is null then
    raise exception 'Klant % niet gevonden voor deze tenant', p_client_id;
  end if;

  v_invoice_number := generate_invoice_number(v_tenant_id);

  insert into invoices (
    tenant_id, client_id, invoice_number, invoice_date, due_date, status
  ) values (
    v_tenant_id, p_client_id, v_invoice_number, current_date,
    current_date + v_payment_terms_days, 'draft'
  )
  returning id into v_invoice_id;

  insert into invoice_line_items (
    invoice_id, ride_id, description, quantity,
    unit_price_excl_btw, btw_rate,
    line_total_excl_btw, line_btw_amount, line_total_incl_btw
  )
  select
    v_invoice_id,
    r.id,
    coalesce(r.pickup_address, 'Rit') || ' -> ' || coalesce(r.dropoff_address, '') ||
      ' (' || to_char(r.ride_date, 'DD-MM-YYYY') || ')',
    1,
    r.amount_excl_btw,
    r.btw_rate,
    r.amount_excl_btw,
    r.amount_incl_btw - r.amount_excl_btw,
    r.amount_incl_btw
  from rides r
  where r.id = any (p_ride_ids)
    and r.tenant_id = v_tenant_id
    and r.client_id = p_client_id
    and r.status = 'unbilled';

  select coalesce(sum(line_total_excl_btw), 0), coalesce(sum(line_btw_amount), 0)
  into v_subtotal, v_btw_total
  from invoice_line_items where invoice_id = v_invoice_id;

  if v_subtotal = 0 then
    raise exception 'Geen onfactureerde ritten gevonden voor deze selectie.';
  end if;

  update invoices
  set subtotal_excl_btw = v_subtotal,
      btw_total = v_btw_total,
      total_incl_btw = v_subtotal + v_btw_total
  where id = v_invoice_id;

  update rides
  set invoice_id = v_invoice_id, status = 'invoiced'
  where id = any (p_ride_ids)
    and tenant_id = v_tenant_id
    and client_id = p_client_id
    and status = 'unbilled';

  return v_invoice_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table tenants enable row level security;
alter table profiles enable row level security;
alter table clients enable row level security;
alter table file_uploads enable row level security;
alter table invoices enable row level security;
alter table rides enable row level security;
alter table invoice_line_items enable row level security;
alter table reminder_log enable row level security;
alter table subscriptions enable row level security;
alter table subscription_payments enable row level security;

-- profiles: gebruiker ziet alleen het eigen profiel
create policy "profiles_self" on profiles
  for select using (id = auth.uid());
create policy "profiles_self_update" on profiles
  for update using (id = auth.uid());

-- tenants: leden zien/bewerken alleen hun eigen tenant
create policy "tenants_member_select" on tenants
  for select using (id = current_tenant_id());
create policy "tenants_member_update" on tenants
  for update using (id = current_tenant_id());

-- Generieke tenant-scoped policy voor de overige tabellen.
create policy "clients_tenant_isolation" on clients
  for all using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

create policy "file_uploads_tenant_isolation" on file_uploads
  for all using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

create policy "invoices_tenant_isolation" on invoices
  for all using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

create policy "rides_tenant_isolation" on rides
  for all using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

create policy "invoice_line_items_tenant_isolation" on invoice_line_items
  for all using (
    invoice_id in (select id from invoices where tenant_id = current_tenant_id())
  )
  with check (
    invoice_id in (select id from invoices where tenant_id = current_tenant_id())
  );

create policy "reminder_log_tenant_isolation" on reminder_log
  for all using (
    invoice_id in (select id from invoices where tenant_id = current_tenant_id())
  )
  with check (
    invoice_id in (select id from invoices where tenant_id = current_tenant_id())
  );

create policy "subscriptions_tenant_isolation" on subscriptions
  for all using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

create policy "subscription_payments_tenant_isolation" on subscription_payments
  for all using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

-- Let op: n8n gebruikt de service-role key en omzeilt bovenstaande RLS
-- volledig. Elke query/insert vanuit n8n-workflows MOET zelf tenant_id
-- filteren/zetten — dit wordt niet door de database afgedwongen voor dat pad.
