create extension if not exists pgcrypto;

create table if not exists public.ea_products (
  key text primary key,
  name text not null,
  domain text,
  workflow_folder text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.ea_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  billing_email text not null,
  kvk_number text,
  vat_number text,
  plan_key text not null default 'starter',
  subscription_status text not null default 'trial',
  created_at timestamptz not null default now()
);

create table if not exists public.ea_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.ea_organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member', 'viewer')),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table if not exists public.ea_intakes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.ea_organizations(id) on delete set null,
  product_key text not null references public.ea_products(key),
  organization_name text not null,
  contact_name text,
  email text not null,
  phone text,
  source text not null default 'web',
  status text not null default 'received',
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.ea_cases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.ea_organizations(id) on delete cascade,
  product_key text not null references public.ea_products(key),
  title text not null,
  status text not null default 'open',
  risk_score numeric(5,2),
  summary text,
  metadata jsonb not null default '{}',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ea_uploads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.ea_organizations(id) on delete cascade,
  case_id uuid references public.ea_cases(id) on delete cascade,
  product_key text not null references public.ea_products(key),
  file_name text not null,
  storage_path text not null,
  mime_type text not null,
  status text not null default 'uploaded',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.ea_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.ea_organizations(id) on delete cascade,
  case_id uuid references public.ea_cases(id) on delete cascade,
  product_key text not null references public.ea_products(key),
  title text not null,
  status text not null default 'draft',
  report_html text,
  report_pdf_path text,
  sections jsonb not null default '[]',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.ea_payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.ea_organizations(id) on delete set null,
  product_key text references public.ea_products(key),
  provider text not null default 'mollie',
  provider_payment_id text,
  amount_cents integer,
  currency text not null default 'EUR',
  status text not null default 'created',
  checkout_url text,
  raw_payload jsonb not null default '{}',
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.ea_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.ea_organizations(id) on delete cascade,
  product_key text references public.ea_products(key),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.ea_support_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.ea_products enable row level security;
alter table public.ea_organizations enable row level security;
alter table public.ea_memberships enable row level security;
alter table public.ea_intakes enable row level security;
alter table public.ea_cases enable row level security;
alter table public.ea_uploads enable row level security;
alter table public.ea_reports enable row level security;
alter table public.ea_payments enable row level security;
alter table public.ea_audit_logs enable row level security;
alter table public.ea_support_messages enable row level security;

create or replace function public.ea_is_member(target_org uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.ea_memberships
    where organization_id = target_org
      and user_id = auth.uid()
  );
$$;

drop policy if exists "products are public readable" on public.ea_products;
create policy "products are public readable"
on public.ea_products for select
using (true);

drop policy if exists "members can read their organizations" on public.ea_organizations;
create policy "members can read their organizations"
on public.ea_organizations for select
using (public.ea_is_member(id));

drop policy if exists "members can read memberships" on public.ea_memberships;
create policy "members can read memberships"
on public.ea_memberships for select
using (public.ea_is_member(organization_id));

drop policy if exists "members can read cases" on public.ea_cases;
create policy "members can read cases"
on public.ea_cases for select
using (public.ea_is_member(organization_id));

drop policy if exists "members can manage cases" on public.ea_cases;
create policy "members can manage cases"
on public.ea_cases for insert
with check (public.ea_is_member(organization_id));

drop policy if exists "members can read uploads" on public.ea_uploads;
create policy "members can read uploads"
on public.ea_uploads for select
using (public.ea_is_member(organization_id));

drop policy if exists "members can read reports" on public.ea_reports;
create policy "members can read reports"
on public.ea_reports for select
using (public.ea_is_member(organization_id));

drop policy if exists "members can read payments" on public.ea_payments;
create policy "members can read payments"
on public.ea_payments for select
using (organization_id is not null and public.ea_is_member(organization_id));

drop policy if exists "members can read audit logs" on public.ea_audit_logs;
create policy "members can read audit logs"
on public.ea_audit_logs for select
using (organization_id is not null and public.ea_is_member(organization_id));

insert into public.ea_products (key, name, domain, workflow_folder)
values
  ('claimbewijs', 'EA ClaimBewijs', 'claimbewijs.elhoucineautomation.nl', 'EA ClaimBewijs'),
  ('factuurketen', 'EA FactuurKeten', null, 'EA FactuurKeten'),
  ('regeldrukradar', 'EA RegeldrukRadar', null, 'EA RegeldrukRadar'),
  ('businessflow', 'EA BusinessFlow Analyzer', 'businessflow.elhoucineautomation.nl', 'EA BusinessFlow Analyzer'),
  ('smbautomate', 'EA SMB Automate', 'smbautomate.elhoucineautomation.nl', 'EA SMB Automate'),
  ('eduflow', 'EA EduFlow', 'eduflow.elhoucineautomation.nl', 'EA EduFlow'),
  ('freelanceflow', 'EA FreelanceFlow', 'freelanceflow.elhoucineautomation.nl', 'EA FreelanceFlow'),
  ('zzp-compliance', 'EA ZZP Compliance Assistant', null, 'EA ZZP Compliance Assistant'),
  ('mkb-integrator', 'EA MKB Bedrijfsproces Integrator', null, 'EA MKB Bedrijfsproces Integrator'),
  ('klantenservice-assistent', 'EA AI Klantenservice Assistent', null, 'EA AI Klantenservice Assistent'),
  ('invoice-cashflow', 'EA Smart Invoice & Cashflow Manager', null, 'EA Smart Invoice & Cashflow Manager'),
  ('content-repurposing', 'EA Content Repurposing Engine', null, 'EA Content Repurposing Engine')
on conflict (key) do update
set name = excluded.name,
    domain = excluded.domain,
    workflow_folder = excluded.workflow_folder;
