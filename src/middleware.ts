import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

const roleRoutes: Record<string, string> = {
  ADMIN: '/admin',
  CENTRAL: '/central',
  STATE: '/state',
  DISTRICT: '/district',
  AGENCY: '/agency',
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Login pages are always accessible
  if (path === '/admin/login' || path === '/login') {
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Not logged in
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const role = token.role as string | undefined

  // /dashboard is allowed for any authenticated user.
  // Its page will redirect based on role.
  if (path === '/dashboard') {
    return NextResponse.next()
  }

  // Admin dashboard
  if (path.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Central dashboard
  if (path.startsWith('/central') && role !== 'CENTRAL') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // State dashboard
  if (path.startsWith('/state') && role !== 'STATE') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // District dashboard
  if (path.startsWith('/district') && role !== 'DISTRICT') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Agency dashboard
  if (path.startsWith('/agency') && role !== 'AGENCY') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/central/:path*',
    '/state/:path*',
    '/district/:path*',
    '/agency/:path*',
    '/admin/:path*',
  ],
}