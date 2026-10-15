import { useEffect, useRef, useState } from 'react';
import { Send, Loader2, AlertTriangle, RotateCcw, Mic } from 'lucide-react';
import type { ChatMessage } from '../types';
import { sendToHelioz } from '../services/aiService';
import { uid } from '../services/storage';

interface Props {
  messages: ChatMessage[];
  onChange: (m: ChatMessage[]) => void;
  context: string;
  onSpeak?: (text: string) => void;
  onOpenVoice?: () => void;
}

export default function ChatInterface({ messages, onChange, context, onSpeak, onOpenVoice }: Props) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const run = async (history: ChatMessage[]) => {
    setLoading(true);
    try {
      const reply = await sendToHelioz(history, context);
      const botMsg: ChatMessage = { id: uid(), role: 'assistant', content: reply };
      onChange([...history, botMsg]);
      onSpeak?.(reply);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      onChange([...history, { id: uid(), role: 'assistant', content: msg, error: true }]);
    } finally {
      setLoading(false);
    }
  };

  const send = () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { id: uid(), role: 'user' as const, content: text }];
    setInput('');
    onChange(next);
    run(next);
  };

  const retry = () => {
    const lastUser = [...messages].reverse().findIndex((m) => m.role === 'user');
    if (lastUser === -1) return;
    const cut = messages.slice(0, messages.length - lastUser);
    onChange(cut);
    run(cut);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto pb-4 scrollbar-none">
        {messages.length === 0 && (
          <div className="glass rounded-2xl p-6 text-center animate-fadeUp">
            <p className="text-lg font-medium">Vanakkam Santhosh 👋</p>
            <p className="mt-1 text-sm text-neutral-400">Innaiku enna plan? Studies, business, gym — enna pannalam?</p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex animate-fadeUp ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === 'user' ? 'bg-heliox-500 text-black rounded-br-sm'
              : m.error ? 'border border-red-500/30 bg-red-500/10 text-red-200 rounded-bl-sm'
              : 'glass rounded-bl-sm'}`}>
              {m.error && <AlertTriangle size={14} className="mb-1 inline mr-1" />}
              {m.content}
              {m.error && (
                <button onClick={retry} className="mt-2 flex items-center gap-1 text-xs underline"><RotateCcw size={12} /> Retry</button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="glass flex items-center gap-2 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-neutral-400">
              <Loader2 size={15} className="animate-spin text-heliox-400" /> HELIOZ is thinking…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="glass sticky bottom-0 flex items-center gap-2 rounded-2xl p-2">
        {onOpenVoice && (
          <button onClick={onOpenVoice} aria-label="Open voice" className="rounded-xl p-2.5 text-neutral-400 hover:bg-white/5 hover:text-heliox-400"><Mic size={18} /></button>
        )}
        <input
          className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-neutral-500"
          placeholder="Type a message… (Tamil or English)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          disabled={loading}
        />
        <button onClick={send} disabled={!input.trim() || loading} aria-label="Send" className="rounded-xl bg-heliox-500 p-2.5 text-black transition disabled:opacity-40 hover:bg-heliox-400">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
