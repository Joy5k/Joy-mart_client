// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const protectedRoutes = ['/dashboard', '/profile', '/settings','/booking']
  const authRoutes = ['/login', '/register'] // Separate auth-specific routes
  const currentPath = request.nextUrl.pathname
  const token = request.cookies.get('authToken')?.value
  const isAuthenticated = Boolean(token)

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

  // 3. Allow all access to homepage (/) regardless of auth state
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}