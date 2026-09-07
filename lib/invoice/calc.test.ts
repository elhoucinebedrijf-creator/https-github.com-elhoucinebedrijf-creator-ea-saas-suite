import { describe, it, expect } from "vitest";
import { computeInvoiceTotals, formatEuroCents, type InvoiceLineInput } from "./calc";

describe("computeInvoiceTotals", () => {
  it("berekent 9% BTW correct voor een enkele rit", () => {
    const lines: InvoiceLineInput[] = [
      { description: "Rit", quantity: 1, unitPriceExclBtw: 2500, btwRate: 9 },
    ];
    const totals = computeInvoiceTotals(lines);

    expect(totals.subtotalExclBtw).toBe(2500);
    expect(totals.btwTotal).toBe(225); // 9% van 2500
    expect(totals.totalInclBtw).toBe(2725);
  });

  it("telt meerdere regels met verschillende BTW-tarieven correct op", () => {
    const lines: InvoiceLineInput[] = [
      { description: "Rit 1", quantity: 1, unitPriceExclBtw: 1000, btwRate: 9 },
      { description: "Rit 2", quantity: 1, unitPriceExclBtw: 2000, btwRate: 21 },
      { description: "Vrijgesteld", quantity: 1, unitPriceExclBtw: 500, btwRate: 0 },
    ];
    const totals = computeInvoiceTotals(lines);

    expect(totals.subtotalExclBtw).toBe(3500);
    expect(totals.btwByRate[9]).toBe(90);
    expect(totals.btwByRate[21]).toBe(420);
    expect(totals.btwByRate[0]).toBe(0);
    expect(totals.btwTotal).toBe(510);
    expect(totals.totalInclBtw).toBe(4010);
  });

  it("houdt rekening met aantal (quantity) per regel", () => {
    const lines: InvoiceLineInput[] = [
      { description: "Rit", quantity: 3, unitPriceExclBtw: 1000, btwRate: 9 },
    ];
    const totals = computeInvoiceTotals(lines);

    expect(totals.subtotalExclBtw).toBe(3000);
    expect(totals.lines[0].lineTotalExclBtw).toBe(3000);
  });

  it("rondt BTW-bedragen af naar hele centen", () => {
    // 33 cent * 9% = 2.97 cent -> moet afronden naar 3 cent, geen float-drift
    const lines: InvoiceLineInput[] = [
      { description: "Rit", quantity: 1, unitPriceExclBtw: 33, btwRate: 9 },
    ];
    const totals = computeInvoiceTotals(lines);

    expect(Number.isInteger(totals.btwTotal)).toBe(true);
    expect(totals.btwTotal).toBe(3);
  });

  it("geeft nul totalen voor een lege regelset", () => {
    const totals = computeInvoiceTotals([]);
    expect(totals.subtotalExclBtw).toBe(0);
    expect(totals.btwTotal).toBe(0);
    expect(totals.totalInclBtw).toBe(0);
  });
});

describe("formatEuroCents", () => {
  // Intl.NumberFormat plaatst een non-breaking space ( ) tussen
  // symbool en bedrag; normaliseren naar een gewone spatie voorkomt dat de
  // test afhangt van een onzichtbaar teken in de broncode.
  const normalize = (s: string) => s.replace(/ /g, " ");

  it("formatteert centen als Nederlandse euro-notatie", () => {
    expect(normalize(formatEuroCents(272500))).toBe("€ 2.725,00");
    expect(normalize(formatEuroCents(0))).toBe("€ 0,00");
  });
});
