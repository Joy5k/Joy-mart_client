import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const baseUrl = process.env.NEXIFLOWAI_BASE_URL;
  const apiKey = process.env.NEXIFLOWAI_API_KEY;
  const agentId = process.env.NEXIFLOWAI_AGENT_ID;

  if (!baseUrl || !apiKey || !agentId) {
    return NextResponse.json(
      { success: false, message: 'AI integration is not configured.' },
      { status: 500 },
    );
  }

  const body = await req.json().catch(() => ({}));

  const upstream = await fetch(`${baseUrl}/chat/voice/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({
      agent_id: agentId,
      use_draft: false,
      initial_variables: body?.initial_variables ?? {},
      metadata: { source: 'joy-mart-contact', ...(body?.metadata ?? {}) },
    }),
  });

  const data = await upstream.json().catch(() => ({}));
  return NextResponse.json(data, { status: upstream.status });
}
