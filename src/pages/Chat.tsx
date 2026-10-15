import { Trash2 } from 'lucide-react';
import type { ChatMessage, Settings, Page } from '../types';
import ChatInterface from '../components/ChatInterface';
import { speak, stopSpeaking, ttsSupported } from '../services/voiceService';

export default function Chat({
  messages, onChange, context, settings, onNavigate,
}: { messages: ChatMessage[]; onChange: (m: ChatMessage[]) => void; context: string; settings: Settings; onNavigate: (p: Page) => void }) {
  return (
    <div className="flex h-[calc(100dvh-7rem)] flex-col md:h-[calc(100dvh-4rem)]">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">HELIOZ Chat</h1>
          <p className="text-xs text-neutral-500">Tamil + English · remembers this device’s chat</p>
        </div>
        <div className="flex gap-2">
          {ttsSupported() && settings.speakReplies && (
            <button onClick={() => stopSpeaking()} className="glass rounded-xl px-3 py-2 text-xs text-neutral-400">Stop audio</button>
          )}
          {messages.length > 0 && (
            <button onClick={() => { stopSpeaking(); onChange([]); }} aria-label="Clear chat" className="glass rounded-xl p-2 text-neutral-400 hover:text-red-400"><Trash2 size={16} /></button>
          )}
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <ChatInterface
          messages={messages}
          onChange={onChange}
          context={context}
          onSpeak={settings.speakReplies ? (t) => speak(t, { lang: settings.language === 'tamil-english' ? 'en-IN' : 'en-US' }) : undefined}
          onOpenVoice={() => onNavigate('voice')}
        />
      </div>
    </div>
  );
}
