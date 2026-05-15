import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const baseUrl = process.env.NEXIFLOWAI_BASE_URL;
  const apiKey = process.env.NEXIFLOWAI_API_KEY;
  if (!baseUrl || !apiKey) {
    return NextResponse.json(
      { success: false, message: 'AI integration is not configured.' },
      { status: 500 },
    );
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));

  const upstream = await fetch(`${baseUrl}/chat/voice/sessions/${encodeURIComponent(id)}/end`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({ reason: body?.reason ?? 'platform_user_ended' }),
  });

  const data = await upstream.json().catch(() => ({}));
  return NextResponse.json(data, { status: upstream.status });
}
