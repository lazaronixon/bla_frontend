import { NextRequest, NextResponse } from 'next/server'

const roles = ['librarian', 'member']
const publicRoutes = ['/sign-in', '/sign-up']

function redirectTo(path: string, req: NextRequest) {
  return NextResponse.redirect(new URL(path, req.nextUrl))
}

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const segments = path.split('/').filter(Boolean)
  const isPublicRoute = publicRoutes.includes(path)

  const session = req.cookies.get('bla_session')?.value
  const role = req.cookies.get('bla_role')?.value

  if (isPublicRoute) {
    return NextResponse.next()
  }

  if (!session || !role || !roles.includes(role)) {
    return redirectTo('/sign-in', req)
  }

  if (segments[0] === 'librarian' && role !== 'librarian') {
    return redirectTo('/', req)
  }

  if (segments[0] === 'member' && role !== 'member') {
    return redirectTo('/', req)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
