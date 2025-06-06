// app/api/auth/social-login/route.ts
import { NextResponse } from 'next/server';

interface SocialLoginRequest {
  provider: 'google' | 'facebook';
  accessToken: string;
  email?: string;
  name?: string;
  image?: string;
}

export async function POST(request: Request) {
  try {
    const requestData: SocialLoginRequest = await request.json();
    const { provider, accessToken, email, name, image } = requestData;

    if (!provider || !accessToken) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Forward the request to your backend
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/social-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider,
        accessToken,
        email,
        name,
        image
      }),
    });

    if (!backendResponse.ok) {
      throw new Error('Authentication failed with backend');
    }

    const data = await backendResponse.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error('Social login error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Authentication failed';

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 401 }
    );
  }
}