# HELIOZ AI

Personal development assistant (React + Vite + TypeScript + Tailwind) with a small Express backend.

## Setup

```bash
npm install
cp .env.example .env     # then fill in the values
npm run dev              # starts API on :8787 and web on :5173
```

Open http://localhost:5173

## Environment (server only)

| Variable | Needed for |
|---|---|
| `GEMINI_API_KEY` | AI chat (`/api/chat`). Without it, chat shows a configuration message. |
| `GEMINI_MODEL` | Optional, default `gemini-2.0-flash` |
| `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` | Live voice sessions (`/api/livekit/token`). |

Keys are read only in `server/index.ts`. Never add them with a `VITE_` prefix.

## What works without any keys

Dashboard, tasks, habits, reminders, settings, and the Gita page all persist in localStorage. Browser speech recognition and speech synthesis work in Chrome and Edge.

## What needs external services

- **AI chat**: Gemini key.
- **Live voice calls**: LiveKit project. Browser voice works without it.
- **Scheduled morning/evening calls and reminders when the browser is closed**: not implemented. These need a backend scheduler plus a push service. The settings save the times only.
- **Voice cloning**: not implemented. Use only voices you have consent to use, through a backend integration.

## Structure

- `server/index.ts`: API (chat, LiveKit token, health)
- `src/services/`: frontend service layer (AI, storage, tasks, voice, reminders, Gita data)
- `src/components/`, `src/pages/`: UI
