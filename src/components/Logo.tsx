export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const text = size === 'lg' ? 'text-4xl tracking-[0.3em]' : size === 'md' ? 'text-lg tracking-[0.25em]' : 'text-sm tracking-[0.2em]';
  return (
    <div className="flex flex-col items-center leading-none select-none">
      <svg width={size === 'lg' ? 56 : 28} height={size === 'lg' ? 28 : 14} viewBox="0 0 60 30" className="mb-2">
        <path d="M5 30 A25 25 0 0 1 55 30" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className={`font-light ${text}`}>
        HELIOZ <span className="font-semibold text-heliox-500">AI</span>
      </span>
    </div>
  );
}
