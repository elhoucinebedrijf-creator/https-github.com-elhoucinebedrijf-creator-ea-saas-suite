# BTW-compliance checklist (NL)

Niet-onderhandelbaar voor elke gegenereerde factuur — dit is wat de Belastingdienst
verplicht stelt op een factuur. Voor het factuur-HTML-template in
`app/api/internal/invoice-html/[id]/route.ts` is elk punt hieronder al verwerkt;
gebruik deze lijst om te controleren of dat na wijzigingen zo blijft.

- [ ] Volledige bedrijfsnaam en adres van de opsteller (tenant)
- [ ] KVK-nummer van de opsteller
- [ ] BTW-identificatienummer van de opsteller
- [ ] Naam en adres van de klant
- [ ] Factuurdatum
- [ ] Uniek, opeenvolgend factuurnummer zonder gaten (`generate_invoice_number`
      in `supabase/migrations/0001_init.sql` — reserveert atomisch binnen één
      transactie, nooit los aanroepen)
- [ ] Omschrijving van de geleverde dienst (rit: datum + van/naar)
- [ ] Aantal/hoeveelheid
- [ ] Bedrag excl. BTW per regel
- [ ] Toegepast BTW-tarief per regel (standaard 9% voor personenvervoer)
- [ ] BTW-bedrag, uitgesplitst per tarief indien van toepassing
- [ ] Totaalbedrag incl. BTW
- [ ] Vervaldatum / betalingstermijn
- [ ] IBAN voor betaling

## Bewust uitgesteld (zie plan — niet MVP-blokkerend)

- BTW-verlegd / reverse charge
- Creditnota's (v1: factuur op status "cancelled", geen correctiedocument)
- Marge-regeling
- Multi-currency (v1: uitsluitend EUR)

## Aanbeveling

Laat dit template (en met name de BTW-berekening in `lib/invoice/calc.ts`)
vóór productiegebruik met echte klanten kort langslopen door een boekhouder
of fiscalist — dit document is een engineering-checklist, geen fiscaal advies.
