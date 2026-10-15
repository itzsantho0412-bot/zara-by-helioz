import { LayoutDashboard, MessageSquare, Mic, CheckSquare, Flame, Bell, BookOpen, Settings as SettingsIcon } from 'lucide-react';
import type { Page } from '../types';
import Logo from './Logo';

export const NAV: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'voice', label: 'Voice', icon: Mic },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'habits', label: 'Habits', icon: Flame },
  { id: 'reminders', label: 'Reminders', icon: Bell },
  { id: 'gita', label: 'Gita', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export function DesktopSidebar({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-white/5 bg-neutral-950/60 p-5">
      <div className="mb-8"><Logo size="sm" /></div>
      <nav className="flex flex-col gap-1">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
              page === id ? 'bg-heliox-500/15 text-heliox-400' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon size={18} /> {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export function MobileNav({ page, onNavigate }: { page: Page; onNavigate: (p: Page) => void }) {
  const primary: Page[] = ['dashboard', 'tasks', 'gita', 'settings'];
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/5 bg-black/90 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around py-2">
        {NAV.filter((n) => primary.includes(n.id)).map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => onNavigate(id)} className={`flex flex-col items-center gap-1 px-3 py-1 text-[11px] ${page === id ? 'text-heliox-400' : 'text-neutral-500'}`}>
            <Icon size={20} /> {label}
          </button>
        ))}
        <button onClick={() => onNavigate('chat')} className={`flex flex-col items-center gap-1 px-3 py-1 text-[11px] ${page === 'chat' || page === 'voice' ? 'text-heliox-400' : 'text-neutral-500'}`}>
          <MessageSquare size={20} /> Talk
        </button>
      </div>
    </nav>
  );
}
