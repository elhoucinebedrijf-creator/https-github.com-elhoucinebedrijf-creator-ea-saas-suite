# ClaimBewijs live wijzigingsvoorstel

Deze wijzigingen zijn nodig om `EA ClaimBewijs` echt aan de nieuwe SaaS-suite te koppelen. Nog niet automatisch uitgevoerd.

## Eerste verkoopbare v1 workflows

Activeer en test eerst alleen deze workflows:

| Stap | Workflow | n8n webhookpad | Status tijdens audit |
| --- | --- | --- | --- |
| 1 | EA ClaimBewijs AI - Claimrisico intake | `claimbewijs/intake` | inactive |
| 2 | EA ClaimBewijs AI - Bewijs upload | `claimbewijs/evidence-upload` | inactive |
| 3 | EA ClaimBewijs AI - Bewijs validatie | `claimbewijs/evidence-validation` | inactive |
| 4 | EA ClaimBewijs AI - Claimextractie | `claimbewijs/claim-extraction` | inactive |
| 5 | EA ClaimBewijs AI - PDF claimrapport en adviesmail | `claimbewijs/report-mail` | inactive |
| 6 | EA ClaimBewijs AI - Portaal dossier sync | `claimbewijs/portal/sync` | inactive |
| 7 | EA ClaimBewijs AI - Betaalde toegang activeren | `claimbewijs/access/activate` | inactive |

## HTTP Request URL vervangen

Alle ClaimBewijs HTTP Request nodes wijzen nu naar:

`https://ea-claimbewijs-ai.wiskundehv.chatgpt.site/api/n8n/...`

Vervang dit bij de v1-workflows door jouw live SaaS-domein:

`https://claimbewijs.elhoucineautomation.nl/api/n8n/claimbewijs/...`

Voorbeelden:

- `/api/n8n/intake` -> `/api/n8n/claimbewijs/intake`
- `/api/n8n/evidence-upload` -> `/api/n8n/claimbewijs/evidence-upload`
- `/api/n8n/evidence-validation` -> `/api/n8n/claimbewijs/evidence-validation`
- `/api/n8n/claim-extraction` -> `/api/n8n/claimbewijs/claim-extraction`
- `/api/n8n/reports/generate` -> `/api/n8n/claimbewijs/reports/generate`
- `/api/n8n/portal/sync` -> `/api/n8n/claimbewijs/portal/sync`
- `/api/n8n/access/activate` -> `/api/n8n/claimbewijs/access/activate`

## Header toevoegen

Voeg aan elke HTTP Request node toe:

`x-ea-signature: {{N8N_SHARED_SECRET}}`

## Pas uitvoeren na akkoord

Ik kan deze n8n-wijzigingen via de API voorbereiden/uitvoeren zodra:

- het live SaaS-domein of deployment-URL bekend is;
- je bevestigt dat ik de workflows mag wijzigen;
- we afspreken of ik workflows ook mag activeren of alleen de URLs/headers mag aanpassen.

Voorbereid script:

- Dry-run: `node scripts/apply-claimbewijs-n8n-patch.mjs`
- Live toepassen: `node scripts/apply-claimbewijs-n8n-patch.mjs --apply`

Het script activeert geen workflows. Het wijzigt alleen de HTTP Request URL's en voegt `x-ea-signature` toe.
