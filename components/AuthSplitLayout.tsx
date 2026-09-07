const HIGHLIGHTS = [
  "BTW-conforme facturen in één klik",
  "Verzending via e-mail én WhatsApp",
  "Automatische betaalherinneringen",
];

export default function AuthSplitLayout({
  children,
  eyebrow,
  heading,
  lede,
}: {
  children: React.ReactNode;
  eyebrow: string;
  heading: React.ReactNode;
  lede: string;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-900 via-brand-600 to-brand-500 px-12 py-14 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cpath d='M0 70h140M70 0v140' stroke='%23ffffff' stroke-width='1'/%3E%3Ccircle cx='70' cy='70' r='2.5' fill='%23ffffff'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
            <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
              <path d="M20 44V20a3 3 0 0 1 3-3h12.5L46 27.5V44a3 3 0 0 1-3 3H23a3 3 0 0 1-3-3Z" fill="#2f7d63" />
              <path d="M35.5 17v8.5a2 2 0 0 0 2 2H46" stroke="#2f7d63" strokeWidth="2" />
              <path d="M25 30h13M25 35h13M25 40h8" stroke="#2f7d63" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white">RitFactuur</span>
        </div>
        <div className="relative">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-100">{eyebrow}</span>
          <h1 className="mt-3 max-w-sm text-3xl font-bold leading-tight text-balance text-white">{heading}</h1>
          <p className="mt-4 max-w-sm text-sm text-brand-50">{lede}</p>
          <ul className="mt-8 space-y-2.5 text-sm text-brand-50">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                {h}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-brand-100">Gebouwd voor Nederlandse taxi-ondernemers.</p>
      </div>
      <div className="flex w-full flex-col overflow-y-auto lg:w-1/2">{children}</div>
    </div>
  );
}
