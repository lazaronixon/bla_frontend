import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/sign-in', '/sign-up']

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isPublicRoute = publicRoutes.includes(path)

  const session = req.cookies.get('bla_session')?.value
  const role = req.cookies.get('bla_role')?.value

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/sign-in', req.nextUrl))
  }

  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL(role === 'librarian' ? '/librarian' : '/member', req.nextUrl))
  }

  if (path.startsWith('/librarian') && role !== 'librarian') {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  if (path.startsWith('/member') && role !== 'member') {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  if (path === '/') {
    return NextResponse.redirect(new URL(role === 'librarian' ? '/librarian' : '/member', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
