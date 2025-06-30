// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

export async function middleware(request: NextRequest) {
  const protectedRoutes = ['/dashboard', '/profile', '/settings', '/booking', '/payment','/OrderTrackingPage']
  const authRoutes = ['/login', '/register']
  const currentPath = request.nextUrl.pathname
  
  // Get tokens from cookies
  let authToken = request.cookies.get('authToken')?.value

  // Check if authToken is expired
  let isTokenExpired = false
  if (authToken) {
    try {
      const decoded = jwtDecode(authToken)
      isTokenExpired = decoded.exp ? Date.now() >= decoded.exp * 1000 : false
    } catch (error) {
      isTokenExpired = true
    }
  }

  // If authToken is expired but refreshToken exists, try to refresh
  if ((!authToken||isTokenExpired)) {
    try {
      // This replaces your useGenareteAuthTokenUsingRefreshTokenMutation
      const response = await fetch(`${process.env.BACKEND_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: request.cookies.get('refreshToken')?.value }) 
      })
      console.log(response)
      if (response.ok) {
        const data = await response.json()
        authToken = data.accessToken
        
        // Clone the request to modify headers
        const res = NextResponse.next()
        
        // Set the new authToken cookie
        res.cookies.set('authToken', data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 2, 
          path: '/'
        })

        // Optionally update refreshToken if a new one was provided
        if (data.refreshToken) {
          res.cookies.set('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/'
          })
        }

        return res
      }
    } catch (error) {
      console.error('Failed to refresh token:', error)
    }
  }

  const isAuthenticated = Boolean(authToken && !isTokenExpired)

  // 1. Protect private routes
  if (protectedRoutes.some(route => currentPath.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', currentPath)
      return NextResponse.redirect(loginUrl)
    }
  }

  // 2. Redirect authenticated users from auth routes (login/register)
  if (authRoutes.includes(currentPath)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}