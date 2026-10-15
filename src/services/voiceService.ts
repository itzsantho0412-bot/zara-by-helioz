// Browser speech recognition + synthesis. Kept separate from LiveKit calls.
export const getRecognitionCtor = (): (new () => any) | null =>
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;

export const speechSupported = () => Boolean(getRecognitionCtor());
export const ttsSupported = () => 'speechSynthesis' in window;

export function speak(text: string, opts: { lang?: string; rate?: number } = {}) {
  if (!ttsSupported()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = opts.lang ?? 'en-IN';
  u.rate = opts.rate ?? 0.95;
  window.speechSynthesis.speak(u);
}

export const stopSpeaking = () => ttsSupported() && window.speechSynthesis.cancel();
