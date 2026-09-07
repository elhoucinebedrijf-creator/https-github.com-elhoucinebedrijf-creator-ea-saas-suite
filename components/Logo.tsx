export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="22" height="22" viewBox="0 0 64 64" fill="none" className="shrink-0">
        <rect width="64" height="64" rx="14" fill="#2f7d63" />
        <path
          d="M20 44V20a3 3 0 0 1 3-3h12.5L46 27.5V44a3 3 0 0 1-3 3H23a3 3 0 0 1-3-3Z"
          fill="white"
        />
        <path d="M35.5 17v8.5a2 2 0 0 0 2 2H46" stroke="#2f7d63" strokeWidth="2" />
        <path d="M25 30h13M25 35h13M25 40h8" stroke="#2f7d63" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="text-lg font-bold text-brand-600">RitFactuur</span>
    </span>
  );
}
