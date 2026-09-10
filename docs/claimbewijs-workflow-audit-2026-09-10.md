# EA ClaimBewijs technische workflow-audit - 10 september 2026

Workflows gevonden: 15

## EA ClaimBewijs AI - Betaalde toegang activeren

- ID: 2mYdBdLXadnDF93N
- Status: inactive
- Nodes: 3
- Node: Webhook (webhook)
  - path: claimbewijs/access/activate
  - method: POST
- Node: ClaimBewijs API (httpRequest)
  - method: POST
  - url: https://ea-claimbewijs-ai.wiskundehv.chatgpt.site/api/n8n/access/activate
- Node: Response (respondToWebhook)
  - path: -
  - method: GET/POST
  - response: json

## EA ClaimBewijs AI - Bewijs upload

- ID: ubeRTFANX9ocndoz
- Status: inactive
- Nodes: 3
- Node: Webhook (webhook)
  - path: claimbewijs/evidence-upload
  - method: POST
- Node: ClaimBewijs API (httpRequest)
  - method: POST
  - url: https://ea-claimbewijs-ai.wiskundehv.chatgpt.site/api/n8n/evidence-upload
- Node: Response (respondToWebhook)
  - path: -
  - method: GET/POST
  - response: json

## EA ClaimBewijs AI - Bewijs validatie

- ID: nmXOoaBSYenHw0DD
- Status: inactive
- Nodes: 3
- Node: Webhook (webhook)
  - path: claimbewijs/evidence-validation
  - method: POST
- Node: ClaimBewijs API (httpRequest)
  - method: POST
  - url: https://ea-claimbewijs-ai.wiskundehv.chatgpt.site/api/n8n/evidence-validation
- Node: Response (respondToWebhook)
  - path: -
  - method: GET/POST
  - response: json

## EA ClaimBewijs AI - Bureau dashboard

- ID: 8vYwiTfPMyA2Kh2z
- Status: inactive
- Nodes: 3
- Node: Webhook (webhook)
  - path: claimbewijs/agency-dashboard
  - method: POST
- Node: ClaimBewijs API (httpRequest)
  - method: POST
  - url: https://ea-claimbewijs-ai.wiskundehv.chatgpt.site/api/n8n/agency-dashboard
- Node: Response (respondToWebhook)
  - path: -
  - method: GET/POST
  - response: json

## EA ClaimBewijs AI - Claimextractie

- ID: eoCYWlgKQNMgt9cK
- Status: inactive
- Nodes: 3
- Node: Webhook (webhook)
  - path: claimbewijs/claim-extraction
  - method: POST
- Node: ClaimBewijs API (httpRequest)
  - method: POST
  - url: https://ea-claimbewijs-ai.wiskundehv.chatgpt.site/api/n8n/claim-extraction
- Node: Response (respondToWebhook)
  - path: -
  - method: GET/POST
  - response: json

## EA ClaimBewijs AI - Claimrisico intake

- ID: CX7BqJfTgHvwnaPZ
- Status: inactive
- Nodes: 3
- Node: Webhook (webhook)
  - path: claimbewijs/intake
  - method: POST
- Node: ClaimBewijs API (httpRequest)
  - method: POST
  - url: https://ea-claimbewijs-ai.wiskundehv.chatgpt.site/api/n8n/intake
- Node: Response (respondToWebhook)
  - path: -
  - method: GET/POST
  - response: json

## EA ClaimBewijs AI - Greenwashing risico

- ID: FH6Ndj7tcgBlglUe
- Status: inactive
- Nodes: 3
- Node: Webhook (webhook)
  - path: claimbewijs/greenwashing-risk
  - method: POST
- Node: ClaimBewijs API (httpRequest)
  - method: POST
  - url: https://ea-claimbewijs-ai.wiskundehv.chatgpt.site/api/n8n/greenwashing-risk
- Node: Response (respondToWebhook)
  - path: -
  - method: GET/POST
  - response: json

## EA ClaimBewijs AI - Juridische onboarding mail

- ID: y949tTAZzAHQo9zB
- Status: active
- Nodes: 3
- Node: Webhook (webhook)
  - path: claimbewijs/onboarding/mail
  - method: POST
