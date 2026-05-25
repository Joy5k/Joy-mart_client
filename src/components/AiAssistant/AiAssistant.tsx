'use client';

import { useEffect, useRef, useState } from 'react';
import { FaRobot, FaPaperPlane, FaMicrophone, FaPhoneSlash, FaTimes, FaComments } from 'react-icons/fa';

type ChatMessage = { role: 'user' | 'assistant'; text: string };
type Tab = 'chat' | 'voice';
type CallState = 'idle' | 'connecting' | 'live' | 'ending';
type TurnRole = 'user' | 'agent';

// AudioWorklet: resample mic float32 → 16kHz, pack as Int16 little-endian PCM,
// emit fixed 20ms frames (320 samples / 640 bytes).
const downsamplerWorklet = `
class PcmDownsampler extends AudioWorkletProcessor {
  constructor(opts) {
    super();
    const o = (opts && opts.processorOptions) || {};
    this.targetRate = o.targetRate || 16000;
    this.frameSamples = o.frameSamples || 320;
    this.ratio = sampleRate / this.targetRate;
    this._tail = new Float32Array(0);
    this._pos = 0;
    this._chunk = new Int16Array(this.frameSamples);
    this._chunkPos = 0;
  }
  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;
    const ch = input[0];
    const buf = new Float32Array(this._tail.length + ch.length);
    buf.set(this._tail, 0);
    buf.set(ch, this._tail.length);

    while (this._pos + 1 < buf.length) {
      const i = Math.floor(this._pos);
      const frac = this._pos - i;
      const s = buf[i] * (1 - frac) + buf[i + 1] * frac;
      const c = s < -1 ? -1 : s > 1 ? 1 : s;
      this._chunk[this._chunkPos++] = c < 0 ? c * 0x8000 : c * 0x7fff;
      this._pos += this.ratio;
      if (this._chunkPos >= this.frameSamples) {
        this.port.postMessage(this._chunk.buffer.slice(0));
        this._chunkPos = 0;
      }
    }
    const consumed = Math.floor(this._pos);
    this._tail = buf.slice(consumed);
    this._pos -= consumed;
    return true;
  }
}
registerProcessor('pcm-downsampler', PcmDownsampler);
`;

function int16ToBase64(int16: Int16Array): string {
  const bytes = new Uint8Array(int16.buffer, int16.byteOffset, int16.byteLength);
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + CHUNK)));
  }
  return btoa(bin);
}

function base64ToInt16(b64: string): Int16Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Int16Array(bytes.buffer, 0, bytes.length >> 1);
}

