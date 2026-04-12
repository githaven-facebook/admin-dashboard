import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

const roleRouteMap: Record<string, string[]> = {
  '/users': ['super_admin', 'content_moderator'],
  '/moderation': ['super_admin', 'content_moderator'],
  '/ads': ['super_admin', 'ad_reviewer'],
  '/analytics': ['super_admin', 'analyst', 'content_moderator', 'ad_reviewer'],
  '/system': ['super_admin'],
  '/audit': ['super_admin'],
  '/settings': ['super_admin'],
}

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const role = token.role as string

    for (const [route, allowedRoles] of Object.entries(roleRouteMap)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(role)) {
          return NextResponse.redirect(new URL('/', req.url))
        }
        break
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => Boolean(token),
    },
  }
)

export const config = {
  matcher: [
    '/((?!login|api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
