import { useState } from 'react';
import type { Settings as S } from '../types';
import Toggle from '../components/Toggle';
import { requestNotificationPermission } from '../services/reminderService';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Settings({ settings, onChange }: { settings: S; onChange: (s: S) => void }) {
  const [goalsText, setGoalsText] = useState(settings.goals.join(', '));
  const [saved, setSaved] = useState(false);
  const set = <K extends keyof S>(k: K, v: S[K]) => { onChange({ ...settings, [k]: v }); setSaved(true); setTimeout(() => setSaved(false), 1200); };

  const toggleDay = (d: number) =>
    set('collegeDays', settings.collegeDays.includes(d) ? settings.collegeDays.filter((x) => x !== d) : [...settings.collegeDays, d].sort());

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-neutral-500">Make it yours.</p>
        </div>
        {saved && <span className="text-xs text-green-400">Saved</span>}
      </header>

      <Section title="Profile">
        <Field label="Name"><input className="input" value={settings.name} onChange={(e) => set('name', e.target.value)} /></Field>
        <Field label="Greeting"><input className="input" value={settings.greeting} onChange={(e) => set('greeting', e.target.value)} /></Field>
        <Field label="Language">
          <select className="input" value={settings.language} onChange={(e) => set('language', e.target.value as S['language'])}>
            <option value="tamil-english">Tamil + English (Tanglish)</option>
            <option value="english">English</option>
          </select>
        </Field>
        <Field label="Personal development goals (comma separated)">
          <textarea className="input" rows={2} value={goalsText} onBlur={() => set('goals', goalsText.split(',').map((g) => g.trim()).filter(Boolean))} onChange={(e) => setGoalsText(e.target.value)} />
        </Field>
      </Section>

      <Section title="Daily calls">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Morning routine"><input type="time" className="input" value={settings.morningTime} onChange={(e) => set('morningTime', e.target.value)} /></Field>
          <Field label="Evening routine"><input type="time" className="input" value={settings.eveningTime} onChange={(e) => set('eveningTime', e.target.value)} /></Field>
        </div>
        <p className="text-xs text-neutral-500">Times are saved. Automatic calls are not active until a backend scheduler is configured.</p>
        <Field label="College days">
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d, i) => (
              <button key={d} onClick={() => toggleDay(i)} className={`rounded-xl px-3 py-1.5 text-xs ${settings.collegeDays.includes(i) ? 'bg-heliox-500 text-black' : 'bg-white/5 text-neutral-400'}`}>{d}</button>
            ))}
          </div>
        </Field>
      </Section>

      <Section title="Voice">
        <Field label="Voice profile">
          <select className="input" value={settings.voiceProfile} onChange={(e) => set('voiceProfile', e.target.value as S['voiceProfile'])}>
            <option value="normal">HELIOZ Normal — planning, studies, business</option>
            <option value="gita">HELIOZ Gita — Bhagavad Gita sessions</option>
          </select>
        </Field>
        <Row label="Speak AI replies aloud" checked={settings.speakReplies} onChange={(v) => set('speakReplies', v)} />
      </Section>

      <Section title="Notifications">
        <Row label="Browser reminder alerts" checked={settings.notifications} onChange={async (v) => {
          if (v) await requestNotificationPermission();
          set('notifications', v);
        }} />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass space-y-4 rounded-2xl p-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-heliox-400">{title}</h2>
      {children}
    </section>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1.5"><span className="text-xs text-neutral-400">{label}</span>{children}</label>;
}
function Row({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  );
}
