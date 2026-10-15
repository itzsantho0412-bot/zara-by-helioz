import { useState } from 'react';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { GITA_VERSES, dailyVerse } from '../services/gitaService';
import { speak, ttsSupported } from '../services/voiceService';

export default function BhagavadGita({ onSpeak }: { onSpeak?: () => void }) {
  const today = dailyVerse();
  const [idx, setIdx] = useState(GITA_VERSES.indexOf(today));
  const v = GITA_VERSES[idx];
  const canSpeak = ttsSupported();

  const listen = () => speak(`${v.englishMeaning}. ${v.practical}`, { lang: 'en-IN', rate: 0.85 });

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Bhagavad Gita</h1>
        <p className="text-sm text-neutral-500">Daily shloka · Gita mode</p>
      </header>

      <article className="glass space-y-5 rounded-2xl p-6 animate-fadeUp" key={v.ref}>
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-heliox-400">{v.ref}</p>
          {idx === GITA_VERSES.indexOf(today) && <span className="rounded-full bg-heliox-500/15 px-2 py-0.5 text-[10px] text-heliox-400">Today</span>}
        </div>

        <section>
          <p className="text-lg leading-loose text-amber-100">{v.sanskrit}</p>
          <p className="mt-2 text-xs italic text-neutral-500">{v.transliteration}</p>
          <p className="mt-1 text-[11px] text-neutral-600">{v.sourceNote}</p>
        </section>

        <section>
          <h3 className="text-xs uppercase tracking-widest text-neutral-500">Tamil meaning</h3>
          <p className="mt-1 leading-relaxed">{v.tamilMeaning}</p>
        </section>

        <section>
          <h3 className="text-xs uppercase tracking-widest text-neutral-500">English meaning</h3>
          <p className="mt-1 leading-relaxed">{v.englishMeaning}</p>
        </section>

        <section className="rounded-xl bg-heliox-500/10 p-4">
          <h3 className="text-xs uppercase tracking-widest text-heliox-400">Practical explanation (HELIOZ commentary)</h3>
          <p className="mt-1 text-sm leading-relaxed">{v.practical}</p>
          <p className="mt-3 text-xs uppercase tracking-widest text-heliox-400">Real-life example</p>
          <p className="mt-1 text-sm leading-relaxed">{v.example}</p>
        </section>

        {canSpeak && (
          <button onClick={() => { listen(); onSpeak?.(); }} className="flex w-full items-center justify-center gap-2 rounded-xl border border-heliox-500/40 py-2.5 text-sm text-heliox-400 hover:bg-heliox-500/10">
            <Volume2 size={16} /> Listen (browser voice)
          </button>
        )}
      </article>

      <div className="flex items-center justify-between">
        <button disabled={idx === 0} onClick={() => setIdx(idx - 1)} className="glass flex items-center gap-1 rounded-xl px-4 py-2 text-sm disabled:opacity-30"><ChevronLeft size={16} /> Previous</button>
        <span className="text-xs text-neutral-500">{idx + 1} / {GITA_VERSES.length}</span>
        <button disabled={idx === GITA_VERSES.length - 1} onClick={() => setIdx(idx + 1)} className="glass flex items-center gap-1 rounded-xl px-4 py-2 text-sm disabled:opacity-30">Next <ChevronRight size={16} /></button>
      </div>
      <p className="text-center text-xs text-neutral-600">Shloka text is from the Gita; Tamil meanings and commentary are generated and should be checked against a trusted translation.</p>
    </div>
  );
}
