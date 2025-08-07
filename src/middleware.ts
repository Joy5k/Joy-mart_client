// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'
import { getToken } from './utils/localStorageManagement'

export async function middleware(request: NextRequest) {
  const protectedRoutes = ['/dashboard', '/profile', '/settings', '/booking', '/payment','/OrderTrackingPage']
  const authRoutes = ['/login', '/register']
  const currentPath = request.nextUrl.pathname
  let token = request.cookies.get('authToken')?.value

  const authHandler=async()=>{
        try {
      const response = await fetch(`${process.env.BACKEND_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: request.cookies.get('refreshToken')?.value }) 
      })
      if (response.ok) {
        const data = await response.json()
        token = data.accessToken
        
        // Decode the new token
        if (token) {
          decodedToken = jwtDecode(token)
        }

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

  // Get tokens from cookies

  // Check if authToken is expired
  let isTokenExpired = false
  let decodedToken: any = null
  
  if (token) {
    try {
      decodedToken = jwtDecode(token)
      isTokenExpired = decodedToken.exp ? Date.now() >= decodedToken.exp * 1000 : false
    } catch (error) {
      isTokenExpired = true
    }
  }

  // If token is expired but refreshToken exists, try to refresh
  if (!token) {
        authHandler()
  } 
   if (isTokenExpired){
    authHandler()
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

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}
