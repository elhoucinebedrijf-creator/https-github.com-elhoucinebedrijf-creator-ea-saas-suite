// Gedeelde BTW/bereken-helpers. Gebruikt door zowel de in-app preview
// (app/(dashboard)/invoices) als het factuur-HTML-template dat naar
// Gotenberg gaat (app/api/internal/invoice-html) — één bron van waarheid
// voor bedragen die op een wettelijk document terechtkomen.

export type BtwRate = 0 | 9 | 21;

export type InvoiceLineInput = {
  description: string;
  quantity: number;
  unitPriceExclBtw: number; // in centen
  btwRate: BtwRate;
};

export type InvoiceLineComputed = InvoiceLineInput & {
  lineTotalExclBtw: number;
  lineBtwAmount: number;
  lineTotalInclBtw: number;
};

export type InvoiceTotals = {
  lines: InvoiceLineComputed[];
  subtotalExclBtw: number;
  btwByRate: Record<BtwRate, number>;
  btwTotal: number;
  totalInclBtw: number;
};

// Alle bedragen in centen om afrondingsfouten met floating point te vermijden.
export function computeInvoiceTotals(lines: InvoiceLineInput[]): InvoiceTotals {
  const computed: InvoiceLineComputed[] = lines.map((line) => {
    const lineTotalExclBtw = Math.round(line.quantity * line.unitPriceExclBtw);
    const lineBtwAmount = Math.round((lineTotalExclBtw * line.btwRate) / 100);
    return {
      ...line,
      lineTotalExclBtw,
      lineBtwAmount,
      lineTotalInclBtw: lineTotalExclBtw + lineBtwAmount,
    };
  });

  const subtotalExclBtw = computed.reduce((sum, l) => sum + l.lineTotalExclBtw, 0);
  const btwByRate: Record<BtwRate, number> = { 0: 0, 9: 0, 21: 0 };
  for (const l of computed) {
    btwByRate[l.btwRate] += l.lineBtwAmount;
  }
  const btwTotal = btwByRate[0] + btwByRate[9] + btwByRate[21];

  return {
    lines: computed,
    subtotalExclBtw,
    btwByRate,
    btwTotal,
    totalInclBtw: subtotalExclBtw + btwTotal,
  };
}

export function formatEuroCents(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

// Standaard BTW-tarief voor personenvervoer (taxi) in Nederland.
export const DEFAULT_PERSONENVERVOER_BTW_RATE: BtwRate = 9;
