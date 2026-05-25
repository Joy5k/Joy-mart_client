// src/lib/auth.ts
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function validateToken(req: NextRequest) {
  const token = await getToken({ req });
  
  if (!token?.accessToken) {
    return null;
  }

  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl || /^https?:\/\/(localhost|127\.0\.0\.1)/i.test(backendUrl)) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[validateToken] BACKEND_URL missing or localhost in prod; skipping validate');
      return null;
    }
  }

  try {
    const response = await fetch(`${backendUrl}/api/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.accessToken}`,
      },
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Token validation failed:', error);
    return null;
  }
}