import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/']
const publicRoutes = ['/sign-in', '/sign-up']

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  const session = req.cookies.get('bla_session')?.value

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/sign-in', req.nextUrl))
  }

  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
