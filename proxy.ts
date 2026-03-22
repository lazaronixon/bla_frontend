import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/sign-in', '/sign-up']

function redirectTo(path: string, req: NextRequest) {
  return NextResponse.redirect(new URL(path, req.nextUrl))
}

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isPublicRoute = publicRoutes.includes(path)

  const session = req.cookies.get('bla_session')?.value
  const role = req.cookies.get('bla_role')?.value

  if (isPublicRoute) {
    return NextResponse.next()
  }

  if (!session || !role) {
    return redirectTo('/sign-in', req)
  }

  if (path.startsWith('/librarian') && role !== 'librarian') {
    return redirectTo('/sign-in', req)
  }

  if (path.startsWith('/member') && role !== 'member') {
    return redirectTo('/sign-in', req)
  }

  if (path === '/') {
    return redirectTo(role === 'librarian' ? '/librarian' : '/member', req)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
