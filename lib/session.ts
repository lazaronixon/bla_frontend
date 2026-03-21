import 'server-only'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'bla_session'
const ROLE_COOKIE = 'bla_role'

export async function getSession(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE)?.value
}

export async function createSession(token: string, maxAge: number): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  })
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getRole(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(ROLE_COOKIE)?.value
}

export async function setRoleCookie(role: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(ROLE_COOKIE, role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteRoleCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ROLE_COOKIE)
}
