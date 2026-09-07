-- Fix: create_invoice_from_rides had een race condition. De oorspronkelijke
-- volgorde was: factuurregels aanmaken (op basis van status = 'unbilled') ->
-- ritten pas ná afloop op 'invoiced' zetten. Bij twee (bijna) gelijktijdige
-- aanroepen (bv. dubbelklik, of trage verbinding + herhaalde poging) konden
-- beide transacties dezelfde ritten nog als 'unbilled' zien en allebei een
-- factuur aanmaken voor dezelfde ritten.
--
-- Fix: de ritten worden nu eerst geclaimd via een UPDATE ... RETURNING (met
-- status = 'unbilled' in de WHERE-clause), rechtstreeks doorgesluisd naar de
-- invoice_line_items-insert via een data-wijzigende CTE. Dat is atomisch op
-- rijniveau: een tweede, gelijktijdige aanroep vindt dan geen 'unbilled'
-- rijen meer en faalt netjes met de bestaande foutmelding, in plaats van
-- een dubbele factuur te maken.
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
  v_claimed_count integer := 0;
begin
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

  -- Claim de ritten atomisch (UPDATE ... RETURNING binnen een CTE) en zet
  -- de geclaimde rijen in één statement direct om in factuurregels. Een
  -- gelijktijdige tweede aanroep met dezelfde ride_ids vindt hier niets meer
  -- (status is dan al 'invoiced'), en voegt dus niets dubbel toe.
  with claimed as (
    update rides
    set invoice_id = v_invoice_id, status = 'invoiced'
    where id = any (p_ride_ids)
      and tenant_id = v_tenant_id
      and client_id = p_client_id
      and status = 'unbilled'
    returning id, pickup_address, dropoff_address, ride_date,
              amount_excl_btw, btw_rate, amount_incl_btw
  )
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
  from claimed r;

  get diagnostics v_claimed_count = row_count;

  if v_claimed_count = 0 then
    -- Niets geclaimd (dubbele aanroep, of ritten al gefactureerd) — ruim de
    -- net aangemaakte lege factuur weer op i.p.v. 'm als vreemde eend te
    -- laten staan.
    delete from invoices where id = v_invoice_id;
    raise exception 'Geen onfactureerde ritten gevonden voor deze selectie.';
  end if;

  select coalesce(sum(line_total_excl_btw), 0), coalesce(sum(line_btw_amount), 0)
  into v_subtotal, v_btw_total
  from invoice_line_items where invoice_id = v_invoice_id;

  update invoices
  set subtotal_excl_btw = v_subtotal,
      btw_total = v_btw_total,
      total_incl_btw = v_subtotal + v_btw_total
  where id = v_invoice_id;

  return v_invoice_id;
end;
$$;
