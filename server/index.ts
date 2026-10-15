import 'dotenv/config';
import express from 'express';
import { AccessToken } from 'livekit-server-sdk';

const app = express();
app.use(express.json({ limit: '200kb' }));

const PORT = Number(process.env.PORT) || 8787;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

const SYSTEM_PROMPT = `You are HELIOZ, a friendly, calm, practical personal development partner for Santhosh.
- Reply in natural Tanglish (Tamil + English mix) unless the user writes fully in English, then reply in English.
- Help with: college studies and exams, a custom T-shirt printing business, gym consistency, meditation, daily discipline, sleep and wake-up tracking, screen-time awareness, and personal goals.
- Ask ONE question at a time. Keep replies short and conversational. Do not sound like a rigid chatbot.
- Use the user's saved tasks, habits and preferences (provided as context) when relevant.
- Never claim to have made calls, sent reminders, or cloned voices.`;

type ChatMsg = { role: 'user' | 'assistant'; content: string };

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    aiConfigured: Boolean(GEMINI_KEY),
    voiceConfigured: Boolean(process.env.LIVEKIT_URL && process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET),
  });
});

app.post('/api/chat', async (req, res) => {
  if (!GEMINI_KEY) {
    return res.status(503).json({
      error: 'AI is not configured. Add GEMINI_API_KEY to your server .env file and restart `npm run dev`.',
    });
  }
  const { messages, context } = (req.body ?? {}) as { messages?: ChatMsg[]; context?: string };
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 60) {
    return res.status(400).json({ error: 'Invalid messages payload.' });
  }
  const contents = messages
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-30)
    .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content.slice(0, 4000) }] }));

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KEY },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: `${SYSTEM_PROMPT}\n\nUser context:\n${(context ?? '').slice(0, 3000)}` }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
        }),
      },
    );
    if (!r.ok) {
      console.error('Gemini error', r.status, await r.text());
      return res.status(502).json({ error: 'The AI service returned an error. Please try again.' });
    }
    const data: any = await r.json();
    const reply = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text ?? '').join('').trim();
    if (!reply) return res.status(502).json({ error: 'Empty response from AI. Try rephrasing.' });
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not reach the AI service.' });
  }
});

// Short-lived LiveKit token. The browser never sees the API secret.
app.post('/api/livekit/token', async (req, res) => {
  const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    return res.status(503).json({ error: 'LiveKit is not configured. Add LIVEKIT_* values to server .env.' });
  }
  const profile = req.body?.profile === 'gita' ? 'gita' : 'normal';
  const identity = `santhosh-${Date.now()}`;
  const room = `heliox-${profile}-${identity}`;
  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, { identity, ttl: '15m' });
  at.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true });
  res.json({ url: LIVEKIT_URL, token: await at.toJwt(), room });
});

app.listen(PORT, () => console.log(`HELIOZ API running on http://localhost:${PORT}`));
