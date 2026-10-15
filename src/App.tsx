import { useEffect, useMemo, useState } from 'react';
import type { Page, Settings, Task, Habit, Reminder, ChatMessage } from './types';
import { usePersistentState } from './hooks/usePersistentState';
import { contextSummary } from './services/taskService';
import { getServiceHealth } from './services/aiService';
import { DesktopSidebar, MobileNav } from './components/Sidebar';
import Logo from './components/Logo';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Tasks from './pages/Tasks';
import Habits, { defaultHabits } from './pages/Habits';
import Reminders from './pages/Reminders';
import BhagavadGita from './pages/BhagavadGita';
import Settings_ from './pages/Settings';
import VoiceAssistant from './components/VoiceAssistant';

const DEFAULT_SETTINGS: Settings = {
  name: 'Santhosh',
  greeting: 'Good evening,',
  language: 'tamil-english',
  morningTime: '07:30',
  eveningTime: '20:00',
  voiceProfile: 'normal',
  speakReplies: false,
  notifications: false,
  collegeDays: [1, 2, 3, 4, 5],
  goals: ['Finish college assignments on time', 'Grow T-shirt printing business', 'Gym 5 days a week', 'Meditate daily'],
};

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [splash, setSplash] = useState(true);
  const [settings, setSettings] = usePersistentState<Settings>('settings', DEFAULT_SETTINGS);
  const [tasks, setTasks] = usePersistentState<Task[]>('tasks', []);
  const [habits, setHabits] = usePersistentState<Habit[]>('habits', defaultHabits());
  const [reminders, setReminders] = usePersistentState<Reminder[]>('reminders', []);
  const [chat, setChat] = usePersistentState<ChatMessage[]>('chat', []);
  const [voiceTranscript, setVoiceTranscript] = usePersistentState<ChatMessage[]>('voiceTranscript', []);
  const [health, setHealth] = useState<{ aiConfigured: boolean; voiceConfigured: boolean } | null>(null);

  useEffect(() => { const t = setTimeout(() => setSplash(false), 1400); return () => clearTimeout(t); }, []);
  useEffect(() => { getServiceHealth().then(setHealth); }, []);

  const context = useMemo(() => contextSummary(tasks, habits, settings.goals), [tasks, habits, settings.goals]);

  if (splash) {
    return (
      <div className="flex h-full flex-col items-center justify-between bg-gradient-to-b from-black via-neutral-950 to-black px-6 py-16">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-orange-900/40 to-transparent" />
        <div className="absolute left-1/2 top-[30%] h-40 w-40 -translate-x-1/2 rounded-full bg-orange-500/30 blur-3xl" />
        <div className="relative mt-24 animate-fadeUp"><Logo size="lg" /></div>
        <div className="relative text-center">
          <p className="text-xs tracking-[0.3em] text-neutral-400">YOUR PERSONAL GROWTH PARTNER</p>
          <div className="mx-auto mt-6 h-0.5 w-40 overflow-hidden rounded bg-white/10"><div className="h-full w-full origin-left animate-[fadeUp_1.4s_ease-out] bg-heliox-500" /></div>
          <p className="mt-6 text-xs tracking-widest text-neutral-500">Better Mind · Bigger Goals · Greater You</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-black text-white">
      <DesktopSidebar page={page} onNavigate={setPage} />
      <main className="relative flex-1 overflow-y-auto pb-24 md:pb-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-5xl p-5 md:p-8">
          {health && !health.aiConfigured && page !== 'settings' && (
            <div className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
              AI chat is not configured yet. Add <code>GEMINI_API_KEY</code> to the server <code>.env</code> file and restart. Other features still work.
            </div>
          )}
          {page === 'dashboard' && <Dashboard settings={settings} tasks={tasks} habits={habits} reminders={reminders} onTasks={setTasks} onNavigate={setPage} />}
          {page === 'chat' && <Chat messages={chat} onChange={setChat} context={context} settings={settings} onNavigate={setPage} />}
          {page === 'voice' && (
            <VoiceAssistant
              settings={settings}
              onProfileChange={(p) => setSettings({ ...settings, voiceProfile: p })}
              context={context}
              transcript={voiceTranscript}
              onTranscriptChange={setVoiceTranscript}
            />
          )}
          {page === 'tasks' && <Tasks tasks={tasks} onChange={setTasks} />}
          {page === 'habits' && <Habits habits={habits} onChange={setHabits} />}
          {page === 'reminders' && <Reminders reminders={reminders} onChange={setReminders} />}
          {page === 'gita' && <BhagavadGita />}
          {page === 'settings' && <Settings_ settings={settings} onChange={setSettings} />}
        </div>
      </main>
      <MobileNav page={page} onNavigate={setPage} />
    </div>
  );
}