function parseChatChunk(data: string): { text: string; session?: string } {
  try {
    const obj = JSON.parse(data);
    if (typeof obj === 'string') return { text: obj };
    if (obj && typeof obj === 'object') {
      const o = obj as Record<string, unknown>;
      const session =
        (typeof o.session_id === 'string' && o.session_id) ||
        (typeof o.sessionId === 'string' && (o.sessionId as string)) ||
        undefined;
      let text = '';
      if (typeof o.text === 'string') text = o.text;
      else if (typeof o.delta === 'string') text = o.delta;
      else if (typeof o.content === 'string') text = o.content;
      else if (typeof o.token === 'string') text = o.token;
      else if (Array.isArray(o.choices)) {
        const c0 = o.choices[0] as Record<string, unknown> | undefined;
        const delta = c0?.delta as Record<string, unknown> | undefined;
        if (delta && typeof delta.content === 'string') text = delta.content;
      }
      return { text, session };
    }
  } catch {
    return { text: data };
  }
  return { text: '' };
}

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('chat');

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Hi! Ask me anything about Joy Mart, or switch to voice to talk live.' },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [callState, setCallState] = useState<CallState>('idle');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<Array<{ role: TurnRole; text: string }>>([]);
  const [livePartial, setLivePartial] = useState<{ user?: string; agent?: string }>({});
  const [bytesSent, setBytesSent] = useState(0);
  const [bytesRecv, setBytesRecv] = useState(0);
  const [agentSpeaking, setAgentSpeaking] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const callSessionIdRef = useRef<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playbackCtxRef = useRef<AudioContext | null>(null);
  const playbackTimeRef = useRef<number>(0);
  const micStreamRef = useRef<MediaStream | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const workletUrlRef = useRef<string | null>(null);
  const sentRef = useRef(0);
  const recvRef = useRef(0);
  const sentTickRef = useRef<number | null>(null);
  const callStateRef = useRef<CallState>('idle');
  const agentSpeakTimerRef = useRef<number | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, livePartial]);

  useEffect(() => {
    return () => {
      void teardownVoice();
      if (workletUrlRef.current) URL.revokeObjectURL(workletUrlRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- Chat ----------------
  async function sendMessage() {
    const text = input.trim();
    if (!text || sending) return;

    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setSending(true);
    setChatError(null);

    let assistantStarted = false;
    let accumulated = '';

    const appendAssistant = (next: string) => {
      accumulated = next;
      if (!assistantStarted) {
        assistantStarted = true;
        setMessages((m) => [...m, { role: 'assistant', text: accumulated }]);
      } else {
        setMessages((m) => {
          if (!m.length) return m;
          const last = m[m.length - 1];
          if (last.role !== 'assistant') return m;
          return [...m.slice(0, -1), { ...last, text: accumulated }];
        });
      }
    };

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({
          message: text,
          sessionId: sessionIdRef.current ?? undefined,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.message || `Chat failed (${res.status})`);
      }
      if (!res.body) throw new Error('Server did not return a stream.');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const handleData = (data: string) => {
        if (!data || data === '[DONE]') return;
        const { text: tok, session } = parseChatChunk(data);
        if (session && !sessionIdRef.current) sessionIdRef.current = session;
        if (tok) appendAssistant(accumulated + tok);
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, idx).trim();
          buffer = buffer.slice(idx + 1);
          if (line.startsWith('data:')) handleData(line.slice(5).trim());
        }
      }
      if (buffer.startsWith('data:')) handleData(buffer.slice(5).trim());

      if (!accumulated.trim()) appendAssistant('(no response)');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setChatError(msg);
      if (assistantStarted && !accumulated.trim()) {
        setMessages((m) => (m.length && m[m.length - 1].role === 'assistant' ? m.slice(0, -1) : m));
      }
    } finally {
      setSending(false);
    }
  }

  // ---------------- Voice ----------------
  async function startCall() {
    if (callState !== 'idle') return;
    setVoiceError(null);
    setTranscript([]);
    setLivePartial({});
    setBytesSent(0);
    setBytesRecv(0);
    sentRef.current = 0;
    recvRef.current = 0;
    setCallState('connecting');

    try {
      const res = await fetch('/api/ai/voice/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initial_variables: {} }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || `Could not start call (${res.status})`);

      const payload = json?.data ?? json;
      const wsUrl: string | undefined = payload?.websocket_url_absolute;
      const sessionId: string | undefined = payload?.session_id;
      if (!wsUrl) throw new Error('Server did not return a websocket URL.');
      callSessionIdRef.current = sessionId ?? null;

      await connectAndAwaitReady(wsUrl);
      await startMic();
      setCallState('live');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not start the call.';
      setVoiceError(msg);
      await teardownVoice();
      setCallState('idle');
    }
  }

  function connectAndAwaitReady(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('[voice] connecting', url);
      const ws = new WebSocket(url);
      wsRef.current = ws;
      let ready = false;

      ws.addEventListener('open', () => console.log('[voice] ws open'));

      ws.addEventListener('error', (e) => {
        console.error('[voice] ws error', e);
        if (!ready) reject(new Error('WebSocket connection failed.'));
      });

      ws.addEventListener('close', (evt) => {
        console.log('[voice] ws close', evt.code, evt.reason);
        if (!ready) {
          reject(new Error(`WebSocket closed (${evt.code}) ${evt.reason || ''}`.trim()));
          return;
        }
        if (callStateRef.current !== 'idle') {
          void teardownVoice();
          setCallState('idle');
        }
      });

      ws.addEventListener('message', (evt) => {
        if (typeof evt.data !== 'string') {
          console.warn('[voice] unexpected binary frame, ignoring', evt.data);
          return;
        }
        let msg: Record<string, unknown>;
        try {
          msg = JSON.parse(evt.data);
        } catch {
          console.warn('[voice] non-JSON frame', evt.data);
          return;
        }
        const type = typeof msg.type === 'string' ? msg.type : '';
        if (type !== 'audio.output') console.log('[voice] ←', type, msg);

        if (type === 'session.ready' && !ready) {
          ready = true;
          resolve();
          return;
        }
        handleServerMessage(type, msg);
      });
    });
  }

  function pingAgentSpeaking() {
    setAgentSpeaking(true);
    if (agentSpeakTimerRef.current) window.clearTimeout(agentSpeakTimerRef.current);
    agentSpeakTimerRef.current = window.setTimeout(() => setAgentSpeaking(false), 700);
  }

  function appendTurn(role: TurnRole, text: string) {
    setTranscript((t) => {
      const last = t[t.length - 1];
      if (last && last.role === role) {
        const sep = /\s$/.test(last.text) || /^\s/.test(text) ? '' : ' ';
        return [...t.slice(0, -1), { role, text: last.text + sep + text }];
      }
      return [...t, { role, text }];
    });
  }

  function handleServerMessage(type: string, msg: Record<string, unknown>) {
    switch (type) {
      case 'audio.output': {
        if (typeof msg.data === 'string') {
          const int16 = base64ToInt16(msg.data);
          recvRef.current += int16.byteLength;
          setBytesRecv(recvRef.current);
          enqueuePlayback(int16);
          pingAgentSpeaking();
        }
        break;
      }
      case 'transcript.input': {
        if (typeof msg.text === 'string') {
          const text = msg.text;
          if (msg.final) {
            appendTurn('user', text);
            setLivePartial((p) => ({ ...p, user: undefined }));
          } else {
            setLivePartial((p) => ({ ...p, user: text }));
          }
        }
        break;
      }
      case 'transcript.output': {
        if (typeof msg.text === 'string') {
          const text = msg.text;
          if (msg.final) {
            appendTurn('agent', text);
            setLivePartial((p) => ({ ...p, agent: undefined }));
          } else {
            setLivePartial((p) => ({ ...p, agent: text }));
          }
          pingAgentSpeaking();
        }
        break;
      }
      case 'tool.started':
      case 'tool.completed':
        break;
      case 'session.closed': {
        const reason = typeof msg.reason === 'string' ? msg.reason : '';
        if (reason) console.log('[voice] session.closed reason:', reason);
        void teardownVoice();
        setCallState('idle');
        break;
      }
      case 'error': {
        if (typeof msg.message === 'string') setVoiceError(msg.message);
        break;
      }
      default:
        break;
    }
  }

  async function startMic() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 },
    });
    micStreamRef.current = stream;

    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    if (!workletUrlRef.current) {
      const blob = new Blob([downsamplerWorklet], { type: 'application/javascript' });
      workletUrlRef.current = URL.createObjectURL(blob);
    }
    await ctx.audioWorklet.addModule(workletUrlRef.current);

    const source = ctx.createMediaStreamSource(stream);
    const node = new AudioWorkletNode(ctx, 'pcm-downsampler', {
      processorOptions: { targetRate: 16000, frameSamples: 320 },
    });
    node.port.onmessage = (evt) => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      const buf = evt.data as ArrayBuffer;
      const int16 = new Int16Array(buf);
      const data = int16ToBase64(int16);
      ws.send(JSON.stringify({
        type: 'audio.input',
        mime_type: 'audio/pcm;rate=16000',
        data,
      }));
      sentRef.current += buf.byteLength;
    };
    source.connect(node);
    workletNodeRef.current = node;

    if (sentTickRef.current) window.clearInterval(sentTickRef.current);
    sentTickRef.current = window.setInterval(() => setBytesSent(sentRef.current), 500);
    console.log('[voice] mic started, ctx rate', ctx.sampleRate);
  }

  function enqueuePlayback(int16: Int16Array) {
    if (!playbackCtxRef.current) {
      playbackCtxRef.current = new AudioContext({ sampleRate: 24000 });
      playbackTimeRef.current = playbackCtxRef.current.currentTime;
    }
    const ctx = playbackCtxRef.current;
    if (int16.length === 0) return;
    const f32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) f32[i] = int16[i] / 0x8000;

    const audioBuffer = ctx.createBuffer(1, f32.length, 24000);
    audioBuffer.copyToChannel(f32, 0);
    const src = ctx.createBufferSource();
    src.buffer = audioBuffer;
    src.connect(ctx.destination);

    const startAt = Math.max(ctx.currentTime, playbackTimeRef.current);
    src.start(startAt);
    playbackTimeRef.current = startAt + audioBuffer.duration;
  }

  async function endCall() {
    if (callState === 'idle' || callState === 'ending') return;
    setCallState('ending');

    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({ type: 'session.end', reason: 'platform_user_ended' }));
      } catch {}
    }

    const id = callSessionIdRef.current;
    if (id) {
      try {
        await fetch(`/api/ai/voice/end/${encodeURIComponent(id)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: 'platform_user_ended' }),
        });
      } catch {}
    }

    await teardownVoice();
    setCallState('idle');
  }

  async function teardownVoice() {
    if (sentTickRef.current) {
      window.clearInterval(sentTickRef.current);
      sentTickRef.current = null;
    }
    if (agentSpeakTimerRef.current) {
      window.clearTimeout(agentSpeakTimerRef.current);
      agentSpeakTimerRef.current = null;
    }
    setAgentSpeaking(false);
    try { workletNodeRef.current?.disconnect(); } catch {}
    workletNodeRef.current = null;

    try { micStreamRef.current?.getTracks().forEach((t) => t.stop()); } catch {}
    micStreamRef.current = null;

    try { await audioCtxRef.current?.close(); } catch {}
    audioCtxRef.current = null;

    try { await playbackCtxRef.current?.close(); } catch {}
    playbackCtxRef.current = null;
    playbackTimeRef.current = 0;

    const ws = wsRef.current;
    wsRef.current = null;
    callSessionIdRef.current = null;
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      try { ws.close(); } catch {}
    }
  }

  // ---------------- UI ----------------
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#088178] px-5 py-3 text-white shadow-lg transition hover:bg-[#055b55]"
        aria-label="Open AI assistant"
      >
        <FaRobot className="text-lg" />
        <span className="font-medium">AI Assistant</span>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-[#088178] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <FaRobot />
              <span className="font-semibold">Joy Mart Assistant</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 hover:bg-white/10"
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex border-b border-gray-200 bg-gray-50">
            <TabButton active={tab === 'chat'} onClick={() => setTab('chat')} icon={<FaComments />} label="Chat" />
            <TabButton active={tab === 'voice'} onClick={() => setTab('voice')} icon={<FaMicrophone />} label="Voice" />
          </div>

          {tab === 'chat' ? (
            <div className="flex h-[420px] flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m, i) => (
                  <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                    <div
                      className={
                        m.role === 'user'
                          ? 'max-w-[80%] rounded-2xl rounded-br-sm bg-[#088178] px-3 py-2 text-sm text-white'
                          : 'max-w-[80%] rounded-2xl rounded-bl-sm bg-gray-100 px-3 py-2 text-sm text-gray-800'
                      }
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {sending && <TypingIndicator />}
                {chatError && <div className="text-xs text-red-600">{chatError}</div>}
                <div ref={messagesEndRef} />
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); void sendMessage(); }}
                className="flex items-center gap-2 border-t border-gray-200 p-3"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message…"
                  disabled={sending}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-[#088178] focus:outline-none focus:ring-1 focus:ring-[#088178] disabled:bg-gray-50"
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="flex items-center justify-center rounded-lg bg-[#088178] p-2.5 text-white hover:bg-[#055b55] disabled:opacity-50"
                  aria-label="Send"
                >
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex h-[420px] flex-col">
              {(callState === 'live' || callState === 'ending') && (
                <VoiceStatusBar agentSpeaking={agentSpeaking} ending={callState === 'ending'} />
              )}

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {callState === 'idle' && transcript.length === 0 && (
                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                    Tap the mic to start a live voice chat with our assistant. We’ll ask for microphone access.
                  </div>
                )}
                {callState === 'connecting' && (
                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">Connecting…</div>
                )}
                {voiceError && <div className="rounded-lg bg-red-50 p-2 text-xs text-red-700">{voiceError}</div>}

                {transcript.map((t, i) => (
                  <Bubble key={i} role={t.role} text={t.text} />
                ))}
                {livePartial.user && <Bubble role="user" text={livePartial.user} partial />}
                {livePartial.agent && <Bubble role="agent" text={livePartial.agent} partial />}

                {(callState === 'live' || callState === 'ending') && (
                  <div className="flex justify-between pt-2 text-[10px] text-gray-400">
                    <span>↑ {(bytesSent / 1024).toFixed(1)} KB</span>
                    <span>↓ {(bytesRecv / 1024).toFixed(1)} KB</span>
                  </div>
                )}
                <div ref={transcriptEndRef} />
              </div>

              <div className="flex items-center justify-center gap-3 border-t border-gray-200 p-4">
                {callState === 'live' || callState === 'ending' ? (
                  <button
                    type="button"
                    onClick={() => void endCall()}
                    disabled={callState === 'ending'}
                    className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    <FaPhoneSlash /> End call
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => void startCall()}
                    disabled={callState === 'connecting'}
                    className="flex items-center gap-2 rounded-full bg-[#088178] px-5 py-3 text-white hover:bg-[#055b55] disabled:opacity-60"
                  >
                    <FaMicrophone /> {callState === 'connecting' ? 'Connecting…' : 'Start voice call'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

const TYPING_PHRASES = [
  'Thinking',
  'Pondering',
  'Reasoning',
  'Brewing ideas',
  'Composing',
  'Writing',
  'Crafting reply',
  'Putting it together',
];

function TypingIndicator() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * TYPING_PHRASES.length));
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % TYPING_PHRASES.length), 1500);
    return () => clearInterval(t);
  }, []);
  const phrase = TYPING_PHRASES[idx];
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-sm bg-gray-100 px-3 py-2 text-sm">
        <span
          key={phrase}
          className="ai-typing-shimmer inline-block font-medium ai-typing-fade"
        >
          {phrase}
          <span className="ai-typing-ellipsis" aria-hidden>
            <span>.</span><span>.</span><span>.</span>
          </span>
        </span>
      </div>
      <style>{`
        .ai-typing-shimmer {
          background: linear-gradient(90deg, #9ca3af 0%, #088178 35%, #14b8a6 50%, #088178 65%, #9ca3af 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: ai-typing-shimmer 2.2s linear infinite;
        }
        @keyframes ai-typing-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .ai-typing-fade {
          animation: ai-typing-shimmer 2.2s linear infinite, ai-typing-fade 0.5s ease-out;
        }
        @keyframes ai-typing-fade {
          0%   { opacity: 0; transform: translateY(2px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .ai-typing-ellipsis span {
          display: inline-block;
          animation: ai-typing-dot 1.2s infinite ease-in-out;
        }
        .ai-typing-ellipsis span:nth-child(2) { animation-delay: 0.2s; }
        .ai-typing-ellipsis span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes ai-typing-dot {
          0%, 60%, 100% { opacity: 0.2; transform: translateY(0); }
          30%           { opacity: 1;   transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
}

function Bubble({ role, text, partial }: { role: TurnRole; text: string; partial?: boolean }) {
  const isUser = role === 'user';
  return (
    <div className={isUser ? 'flex justify-end' : 'flex justify-start'}>
      <div
        className={
          (isUser
            ? 'bg-[#088178] text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-800 rounded-bl-sm') +
          ' max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words ' +
          (partial ? 'opacity-60 italic' : '')
        }
      >
        {text}
      </div>
    </div>
  );
}

function VoiceStatusBar({ agentSpeaking, ending }: { agentSpeaking: boolean; ending: boolean }) {
  const label = ending ? 'Ending the call…' : agentSpeaking ? 'Agent is speaking…' : 'Listening…';
  return (
    <div className="flex items-center gap-2 border-b border-gray-200 bg-[#088178]/5 px-4 py-2 text-xs font-medium text-[#088178]">
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={
            'absolute inline-flex h-full w-full rounded-full ' +
            (agentSpeaking ? 'bg-[#088178]/40' : 'bg-emerald-400/60') +
            ' animate-ping'
          }
        />
        <span
          className={
            'relative inline-flex h-2.5 w-2.5 rounded-full ' +
            (agentSpeaking ? 'bg-[#088178]' : 'bg-emerald-500')
          }
        />
      </span>
      {label}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition ' +
        (active
          ? 'bg-white text-[#088178] border-b-2 border-[#088178]'
          : 'text-gray-600 hover:text-[#088178]')
      }
    >
      {icon}
      {label}
    </button>
  );
}
