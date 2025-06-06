// src/lib/auth.ts
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function validateToken(req: NextRequest) {
  const token = await getToken({ req });
  
  if (!token?.accessToken) {
    return null;
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.accessToken}`,
      },
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