- Node: ClaimBewijs API (httpRequest)
  - method: POST
  - url: https://ea-claimbewijs-ai.wiskundehv.chatgpt.site/api/n8n/onboarding/mail
- Node: Response (respondToWebhook)
  - path: -
  - method: GET/POST
  - response: json

## EA ClaimBewijs AI - Klantuitnodiging bewijs

- ID: o5xI7Z47u7BanoWo
- Status: inactive
- Nodes: 3
- Node: Webhook (webhook)
  - path: claimbewijs/client-invite
  - method: POST
- Node: ClaimBewijs API (httpRequest)
  - method: POST
  - url: https://ea-claimbewijs-ai.wiskundehv.chatgpt.site/api/n8n/client-invite
- Node: Response (respondToWebhook)
  - path: -
  - method: GET/POST
  - response: json

## EA ClaimBewijs AI - Maandelijkse claimmonitoring

- ID: 5077M5Ny46iBmBC7
- Status: inactive
- Nodes: 3
- Node: Webhook (webhook)
  - path: claimbewijs/monthly-monitoring
  - method: POST
- Node: ClaimBewijs API (httpRequest)
  - method: POST
  - url: https://ea-claimbewijs-ai.wiskundehv.chatgpt.site/api/n8n/monthly-monitoring
- Node: Response (respondToWebhook)
  - path: -
  - method: GET/POST
  - response: json

## EA ClaimBewijs AI - Mollie betaling claimrapport

- ID: tl1hyxqlw2iKmd0k
- Status: inactive
- Nodes: 3
- Node: Webhook (webhook)
  - path: claimbewijs/mollie-payment
  - method: POST
- Node: ClaimBewijs API (httpRequest)
  - method: POST
  - url: https://ea-claimbewijs-ai.wiskundehv.chatgpt.site/api/n8n/mollie-payment
- Node: Response (respondToWebhook)
  - path: -
  - method: GET/POST
  - response: json

## EA ClaimBewijs AI - PDF claimrapport en adviesmail

- ID: SQrxiTxkg15igsjc
- Status: inactive
- Nodes: 3
- Node: Webhook (webhook)
  - path: claimbewijs/report-mail
  - method: POST
- Node: ClaimBewijs API (httpRequest)
  - method: POST
  - url: https://ea-claimbewijs-ai.wiskundehv.chatgpt.site/api/n8n/reports/generate
- Node: Response (respondToWebhook)
  - path: -
  - method: GET/POST
  - response: json

## EA ClaimBewijs AI - Portaal dossier sync

- ID: 1tuFrCqu33A94y9q
- Status: inactive
- Nodes: 3
- Node: Webhook (webhook)
  - path: claimbewijs/portal/sync
  - method: POST
- Node: ClaimBewijs API (httpRequest)
  - method: POST
  - url: https://ea-claimbewijs-ai.wiskundehv.chatgpt.site/api/n8n/portal/sync
- Node: Response (respondToWebhook)
  - path: -
  - method: GET/POST
  - response: json

## EA ClaimBewijs AI - Veilige claimtekst

- ID: QO98OrvqJhkHEiHP
- Status: inactive
- Nodes: 3
- Node: Webhook (webhook)
  - path: claimbewijs/safe-copy
  - method: POST
- Node: ClaimBewijs API (httpRequest)
  - method: POST
  - url: https://ea-claimbewijs-ai.wiskundehv.chatgpt.site/api/n8n/safe-copy
- Node: Response (respondToWebhook)
  - path: -
  - method: GET/POST
  - response: json

## EA ClaimBewijs AI - Website claimscan

- ID: m2g6i65iHDqdNv7u
- Status: inactive
- Nodes: 3
- Node: Webhook (webhook)
  - path: claimbewijs/website-scan
  - method: POST
- Node: ClaimBewijs API (httpRequest)
  - method: POST
  - url: https://ea-claimbewijs-ai.wiskundehv.chatgpt.site/api/n8n/website-scan
- Node: Response (respondToWebhook)
  - path: -
  - method: GET/POST
  - response: json
