// Herkent de platformeigenaar (jij) los van reguliere tenant-gebruikers, zodat
// het platform-overzicht (alle tenants + abonnementen) alleen voor jou
// zichtbaar is en niet per ongeluk voor een klant.
export function isPlatformOwner(email: string | null | undefined): boolean {
  const ownerEmail = process.env.PLATFORM_OWNER_EMAIL;
  if (!ownerEmail || !email) return false;
  return email.toLowerCase() === ownerEmail.toLowerCase();
}
