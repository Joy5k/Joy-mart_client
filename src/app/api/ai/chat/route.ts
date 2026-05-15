import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const baseUrl = process.env.NEXIFLOWAI_BASE_URL;
  const apiKey = process.env.NEXIFLOWAI_API_KEY;
  const agentId = process.env.NEXIFLOWAI_AGENT_ID;

  if (!baseUrl || !apiKey || !agentId) {
    return NextResponse.json(
      {
        success: false,
        message: 'AI integration is not configured.',
        debug: { hasBaseUrl: !!baseUrl, hasApiKey: !!apiKey, hasAgentId: !!agentId },
      },
      { status: 500 },
    );
  }

  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const message = typeof body?.message === 'string' ? body.message : '';
  if (!message.trim()) {
    return NextResponse.json(
      { success: false, message: 'message is required' },
      { status: 400 },
    );
  }

  const payload: Record<string, unknown> = { agentId, message };
  if (typeof body?.sessionId === 'string') payload.sessionId = body.sessionId;
  if (body?.dynamicVariables && typeof body.dynamicVariables === 'object') {
    payload.dynamicVariables = body.dynamicVariables;
  }

  const url = `${baseUrl}/chat/single-prompt/prompt/stream`;
  const upstream = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!upstream.ok || !upstream.body) {
    const raw = await upstream.text().catch(() => '');
    let parsed: Record<string, unknown> | null = null;
    try { parsed = JSON.parse(raw); } catch {}
    const message =
      (parsed && typeof parsed.message === 'string' && parsed.message) ||
      raw.slice(0, 500) ||
      `Upstream ${upstream.status}`;
    console.error('[ai/chat] upstream', upstream.status, message);
    return NextResponse.json(
      { success: false, message },
      { status: upstream.status || 502 },
    );
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
