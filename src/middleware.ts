// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

// Enhanced security middleware with improved JWT handling
export async function middleware(request: NextRequest) {
  const protectedRoutes = ['/dashboard', '/profile', '/settings', '/booking', '/bookingHistory', '/OrderTrackingPage', '/wishlist'];
  const authRoutes = ['/login', '/register']
  const currentPath = request.nextUrl.pathname
  let token = request.cookies.get('authToken')?.value

  const headersToken = request.headers.get('authorization')
  if (!token && headersToken) {
    // Extract token from Bearer header if present
    if (headersToken.startsWith('Bearer ')) {
      token = headersToken.substring(7)
    } else {
      token = headersToken
    }
  }

  const authHandler = async () => {
    try {
      const refreshToken = request.cookies.get('refreshToken')?.value

      // Validate that we have a refresh token before attempting refresh
      if (!refreshToken) {
        return null
      }

      // Guard: in production, never hit a missing or localhost BACKEND_URL — the
      // fetch would otherwise hang the entire page request until the function
      // times out.
      const backendUrl = process.env.BACKEND_URL
      if (!backendUrl || /^https?:\/\/(localhost|127\.0\.0\.1)/i.test(backendUrl)) {
        if (process.env.NODE_ENV === 'production') {
          console.warn('[middleware] BACKEND_URL missing or localhost in prod; skipping refresh')
          return null
        }
      }

      const response = await fetch(`${backendUrl}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`, // Use Authorization header instead of body
        },
        // Hard cap so a slow/dead backend cannot hang the entire page response.
        signal: AbortSignal.timeout(3000),
      })

      if (response.ok) {
        const data = await response.json()

        if (!data.accessToken) {
          console.error('No access token returned from refresh endpoint')
          return null
        }

        token = data.accessToken

        // Decode the new token
        let decodedToken
        try {
          decodedToken = jwtDecode(data.accessToken)
        } catch (decodeError) {
          console.error('Failed to decode refreshed token:', decodeError)
          return null
        }

        // Clone the request to modify headers
        const res = NextResponse.next()

        // Set the new authToken cookie with enhanced security
        res.cookies.set('authToken', data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 2, // 2 hours
          path: '/',
          domain: process.env.NODE_ENV === 'production' ? undefined : undefined // Adjust domain if needed
        })

        // Optionally update refreshToken if a new one was provided
        if (data.refreshToken) {
          res.cookies.set('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? undefined : undefined
          })
        }

        return res
      } else {
        console.error('Token refresh failed with status:', response.status)
        // If refresh fails, clear invalid tokens
        const res = NextResponse.next()
        res.cookies.delete('authToken')
        res.cookies.delete('refreshToken')
        return res
      }
    } catch (error) {
      console.error('Failed to refresh token:', error)
      // On error, return response without modifying cookies
      return NextResponse.next()
    }
  }

  // Check if authToken is expired
  let isTokenExpired = false
  let decodedToken: any = null

  if (token) {
    try {
      decodedToken = jwtDecode(token)

      // Validate token structure
      if (!decodedToken.exp || !decodedToken.iat) {
        console.error('Invalid token: missing expiration or issued at time')
        isTokenExpired = true
      } else {
        isTokenExpired = Date.now() >= decodedToken.exp * 1000

        // Check if token was issued in the future (possible replay attack)
        if (Date.now() < decodedToken.iat * 1000) {
          console.error('Invalid token: issued in the future')
          isTokenExpired = true
        }
      }
    } catch (error) {
      console.error('Failed to decode token:', error)
      isTokenExpired = true
    }
  }

  // If token is expired but refreshToken exists, try to refresh
  if (!token || isTokenExpired) {
    const refreshResult = await authHandler()
    if (refreshResult) {
      return refreshResult
    }
  }

  const isAuthenticated = Boolean(token && !isTokenExpired)

  // 1. Protect private routes
  if (protectedRoutes.some(route => currentPath.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', currentPath)
      return NextResponse.redirect(loginUrl)
    }

    // Special check for dashboard route
    if (currentPath.startsWith('/dashboard')) {
      const isAuthorized = decodedToken &&
                          (decodedToken.role === 'admin' ||
                           decodedToken.role === 'superAdmin' ||
                           decodedToken.role === 'seller');

      if (!isAuthorized) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  // 2. Redirect authenticated users from auth routes (login/register)
  if (authRoutes.includes(currentPath)) {
    if (isAuthenticated) {
      // Redirect to appropriate page based on role
      if (decodedToken) {
        if (decodedToken.role === 'admin' ||
            decodedToken.role === 'superAdmin' ||
            decodedToken.role === 'seller') {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Strict Transport Security (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|_next/webpack-hmr|public/|static/).*)',
  ],
}
