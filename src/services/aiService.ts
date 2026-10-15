import type { ChatMessage } from '../types';

export async function sendToHelioz(messages: ChatMessage[], context: string): Promise<string> {
  const payload = {
    messages: messages.filter((m) => !m.error).map(({ role, content }) => ({ role, content })),
    context,
  };
  let res: Response;
  try {
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('Cannot reach the HELIOZ server. Is `npm run dev` running?');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data.reply as string;
}

export async function getServiceHealth(): Promise<{ aiConfigured: boolean; voiceConfigured: boolean } | null> {
  try {
    const res = await fetch('/api/health');
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}
