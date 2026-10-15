import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, PhoneOff, Volume2, VolumeX, Phone } from 'lucide-react';
import type { ChatMessage, Settings } from '../types';
import { sendToHelioz } from '../services/aiService';
import { getRecognitionCtor, speak, stopSpeaking, speechSupported, ttsSupported } from '../services/voiceService';
import { uid } from '../services/storage';

type Status = 'idle' | 'listening' | 'thinking' | 'speaking' | 'ended';

export default function VoiceAssistant({
  settings, onProfileChange, context, transcript, onTranscriptChange,
}: {
  settings: Settings;
  onProfileChange: (p: Settings['voiceProfile']) => void;
  context: string;
  transcript: ChatMessage[];
  onTranscriptChange: (m: ChatMessage[]) => void;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [muted, setMuted] = useState(false);
  const [live, setLive] = useState('');
  const [error, setError] = useState('');
  const [lk, setLk] = useState<{ state: 'off' | 'connecting' | 'on' | 'error'; msg?: string }>({ state: 'off' });
  const recRef = useRef<any>(null);
  const roomRef = useRef<any>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef(transcript);
  transcriptRef.current = transcript;

  const gita = settings.voiceProfile === 'gita';
  const lang = settings.language === 'tamil-english' ? 'en-IN' : 'en-US';
  const rate = gita ? 0.85 : 0.95; // slower, calmer pace for Gita sessions

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [transcript, live]);
  useEffect(() => () => { recRef.current?.abort?.(); stopSpeaking(); roomRef.current?.disconnect?.(); }, []);

  const handleUserUtterance = async (text: string) => {
    const next = [...transcriptRef.current, { id: uid(), role: 'user' as const, content: text }];
    onTranscriptChange(next);
    setStatus('thinking');
    try {
      const reply = await sendToHelioz(next, context);
      onTranscriptChange([...next, { id: uid(), role: 'assistant', content: reply }]);
      if (!muted && ttsSupported()) {
        setStatus('speaking');
        speak(reply, { lang, rate });
        const check = setInterval(() => {
          if (!window.speechSynthesis.speaking) { clearInterval(check); setStatus((s) => (s === 'speaking' ? 'idle' : s)); }
        }, 300);
      } else setStatus('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not get a reply.');
      setStatus('idle');
    }
  };

  const startListening = () => {
    setError('');
    stopSpeaking();
    const Ctor = getRecognitionCtor();
    if (!Ctor) return setError('Speech recognition is not supported in this browser. Try Chrome or Edge, or type in Chat.');
    const rec = new Ctor();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e: any) => {
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) final += r[0].transcript; else interim += r[0].transcript;
      }
      setLive(interim || final);
      if (final.trim()) handleUserUtterance(final.trim());
    };
    rec.onerror = (e: any) => {
      setError(e.error === 'not-allowed' ? 'Microphone permission denied.' : `Voice error: ${e.error}`);
      setStatus('idle');
    };
    rec.onend = () => setStatus((s) => (s === 'listening' ? 'idle' : s));
    recRef.current = rec;
    rec.start();
    setStatus('listening');
  };

  const stopListening = () => { recRef.current?.stop(); setStatus('idle'); setLive(''); };

  const endCall = () => {
    recRef.current?.abort?.();
    stopSpeaking();
    roomRef.current?.disconnect?.();
    setLk({ state: 'off' });
    setStatus('ended');
    setLive('');
  };

  const connectLiveKit = async () => {
    setLk({ state: 'connecting' });
    try {
      const res = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: settings.voiceProfile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'LiveKit token request failed');
      const { Room } = await import('livekit-client');
      const room = new Room();
      await room.connect(data.url, data.token);
      await room.localParticipant.setMicrophoneEnabled(true);
      roomRef.current = room;
      setLk({ state: 'on' });
    } catch (err) {
      setLk({ state: 'error', msg: err instanceof Error ? err.message : 'Could not connect' });
    }
  };

  const statusLabel: Record<Status, string> = {
    idle: 'Tap the mic to talk', listening: 'Listening…', thinking: 'Thinking…', speaking: 'Speaking…', ended: 'Call ended',
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5">
      <div className="glass flex items-center justify-between rounded-2xl p-4">
        <div>
          <p className="text-sm text-neutral-400">Voice profile</p>
          <p className="font-medium">{gita ? 'HELIOZ Gita' : 'HELIOZ Normal'}</p>
        </div>
        <div className="flex gap-1 rounded-xl bg-white/5 p-1 text-xs">
          {(['normal', 'gita'] as const).map((p) => (
            <button key={p} onClick={() => onProfileChange(p)} className={`rounded-lg px-3 py-1.5 ${settings.voiceProfile === p ? 'bg-heliox-500 text-black' : 'text-neutral-400'}`}>
              {p === 'normal' ? 'Normal' : 'Gita'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center py-6">
        <p className="mb-1 text-xs uppercase tracking-widest text-neutral-500">
          {status === 'ended' ? 'Call ended' : lk.state === 'on' ? 'Live voice connected' : 'Browser voice'}
        </p>
        <h2 className="text-xl font-semibold">HELIOZ AI</h2>
        <p className="mt-1 text-sm text-heliox-400">{statusLabel[status]}</p>

        <div className="relative mt-8 flex h-44 w-44 items-center justify-center">
          {status === 'listening' && <span className="absolute inset-0 rounded-full border border-heliox-500/50 animate-pulseRing" />}
          {status === 'speaking' && <span className="absolute inset-0 rounded-full border border-heliox-500/40 animate-pulseRing" />}
          <button
            onClick={status === 'listening' ? stopListening : startListening}
            disabled={!speechSupported() || status === 'thinking'}
            aria-label={status === 'listening' ? 'Stop listening' : 'Start listening'}
            className={`relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-black transition glow-orange disabled:opacity-40 ${status === 'listening' ? 'scale-105' : ''}`}
          >
            {status === 'listening' ? <MicOff size={34} /> : <Mic size={34} />}
          </button>
        </div>

        {live && <p className="mt-6 max-w-sm text-center text-sm italic text-neutral-300">“{live}”</p>}
        {error && <p className="mt-4 max-w-sm text-center text-sm text-red-400">{error}</p>}
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={() => { setMuted(!muted); if (!muted) stopSpeaking(); }} aria-label={muted ? 'Unmute' : 'Mute'} className="glass flex items-center gap-2 rounded-full px-5 py-3 text-sm">
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />} {muted ? 'Unmute' : 'Mute'}
        </button>
        <button onClick={endCall} aria-label="End call" className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-medium text-white hover:bg-red-500">
          <PhoneOff size={18} /> End
        </button>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium">Live voice service (LiveKit)</p>
          <span className={`text-xs ${lk.state === 'on' ? 'text-green-400' : lk.state === 'error' ? 'text-red-400' : 'text-neutral-500'}`}>
            {lk.state === 'on' ? 'Connected' : lk.state === 'connecting' ? 'Connecting…' : lk.state === 'error' ? 'Not connected' : 'Off'}
          </span>
        </div>
        {lk.state === 'error' && <p className="mb-2 text-xs text-red-400">{lk.msg}</p>}
        <p className="mb-3 text-xs text-neutral-500">Needs LIVEKIT_* values in the server .env. Browser voice above works without it.</p>
        {lk.state === 'on' ? (
          <button onClick={endCall} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-2 text-sm">Disconnect</button>
        ) : (
          <button onClick={connectLiveKit} disabled={lk.state === 'connecting'} className="flex w-full items-center justify-center gap-2 rounded-xl border border-heliox-500/40 py-2 text-sm text-heliox-400 hover:bg-heliox-500/10 disabled:opacity-50">
            <Phone size={16} /> Connect live voice
          </button>
        )}
      </div>

      <div className="glass max-h-72 space-y-3 overflow-y-auto rounded-2xl p-4 scrollbar-none">
        <p className="text-xs uppercase tracking-widest text-neutral-500">Transcript</p>
        {transcript.length === 0 && <p className="text-sm text-neutral-500">Your conversation will appear here.</p>}
        {transcript.map((m) => (
          <p key={m.id} className={`text-sm ${m.role === 'user' ? 'text-right text-neutral-300' : 'text-heliox-400'}`}>{m.content}</p>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}
