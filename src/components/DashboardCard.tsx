import type { ReactNode } from 'react';

export default function DashboardCard({
  title, subtitle, icon, children, accent = false, onClick,
}: { title: string; subtitle?: string; icon?: ReactNode; children?: ReactNode; accent?: boolean; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`glass rounded-2xl p-4 animate-fadeUp ${onClick ? 'cursor-pointer hover:border-heliox-500/40 transition' : ''} ${accent ? 'ring-1 ring-heliox-500/30' : ''}`}
    >
      <div className="flex items-center gap-3">
        {icon && <div className="h-10 w-10 rounded-xl bg-heliox-500/15 text-heliox-400 flex items-center justify-center">{icon}</div>}
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{title}</p>
          {subtitle && <p className="text-xs text-neutral-400 truncate">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
